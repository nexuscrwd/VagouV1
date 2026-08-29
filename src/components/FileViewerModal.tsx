import React, { useState, useEffect } from 'react';
import { DriveFile } from '../types';
import { formatBytes } from '../services/driveApi';
import {
  X,
  ExternalLink,
  Sparkles,
  Download,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Folder,
  Calendar,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface FileViewerModalProps {
  file: DriveFile | null;
  accessToken: string | null;
  onClose: () => void;
  onAnalyze: (file: DriveFile) => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  file,
  accessToken,
  onClose,
  onAnalyze,
}) => {
  const [zoom, setZoom] = useState(1);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [loadingBlob, setLoadingBlob] = useState(false);

  useEffect(() => {
    setZoom(1);
    if (file && file.category === 'image' && accessToken) {
      setLoadingBlob(true);
      fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Falha ao baixar imagem');
          return res.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageBlobUrl(url);
          setLoadingBlob(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingBlob(false);
        });
    } else {
      setImageBlobUrl(null);
    }

    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [file?.id, accessToken]);

  if (!file) return null;

  const isImage = file.category === 'image';
  const isVideo = file.category === 'video';
  const isFigma = file.category === 'figma';

  return (
    <div
      id="file-viewer-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="file-viewer-dialog"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              {isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : isVideo ? (
                <VideoIcon className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div className="truncate">
              <h3 className="text-base font-semibold text-white truncate">{file.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span>{file.mimeType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-analyze-modal-trigger"
              onClick={() => onAnalyze(file)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisar Estrutura com IA</span>
            </button>

            {file.webViewLink && (
              <a
                id="link-open-drive"
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Abrir no Google Drive"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              id="btn-close-viewer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-950 p-6 overflow-auto flex items-center justify-center min-h-[360px] max-h-[60vh] relative">
          {isImage ? (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {loadingBlob ? (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Carregando imagem em alta resolução...</span>
                </div>
              ) : imageBlobUrl || file.thumbnailLink ? (
                <div className="overflow-hidden flex items-center justify-center w-full h-full">
                  <img
                    src={imageBlobUrl || file.thumbnailLink?.replace('=s220', '=s1600')}
                    alt={file.name}
                    className="max-h-[50vh] max-w-full object-contain rounded-lg transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              ) : (
                <div className="text-slate-500 text-sm">Visualização de imagem indisponível</div>
              )}

              {/* Zoom Controls */}
              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-lg">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 px-1">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                  title="Restaurar Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* Drive embedded video preview */}
              <iframe
                src={`https://drive.google.com/file/d/${file.id}/preview`}
                title={file.name}
                className="w-full h-[50vh] rounded-lg border border-slate-800"
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">{file.name}</h4>
              <p className="text-xs text-slate-400 mb-6">
                Este arquivo pode ser inspecionado pela IA para extrair arquitetura, componentes e estruturação.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onAnalyze(file)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar com IA</span>
                </button>
                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir no Drive</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Modificado em:{' '}
              {file.modifiedTime
                ? new Date(file.modifiedTime).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--'}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> ID: {file.id}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Dica: Clique em &quot;Analisar Estrutura com IA&quot; para gerar o blueprint de componentes
          </div>
        </div>
      </div>
    </div>
  );
};
