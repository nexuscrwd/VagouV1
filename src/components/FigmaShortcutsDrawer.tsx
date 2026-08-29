import React from 'react';
import {
  X,
  Sparkles,
  Search,
  Layers,
  Video,
  FileCode,
  FolderSearch,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface FigmaShortcutsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (query: string, category: 'all' | 'design' | 'video' | 'folder' | 'document') => void;
}

export const FigmaShortcutsDrawer: React.FC<FigmaShortcutsDrawerProps> = ({
  isOpen,
  onClose,
  onApplySearch,
}) => {
  if (!isOpen) return null;

  const quickPresets = [
    {
      label: 'Telas & Protótipos Figma',
      desc: 'Busca por termos como "figma", "tela", "wireframe", "prototipo" e formatos de imagem',
      query: 'figma',
      category: 'design' as const,
      icon: Layers,
      color: 'text-indigo-400',
    },
    {
      label: 'Vídeos de Estruturação & Walkthrough',
      desc: 'Filtra gravações em MP4, MOV e vídeos de apresentação da arquitetura',
      query: '',
      category: 'video' as const,
      icon: Video,
      color: 'text-rose-400',
    },
    {
      label: 'Arquivos .FIG e Exportações',
      desc: 'Busca direta por arquivos nativos do Figma (.fig) e assets de design',
      query: '.fig',
      category: 'design' as const,
      icon: FileCode,
      color: 'text-purple-400',
    },
    {
      label: 'Todas as Pastas do Drive',
      desc: 'Navegue pelas pastas organizadas do seu Google Drive',
      query: '',
      category: 'folder' as const,
      icon: FolderSearch,
      color: 'text-amber-400',
    },
  ];

  return (
    <div
      id="figma-shortcuts-backdrop"
      className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="figma-shortcuts-drawer"
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Atalhos de Design & Telas</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          <p className="text-xs text-slate-400 leading-relaxed">
            Selecione um filtro pré-configurado para encontrar rapidamente suas telas do Figma, imagens de UI ou vídeos de estruturação armazenados no Google Drive:
          </p>

          <div className="space-y-3 mt-4">
            {quickPresets.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onApplySearch(preset.query, preset.category);
                    onClose();
                  }}
                  className="p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-indigo-500/40 rounded-xl cursor-pointer transition group shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-slate-900 ${preset.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {preset.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{preset.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips Section */}
          <div className="mt-8 p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Dicas de Integração
            </h5>
            <ul className="text-[11px] text-slate-400 space-y-1.5 leading-normal">
              <li>• Ao clicar em qualquer arquivo de imagem ou vídeo, você pode visualizá-lo em alta qualidade.</li>
              <li>• O botão <strong>&quot;Analisar com IA&quot;</strong> aciona o modelo Gemini para decompor as telas em componentes reutilizáveis, fluxo de navegação e paleta de cores.</li>
              <li>• Você pode navegar pelas subpastas clicando duas vezes ou usando as migalhas de pão no topo.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            Conectado com Google Drive API v3
          </span>
        </div>
      </div>
    </div>
  );
};
