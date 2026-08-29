import React, { useState, useEffect } from 'react';
import { DriveFile, ScreenAnalysis } from '../types';
import { fetchFileBlob, blobToBase64 } from '../services/driveApi';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Layout,
  Code2,
  Palette,
  Compass,
  FileCheck2,
  RefreshCw,
  Send,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StructureAnalyzerModalProps {
  file: DriveFile | null;
  accessToken: string | null;
  onClose: () => void;
}

export const StructureAnalyzerModal: React.FC<StructureAnalyzerModalProps> = ({
  file,
  accessToken,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ScreenAnalysis | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'screens' | 'architecture' | 'tokens' | 'blueprint' | 'recommendations'>('screens');

  const runAnalysis = async (customContext?: string) => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      let imageBase64: string | undefined = undefined;
      let mimeType = file.mimeType;

      // If it's an image and we have an accessToken, download the image blob and convert to base64
      if (file.category === 'image' && accessToken) {
        try {
          const blob = await fetchFileBlob(file.id, accessToken);
          imageBase64 = await blobToBase64(blob);
          mimeType = blob.type || file.mimeType;
        } catch (blobErr) {
          console.warn('Não foi possível obter o blob da imagem, prosseguindo com metadados:', blobErr);
        }
      }

      const response = await fetch('/api/analyze-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.category,
          mimeType: mimeType,
          imageBase64: imageBase64,
          additionalContext: customContext || additionalPrompt || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha na análise estrutural com Gemini');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao analisar o arquivo. Verifique sua chave do Gemini ou conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      runAnalysis();
    }
  }, [file?.id]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const exportFullMarkdown = () => {
    if (!analysis) return '';
    return `# Análise Estrutural & Telas: ${analysis.title}

## Resumo
${analysis.summary}

## Telas & Seções Identificadas
${analysis.screensIdentified.map((s) => `### ${s.name}\n- **Propósito:** ${s.purpose}\n- **Descrição:** ${s.description}\n- **Elementos-chave:**\n${s.keyElements.map((e) => `  - ${e}`).join('\n')}`).join('\n\n')}

## Arquitetura de Informação & Fluxo
### Hierarquia:
${analysis.informationArchitecture.hierarchy.map((h) => `- ${h}`).join('\n')}

### Fluxo de Usuário:
${analysis.informationArchitecture.userFlows.map((f) => `- ${f}`).join('\n')}

## Design Tokens
- **Cores Principais:** ${analysis.designTokens.primaryColors.join(', ')}
- **Tipografia:** ${analysis.designTokens.typographyHints.join(', ')}
- **Grid de Layout:** ${analysis.designTokens.layoutGrid}

## Blueprint de Componentes React & Tailwind
${analysis.componentBlueprint.map((c) => `### \`<${c.component} />\`\n- **Props:** ${c.propsDescription}\n- **Classes Tailwind:** \`${c.tailwindClassHints}\``).join('\n\n')}

## Recomendações
${analysis.recommendations.map((r) => `- ${r}`).join('\n')}
`;
  };

  if (!file) return null;

  return (
    <div
      id="structure-analyzer-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="structure-analyzer-dialog"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Análise Estrutural de Telas & UI
                </h3>
                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Arquivo: <span className="text-slate-200 font-medium">{file.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysis && (
              <button
                id="btn-copy-full-analysis"
                onClick={() => copyToClipboard(exportFullMarkdown(), 'full-md')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                title="Copiar relatório completo em Markdown"
              >
                {copiedSection === 'full-md' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Markdown</span>
                  </>
                )}
              </button>
            )}

            <button
              id="btn-close-analyzer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {analysis && (
          <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('screens')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'screens'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-4 h-4" />
              Telas & Seções ({analysis.screensIdentified.length})
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              Arquitetura & Fluxo
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'blueprint'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Blueprint de Componentes ({analysis.componentBlueprint.length})
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'tokens'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              Design Tokens & Cores
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'recommendations'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Recomendações
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Analisando telas e estruturação...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Extraindo arquitetura da informação, hierarquia de componentes, paleta de cores e fluxo de navegação com IA.
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span>Não foi possível concluir a análise</span>
              </div>
              <p>{error}</p>
              <button
                onClick={() => runAnalysis()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Tentar novamente
              </button>
            </div>
          )}

          {analysis && !loading && (
            <>
              {/* Executive Summary Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      Resumo da Estrutura
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">{analysis.title}</h2>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{analysis.summary}</p>
                  </div>
                </div>
              </div>

              {/* Tab 1: Screens & Sections */}
              {activeTab === 'screens' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.screensIdentified.map((screen, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-850 border border-slate-750 rounded-xl p-5 hover:border-slate-650 transition shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Tela {idx + 1}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white mb-1.5">{screen.name}</h4>
                          <p className="text-xs text-slate-300 mb-3">{screen.description}</p>

                          <div className="mb-4">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Elementos Principais:
                            </span>
                            <ul className="space-y-1">
                              {screen.keyElements.map((el, elIdx) => (
                                <li
                                  key={elIdx}
                                  className="text-xs text-slate-300 flex items-start gap-1.5"
                                >
                                  <span className="text-indigo-400 mt-0.5">•</span>
                                  <span>{el}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                          <span>
                            <strong className="text-slate-300">Objetivo:</strong> {screen.purpose}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Information Architecture & User Flow */}
              {activeTab === 'architecture' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hierarchy */}
                  <div className="bg-slate-850 border border-slate-750 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Hierarquia da Informação
                    </h4>
                    <div className="space-y-2.5">
                      {analysis.informationArchitecture.hierarchy.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Flow */}
                  <div className="bg-slate-850 border border-slate-750 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      Jornada do Usuário (User Flow)
                    </h4>
                    <div className="space-y-3">
                      {analysis.informationArchitecture.userFlows.map((flow, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 relative"
                        >
                          <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                          <span className="leading-relaxed">{flow}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Component Blueprint */}
              {activeTab === 'blueprint' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.componentBlueprint.map((comp, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-850 border border-slate-750 rounded-xl p-5 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-800/50">
                              {`<${comp.component} />`}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `// Component: ${comp.component}\n// Props: ${comp.propsDescription}\n// Tailwind: ${comp.tailwindClassHints}`,
                                  `comp-${idx}`
                                )
                              }
                              className="text-slate-400 hover:text-white p-1 rounded"
                              title="Copiar especificação do componente"
                            >
                              {copiedSection === `comp-${idx}` ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <div className="space-y-2.5 mb-4">
                            <div>
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Props & Estado:
                              </span>
                              <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono">
                                {comp.propsDescription}
                              </p>
                            </div>

                            <div>
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Estilização Tailwind:
                              </span>
                              <p className="text-xs text-emerald-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono break-words">
                                {comp.tailwindClassHints}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Design Tokens & Palette */}
              {activeTab === 'tokens' && (
                <div className="space-y-6">
                  {/* Colors */}
                  <div className="bg-slate-850 border border-slate-750 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-indigo-400" />
                      Paleta de Cores Identificada
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {analysis.designTokens.primaryColors.map((colorStr, idx) => {
                        const hexMatch = colorStr.match(/#[0-9a-fA-F]{3,8}/);
                        const hex = hexMatch ? hexMatch[0] : '#6366f1';
                        return (
                          <div
                            key={idx}
                            onClick={() => copyToClipboard(hex, `color-${idx}`)}
                            className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-indigo-500/50 transition group"
                          >
                            <div
                              className="w-8 h-8 rounded-lg shadow border border-white/10 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-semibold text-white truncate block">
                                {colorStr}
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover:text-indigo-400 font-mono">
                                {copiedSection === `color-${idx}` ? 'Copiado!' : 'Clique para copiar'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography and Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-850 border border-slate-750 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-3">Diretrizes Tipográficas</h4>
                      <ul className="space-y-2">
                        {analysis.designTokens.typographyHints.map((hint, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800"
                          >
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-850 border border-slate-750 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-3">Malha & Grid</h4>
                      <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                        {analysis.designTokens.layoutGrid}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Recommendations */}
              {activeTab === 'recommendations' && (
                <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Recomendações Técnicas e de UX
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Refinement Prompt Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              id="input-refine-prompt"
              type="text"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && runAnalysis()}
              placeholder="Ex: 'Foque nos estados de erro da tela de checkout' ou 'Explique o fluxo do modal do vídeo'..."
              className="w-full bg-slate-950 border border-slate-750 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="btn-refine-analysis"
            onClick={() => runAnalysis()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Refinar Análise</span>
          </button>
        </div>
      </div>
    </div>
  );
};
