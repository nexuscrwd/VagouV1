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

### [2026-09-02] — Modal Centralizado Flutuante de Busca com Fundo Ofuscado (Opção A)
- **Tipo:** `[Feat]` / `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** Implementação da Opção A: tela totalmente ofuscada (`backdrop-blur-xl bg-black/85`), input de busca centralizado flutuante com foco automático, placeholder minimalista (`Ex: Barba, Degradê...`) e tags rápidas de sugestão sem textos redundantes. O ícone de lupa funciona como botão de ação de busca e o botão "X" limpa o campo ou fecha a janela.
- **Arquivos Impactados:**
  - `src/components/SearchModal.tsx` (Remoção de textos auxiliares redundantes, deixando apenas as tags limpas de sugestão)
- **Resumo Técnico:** Código 100% limpo, livre de resíduos, sem dependências zumbis e validado pelo TypeScript.

---

### [2026-09-02] — Fixação do Bloco Superior Unificado (Header + Categorias + Stories Radar)
- **Tipo:** `[Fix]` / `[UI]`
- **Motivo:** O contêiner de Stories do Radar (`RadarStoryBar`) foi unificado e integrado à barra superior fixa (`sticky top-0 z-40`), garantindo que o logo, foto de perfil, categorias estilo Netflix e stories permaneçam 100% fixos no topo durante a rolagem do feed de vagas.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx` (Unificação da barra de stories dentro do contêiner sticky superior)
  - `src/components/RadarStoryBar.tsx` (Ajuste de contraste do nome dos estabelecimentos para `text-slate-300`)
- **Resumo Técnico:** Eliminado o descolamento dos stories na rolagem; a transição de rolagem ocorre perfeitamente por trás do bloco superior fixo.

---

### [2026-09-02] — Pacote de Modernização UI/UX: Categorias Netflix, Busca no Rodapé, Foto de Perfil no Topo e Manuais do App
- **Tipo:** `[Feat]` / `[UI]` / `[UX]` / `[Docs]`
- **Motivo:** Implementação da experiência de navegação por categorias estilo Netflix (sem emojis supérfluos, mantendo apenas o relâmpago), migração da busca para o menu inferior com fundo Grafite (#151A1E), posicionamento da foto de perfil no topo direito com gaveta lateral, onboarding de interesses, padronização da terminologia "Agendar" e criação dos Manuais Técnico e de Usuário.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx` (Topo limpo com logo + perfil, remoção de busca superior e categorias dinâmicas sem emojis)
  - `src/components/SearchScreen.tsx` (Nova tela dedicada de busca com filtros e ordenação)
  - `src/components/BottomNav.tsx` (Fundo Grafite `#151A1E`, nova aba Buscar substituindo Perfil)
  - `src/components/ProfileDrawer.tsx` (Novo menu lateral acionado pelo avatar do topo com perfil Anderson/Esposa)
  - `src/components/InterestOnboardingModal.tsx` (Novo modal de preferências de categorias estilo Netflix)
  - `src/components/RadarOfferCard.tsx` (Substituição de "RESERVAR" por "AGENDAR" e cores oficiais)
  - `src/components/OfferDetailScreen.tsx` & `src/components/ConfirmationScreen.tsx` (Terminologia "Agendar" e "Agendamento")
  - `src/App.tsx` (Integração das novas rotas, telas e estados de perfil)
  - `src/types.ts` (Adicionado `busca` ao `ScreenId`)
  - `DEV_MANUAL.md` (Novo: Manual de arquitetura, tokens e UI/UX para desenvolvedores e designers)
  - `USER_MANUAL.md` (Novo: Guia de uso e central de ajuda do usuário)
- **Resumo Técnico:** Concluída a reformulação para uma arquitetura limpa, mobile-first e de alta usabilidade com perfis de recomendação e documentação completa.

---

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
