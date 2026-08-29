import React, { useState } from 'react';
import { DriveFile, DriveFolderBreadcrumb } from '../types';
import { formatBytes } from '../services/driveApi';
import {
  Search,
  Grid,
  List,
  Folder,
  Image as ImageIcon,
  Video as VideoIcon,
  FileCode,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Calendar,
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface DriveExplorerProps {
  files: DriveFile[];
  isLoading: boolean;
  searchQuery: string;
  categoryFilter: 'all' | 'design' | 'video' | 'folder' | 'document';
  breadcrumbs: DriveFolderBreadcrumb[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: 'all' | 'design' | 'video' | 'folder' | 'document') => void;
  onNavigateFolder: (folderId: string, folderName: string) => void;
  onNavigateBreadcrumb: (index: number) => void;
  onSelectFile: (file: DriveFile) => void;
  onAnalyzeFile: (file: DriveFile) => void;
}

export const DriveExplorer: React.FC<DriveExplorerProps> = ({
  files,
  isLoading,
  searchQuery,
  categoryFilter,
  breadcrumbs,
  onSearchChange,
  onCategoryChange,
  onNavigateFolder,
  onNavigateBreadcrumb,
  onSelectFile,
  onAnalyzeFile,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getCategoryIcon = (category?: DriveFile['category']) => {
    switch (category) {
      case 'folder':
        return <Folder className="w-5 h-5 text-amber-400" />;
      case 'figma':
        return <FileCode className="w-5 h-5 text-purple-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-indigo-400" />;
      case 'video':
        return <VideoIcon className="w-5 h-5 text-rose-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCategoryBadge = (category?: DriveFile['category']) => {
    switch (category) {
      case 'folder':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pasta
          </span>
        );
      case 'figma':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Figma / Design
          </span>
        );
      case 'image':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Tela / Imagem
          </span>
        );
      case 'video':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Vídeo / Screencast
          </span>
        );
      case 'document':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Documento
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Arquivo
          </span>
        );
    }
  };

  const quickFilterTags = [
    { label: 'Vídeos MPEG4', query: 'mp4' },
    { label: 'Vídeos', query: 'video' },
    { label: 'Telas', query: 'tela' },
    { label: 'Figma', query: 'figma' },
    { label: 'Wireframes', query: 'wireframe' },
    { label: 'Projetos', query: 'projeto' },
  ];

  const [directLinkInput, setDirectLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleOpenDirectFolder = (rawInput: string) => {
    let folderId = rawInput.trim();
    if (!folderId) return;

    // If it's a full Google Drive URL
    const match = folderId.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      folderId = match[1];
    }

    onNavigateFolder(folderId, 'Pasta do Link');
    setDirectLinkInput('');
    setShowLinkInput(false);
  };

  const SHARED_FOLDER_ID = '1WTDqI5_0Ea1-hql9pcvJlBZ-SvAhpN5-';
  const isCurrentFolderShared = breadcrumbs.some((b) => b.id === SHARED_FOLDER_ID);

  return (
    <div className="space-y-6">
      {/* Quick Shared Folder & Direct Link Bar */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/40 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white">Pasta de Telas e Vídeos Compartilhada</h3>
              {isCurrentFolderShared && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Aberta Agora
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              ID: <span className="font-mono text-indigo-300">1WTDqI5_0Ea1-hql9pcvJlBZ-SvAhpN5-</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isCurrentFolderShared && (
            <button
              id="btn-open-shared-folder"
              onClick={() => onNavigateFolder(SHARED_FOLDER_ID, 'Telas & Vídeo (Figma)')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              <Folder className="w-4 h-4 text-indigo-200" />
              <span>Abrir Pasta do Link</span>
            </button>
          )}

          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Colar outro link</span>
          </button>
        </div>
      </div>

      {showLinkInput && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex gap-2 animate-in fade-in">
          <input
            type="text"
            value={directLinkInput}
            onChange={(e) => setDirectLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenDirectFolder(directLinkInput)}
            placeholder="Cole o link completo da pasta do Google Drive (https://drive.google.com/drive/folders/...)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleOpenDirectFolder(directLinkInput)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
          >
            Abrir
          </button>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-drive-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome de tela, figma, vídeo, pastas..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-slate-950 p-1 border border-slate-800 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-indigo-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Visualização em Grade"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'list'
                    ? 'bg-slate-800 text-indigo-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Todos os Arquivos
            </button>
            <button
              onClick={() => onCategoryChange('design')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                categoryFilter === 'design'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Telas & Figma
            </button>
            <button
              onClick={() => onCategoryChange('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                categoryFilter === 'video'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5 text-rose-400" />
              Vídeos & Estruturação
            </button>
            <button
              onClick={() => onCategoryChange('folder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                categoryFilter === 'folder'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              Pastas
            </button>
          </div>

          {/* Quick Keyword Chips */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px]">Tags rápidas:</span>
            {quickFilterTags.map((tag) => (
              <button
                key={tag.query}
                onClick={() => onSearchChange(tag.query)}
                className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-800 transition"
              >
                #{tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 overflow-x-auto pb-1">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.id}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            <button
              onClick={() => onNavigateBreadcrumb(idx)}
              className={`hover:text-white transition whitespace-nowrap px-2 py-1 rounded-md ${
                idx === breadcrumbs.length - 1
                  ? 'text-indigo-400 bg-indigo-500/10 font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Loading state */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400">Consultando Google Drive...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && files.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Nenhum arquivo encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Não encontramos arquivos correspondentes aos filtros selecionados nesta pasta do Drive.
          </p>
          {(searchQuery || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
            >
              Limpar Filtros e Ver Todos
            </button>
          )}
        </div>
      )}

      {/* Files Grid View */}
      {!isLoading && files.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => {
            const isFolder = file.category === 'folder';
            return (
              <div
                key={file.id}
                onClick={() => {
                  if (isFolder) {
                    onNavigateFolder(file.id, file.name);
                  } else {
                    onSelectFile(file);
                  }
                }}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-sm transition flex flex-col justify-between group cursor-pointer"
              >
                {/* Thumbnail / Header Preview */}
                <div className="h-40 bg-slate-950 flex items-center justify-center relative overflow-hidden border-b border-slate-800/80">
                  {file.thumbnailLink ? (
                    <img
                      src={file.thumbnailLink.replace('=s220', '=s400')}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center">
                      {getCategoryIcon(file.category)}
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    {getCategoryBadge(file.category)}
                  </div>

                  {!isFolder && (
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFile(file);
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow text-xs transition"
                        title="Visualizar Tela / Mídia"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeFile(file);
                        }}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow text-xs font-semibold flex items-center gap-1.5 transition"
                        title="Analisar Estrutura com IA"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Analisar</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{formatBytes(file.size)}</span>
                      <span>
                        {file.modifiedTime
                          ? new Date(file.modifiedTime).toLocaleDateString('pt-BR')
                          : '--'}
                      </span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    {isFolder ? (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5" /> Abrir Pasta
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeFile(file);
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3 h-3" />
                        Analisar Estrutura UI
                      </button>
                    )}

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-500 hover:text-slate-300 transition"
                        title="Abrir no Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Files List View */}
      {!isLoading && files.length > 0 && viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-800">
            {files.map((file) => {
              const isFolder = file.category === 'folder';
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    if (isFolder) {
                      onNavigateFolder(file.id, file.name);
                    } else {
                      onSelectFile(file);
                    }
                  }}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-850 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="shrink-0">{getCategoryIcon(file.category)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate max-w-sm sm:max-w-md">
                          {file.name}
                        </span>
                        {getCategoryBadge(file.category)}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span>
                          Modificado:{' '}
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString('pt-BR')
                            : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isFolder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeFile(file);
                        }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-indigo-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Analisar Estrutura</span>
                      </button>
                    )}

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
