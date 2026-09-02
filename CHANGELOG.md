# 📝 Histórico de Alterações & Rastreabilidade — Vagou

Este arquivo registra cronologicamente todas as modificações relevantes realizadas no código-fonte, arquitetura e interface do projeto **Vagou**, facilitando diagnósticos rápidos, auditoria e procedimentos de rollback/backup.

---

## 📌 Formato do Registro
- **Data & Hora**
- **Tipo:** `[Fix]` (Correção), `[Feat]` (Funcionalidade), `[Refactor]` (Refatoração), `[Docs]` (Documentação)
- **Motivo / Solicitação:** Breve resumo do pedido do usuário.
- **Arquivos Impactados:** Lista de arquivos alterados/criados.
- **Resumo Técnico:** Explicação concisa da alteração.

---

## 📜 Registros de Alterações

### [2026-09-01] — Implementação da Identidade Visual Oficial (Manual de Identidade)
- **Tipo:** `[Feat]` / `[UI]` / `[Docs]`
- **Motivo:** Aplicação completa dos elementos do Manual de Identidade Visual oficial do Vagou (Logo SVG, cores #20C933 / #151A1E, fonte Poppins, favicon e Splash Screen).
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx` (Novo: Logotipo vetorial oficial em múltiplos formatos e variações)
  - `src/components/SplashScreen.tsx` (Novo: Tela de abertura oficial com transição suave)
  - `public/icon.svg` (Atualizado com o "V" estilizado e squircle grafite oficial)
  - `index.html` (Importação do Google Fonts Poppins e metadados)
  - `src/index.css` (Definição da tipografia Poppins e animação de fade-in)
  - `src/components/HomeScreen.tsx` (Substituição do logo do cabeçalho pelo oficial)
  - `src/components/ProfileScreen.tsx` (Rodapé com marca oficial)
  - `src/components/PartnerProfileScreen.tsx` (Rodapé com marca oficial)
  - `src/App.tsx` (Inclusão da SplashScreen oficial na inicialização)
- **Resumo Técnico:** Implementados todos os padrões do manual: símbolo "V" com gradiente institucional, tipografia Poppins em pesos 400-900, assinatura "Vagou achou." e tela de abertura.

---

### [2026-09-01] — Criação da Estrutura de Governança, Limpeza de Código e Documentação
- **Tipo:** `[Docs]` / `[Refactor]`
- **Motivo:** Criação do super prompt de instruções da IA, protocolo dos 6 mandamentos, regra de limpeza pós-obra (clean code), documentação arquitetural e base de conhecimento.
- **Arquivos Impactados:**
  - `AGENTS.md` (Novo: Instruções mestras permanentes da IA)
  - `GEMINI.md` (Novo: Diretrizes sincronizadas do Gemini)
  - `ARCHITECTURE.md` (Novo: Visão técnica do sistema e GIS)
  - `KNOWLEDGE_BASE.md` (Novo: Padrões consolidados e soluções de sucesso)
  - `CHANGELOG.md` (Novo: Este documento de rastreabilidade)
- **Resumo Técnico:** Documentada a arquitetura completa do Vagou, fluxo de dados, modos cliente/parceiro, e estabelecido o protocolo rigoroso de confirmação de escopo, validação e limpeza de código.

---

### [2026-09-01] — Correção Definitiva de Sobreposição de Camadas (z-index) no Feed
- **Tipo:** `[Fix]`
- **Motivo:** Os selos de vagas ("VAGA AGORA", "VAGA RELÂMPAGO") e controles de mídia estavam sobrepondo a barra de categorias ao rolar a tela.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`
  - `src/components/RadarOfferCard.tsx`
- **Resumo Técnico:** 
  - Unificado o cabeçalho superior (logo + busca + categorias) em um contêiner `sticky top-0 z-40` com `bg-slate-950/95` e `backdrop-blur-md`.
  - Rebaixados os badges e ações internas do `RadarOfferCard` para `z-10` dentro de contexto `relative z-0`, permitindo que o feed role suavemente por baixo da barra fixa.

---

### [2026-09-01] — Remoção de Animações Pulsantes (Ponto Indicador Estático)
- **Tipo:** `[Refactor]` / `[UI]`
- **Motivo:** Simplificar e limpar o visual dos indicadores de vagas e stories.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`
  - `src/components/RadarOfferCard.tsx`
  - `src/components/RadarStoryBar.tsx`
  - `src/components/RadarStoryModal.tsx`
  - `src/components/MediaFallbackCard.tsx`
- **Resumo Técnico:** Removida a classe `animate-ping` de todas as bolinhas verdes de status, transformando-as em pontos estáticos e limpos.
