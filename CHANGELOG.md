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

### [2026-09-12] — Ajuste de Espaçamento Vertical na Grade de Horários (Focus Mode)
- **Tipo:** `[UI Styling & Focus Mode]`
- **Motivo:** Aplicação direta do CSS selecionado via Focus Mode para a grade de slots de horários da ferramenta de agenda: `padding-top: 5px; padding-bottom: 5px;` (`py-[5px]`).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Aplicado `py-[5px]` no contêiner da grade de horários.
  - `src/components/AgendaScreen.tsx`: Aplicado `py-[5px]` no contêiner da grade de horários.
- **Resumo Técnico:** Clean code aplicado, compilação e tipagem validadas.

---

### [2026-09-12] — Correção de Espaçamento e Margens dos Cards da Seção Serviços
- **Tipo:** `[UI Spacing & Layout Fix]`
- **Motivo:** Conforme solicitado com ênfase pelo usuário ("Alique espaçamento entre os cards dessa seçã... Os elementos estão GRUDAAADOS DAS BORDAS!!"), foi aplicado um espaçamento generoso e equilibrado em toda a seção:
  - Margem/Padding lateral generoso (`px-4`, 16px) para afastar completamente os cards das bordas da tela.
  - Espaçamento aumentado entre as colunas do Pinterest (`gap-3.5`, 14px) e margem inferior entre cada card (`mb-3.5`, 14px).
  - Cantos arredondados refinados (`rounded-xl`), padding interno equilibrado no card e alinhamento do cabeçalho da seção.
  - Aplicado também padding lateral nas abas complementares ("sobre" e "espaco") para consistência global.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualizado layout de colunas, espaçamentos laterais e gaps entre os cards de serviços.
- **Resumo Técnico:** Clean code rigoroso, sem dependências desnecessárias. Validação completa com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Ajuste de Espaçamento e Margens na Galeria de Serviços (Focus Mode)
- **Tipo:** `[UI Styling & Focus Mode]`
- **Motivo:** Aplicação direta das regras de CSS selecionadas via Focus Mode para o cabeçalho e grade de serviços: `padding-left: 10.5px`, `margin: 5px` no cabeçalho e `padding-left: 5px`, `padding-right: 5px`, `padding-top: 5px`, `padding-bottom: 4px` no contêiner da grade estilo Pinterest.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Ajustadas as classes do contêiner da grade e do header da seção de serviços.
- **Resumo Técnico:** Clean code rigoroso, compilação e tipagem validadas.

---

### [2026-09-12] — Remoção da Ferramenta Agenda da Seção Serviços
- **Tipo:** `[UI Refinement]`
- **Motivo:** Conforme solicitado pelo usuário ("Remover desta seção serviços"), a ferramenta de Agenda (cadeiras em atendimento, calendário mensal e grade de horários) foi removida da aba "Serviços" do perfil do estabelecimento (`SalonProfileView.tsx`). A aba "Serviços" passa a exibir exclusivamente a galeria do catálogo de procedimentos no formato Pinterest Masonry. A ferramenta de Agenda completa permanece disponível na aba principal ("Vagas") e na tela dedicada de Agenda.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o bloco `{renderAgendaTool()}` dentro de `activeTab === 'servicos'`.
- **Resumo Técnico:** Clean code aplicado, sem variáveis não utilizadas ou imports mortos. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Ajuste de Estilo: Fundo Branco Puro nos Botões de Horários da Grade
- **Tipo:** `[UI Styling]`
- **Motivo:** Conforme solicitado pelo usuário ("o fundo desses botões devem ser brancos"), os botões de slots de horários da tabela de agendamento no modo claro (Light Mode) foram atualizados para utilizar fundo branco puro (`bg-white`) com borda suave (`border-slate-200`) e micro-sombra, garantindo contraste nítido e visual limpo.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualizado estilo dos botões de horários em `renderAgendaTool`.
  - `src/components/AgendaScreen.tsx`: Atualizado estilo dos botões de horários na tela de agenda.
  - `src/components/SalonBookingModal.tsx`: Atualizado estilo dos botões de horários no modal de agendamento.
- **Resumo Técnico:** Clean code aplicado, sem variáveis não utilizadas ou imports mortos. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Integração do Calendário Mensal Visível e Interativo na Ferramenta Agenda
- **Tipo:** `[Feature & UI Integration]`
- **Motivo:** Conforme solicitado pelo usuário ("A 'AGENDA' dentro da seção serviços do estabelecimento" e "calendário visível"), foi integrado o componente de Calendário Mensal completo e interativo (`renderAgendaTool`) diretamente visível no perfil do estabelecimento (tanto na aba "Vagas" quanto na aba "Serviços"). O calendário permite navegar entre meses, selecionar datas específicas, sincronizar a lista de horários disponíveis em tempo real e abrir o modal de agendamento com a data selecionada pré-definida.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Adicionado estado de mês/data do calendário inline (`selectedCalendarDateIso`, `calendarViewMonth`), grid de dias com detecção de dias fechados (domingos) e passado `initialDateIso` para o modal de agendamento.
  - `src/components/SalonBookingModal.tsx`: Adicionado suporte ao prop `initialDateIso` para pré-selecionar a data escolhida no calendário da página.
- **Resumo Técnico:** Clean code aplicado, sem variáveis não utilizadas ou imports mortos. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Replicação da Ferramenta Agenda na Aba "Serviços" do Estabelecimento
- **Tipo:** `[Feature & UI Replication]`
- **Motivo:** Conforme solicitado pelo usuário, a ferramenta completa de Agenda (Botão de ação "HORÁRIOS HOJE", Seção de Cadeiras em Atendimento ao Vivo com status e tempo restante, e Seção de Tabela de Horários com filtros de turnos e slots clicáveis) foi replicada no topo da aba "Serviços" do perfil do estabelecimento (`SalonProfileView.tsx`), antecedendo o catálogo de Serviços & Procedimentos em estilo Pinterest Masonry.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Inserido o bloco completo da ferramenta Agenda dentro de `activeTab === 'servicos'`.
- **Resumo Técnico:** Clean code aplicado, sem variáveis não utilizadas. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Replicação da Ferramenta Agenda na Seção "Agenda" do App
- **Tipo:** `[Feature & UI Synchronization]`
- **Motivo:** Conforme solicitado pelo usuário, a ferramenta completa de Agenda (Botão de ação "HORÁRIOS HOJE", Seção de Cadeiras em Atendimento ao Vivo com barras de progresso dinâmicas e Seção de Tabela de Horários com filtros de turnos e slots clicáveis com abertura do fluxo de agendamento) foi replicada dentro da tela global "Agenda" (`AgendaScreen.tsx`), harmonizando com a lista de reservas ativas do cliente e suporte completo a Dark/Light Theme.
- **Arquivos Impactados:**
  - `src/components/AgendaScreen.tsx`: Implementada a ferramenta completa de agenda ao vivo sincronizada com `SalonBookingModal`, `useTheme` e controle de reservas.
  - `src/App.tsx`: Conectado `onConfirmBooking` à tela de Agenda.
- **Resumo Técnico:** Clean code rigoroso, sem variáveis zumbis ou imports órfãos. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Ajuste de Padding Superior nos Botões da Navegação Inferior
- **Tipo:** `[UI & Precision Styling]`
- **Motivo:** Conforme solicitado pelo usuário via seleção de elemento na interface, foi aplicado `padding-top: 7px` (`pt-[7px]`) no botão `button#nav-salon-servicos` e nos botões da barra de navegação inferior (`BottomNav`), assegurando alinhamento visual milimétrico e ergonomia tátil perfeita.
- **Arquivos Impactados:**
  - `src/components/BottomNav.tsx`: Adicionada classe `pt-[7px]` aos botões da barra inferior.
- **Resumo Técnico:** Clean code aplicado. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Ajuste de Espaçamentos no Nav Inferior e Contêiner de Tela
- **Tipo:** `[UI & Precision Styling]`
- **Motivo:** Conforme solicitado pelo usuário via seleção de elemento na interface, foram aplicados os estilos e espaçamentos exatos no elemento de navegação `nav` (`pl-[9px]`, `py-0`, margens zeradas) e no contêiner de tela (`pb-0`), eliminando qualquer espaçamento vertical excessivo no rodapé.
- **Arquivos Impactados:**
  - `src/components/BottomNav.tsx`: Atualizadas classes do elemento `<nav>`.
  - `src/components/SalonProfileView.tsx`: Ajustado `pb-0` no contêiner principal.
  - `src/components/HomeScreen.tsx`: Ajustado `pb-0` no contêiner principal.
- **Resumo Técnico:** Clean code aplicado. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Remoção do Ícone SVG e Ajuste de Espaçamentos no Cabeçalho de Serviços
- **Tipo:** `[UI & Precision Styling]`
- **Motivo:** Conforme solicitado pelo usuário via seleção de elemento na interface, foi removido o ícone SVG do título "Serviços & Procedimentos" e aplicados os espaçamentos exatos de padding (`pl-[10.5px]`, `py-[5px]`) e margens (`my-[5px]`, `mx-0`).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o SVG de tesoura do título `h2`, ajustadas classes Tailwind de padding e margin no contêiner do cabeçalho de serviços, e limpo o import `Scissors`.
- **Resumo Técnico:** Clean code aplicado, sem variáveis ou imports não utilizados. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Remoção do Ícone de Tesoura nos Cards da Seção Serviços
- **Tipo:** `[UI & Mobile Synthesis]`
- **Motivo:** Conforme solicitado pelo usuário via seleção de elemento na interface, foi removido o ícone de tesoura no canto superior direito dos cards de serviço da aba Serviços (`SalonProfileView`), deixando a visualização das imagens do Pinterest ainda mais limpa e focada no conteúdo fotográfico.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o badge com ícone de tesoura do canto superior direito do card de serviço.
- **Resumo Técnico:** Clean code aplicado. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Remoção da Avaliação dos Cards de Profissionais na Seção Equipe
- **Tipo:** `[UI & Mobile Synthesis]`
- **Motivo:** Conforme solicitado pelo usuário, foram removidos os badges de avaliação numérica e estrelas dos cards individuais dos profissionais na aba de equipe (`SalonProfileView`), proporcionando visual mais limpo, elegante e direto ao ponto.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o badge de nota/estrela do card do profissional e import não utilizado.
- **Resumo Técnico:** Clean code aplicado, sem imports residuais. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Remoção do Botão "Horários Hoje" da Seção Serviços
- **Tipo:** `[UI & Clean Code]`
- **Motivo:** Conforme solicitado pelo usuário via seleção de elemento na interface, foi removido o botão "HORÁRIOS HOJE" posicionado na parte inferior da aba de Serviços (`SalonProfileView`), mantendo a seção focada estritamente na exibição visual dos cards de serviços no grid estilo Pinterest.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o contêiner e botão redundante ao final da lista de serviços.
- **Resumo Técnico:** Limpeza de código sem elementos residuais ou imports órfãos. Validação com `lint_applet` e `compile_applet`.

---

### [2026-09-12] — Remoção do Botão "Agendar" no Feed e Navegação Direta ao Aplicativo do Estabelecimento
- **Tipo:** `[Refactor & UX Simplification]`
- **Motivo:** Conforme solicitado pelo usuário, foi removido o botão "Agendar" do card de anúncio (`RadarOfferCard`), tornando todo o card clicável para levar o usuário diretamente para a página/aplicativo exclusivo do estabelecimento (`SalonProfileView`), sem abrir nenhum modal intermediário sobre o feed.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removido o botão "Agendar", ajustando o layout de ações inferiores com botões objetivos (áudio, visualizador de mídia e compartilhamento) e garantindo que o clique em qualquer parte do anúncio abra diretamente a página do estabelecimento.
  - `src/components/HomeScreen.tsx`: Simplificados os manipuladores de clique (`handleSelectOffer` e `handleDirectBook`) para abrir diretamente `setViewingSalonProfile` sem intermediários.
  - `src/components/SalonProfileView.tsx`: Removidos estados e modais sobrepostos de detalhe de anúncio, mantendo a experiência do aplicativo do estabelecimento limpa, direta e visual.
- **Resumo Técnico:** Clean code rigoroso aplicado sem código morto ou variáveis zumbis. Validação com `lint_applet` e `compile_applet` (`npm run build`) validado com sucesso.

---

### [2026-09-12] — Integração Completa da Descrição do Anúncio e Confirmação de Agendamento no Perfil do Estabelecimento
- **Tipo:** `[Refactor & UX Unification]`
- **Motivo:** Conforme solicitado pelo usuário, ao clicar no card de um anúncio, o fluxo de detalhes da oferta e a tela de confirmação do agendamento passam a ser parte integrante da seção/perfil do próprio estabelecimento (`SalonProfileView`), mantendo a identidade do salão, carrossel de fotos, cadeiras ao vivo, equipe e serviços em contexto unificado, com o mesmo estilo visual dos cards do feed e sem telas desconectadas.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`:
    - Adicionado suporte ao estado `offerForSalonDetail` e manipulador `handleSelectOffer` para direcionar cliques do card de anúncio (seja no feed em tela cheia, grid estilo Pinterest ou lista de cards) para a seção exclusiva do salão (`setViewingSalonProfile`), repassando o anúncio selecionado como `initialDetailOffer`.
    - Atualizado repasse de `onNavigateToAgenda` para a navegação fluida da agenda após confirmação.
  - `src/components/SalonProfileView.tsx`:
    - Adicionados os modais integrados de Detalhe da Oferta (`selectedOfferForDetail`) e Comprovante de Agendamento (`confirmedBookingData`) com design dark theme sofisticado, tipografia refinada e botões em contraste com `text-white drop-shadow-xs`.
    - Implementados manipuladores `handleConfirmDetailOffer` e `handleConfirmSchedule` que concluem o agendamento diretamente no salão e exibem o voucher com protocolo `#VGA-XXXXX`.
  - `src/App.tsx`:
    - Adicionado suporte a `skipScreenChange` no `handleConfirmBooking` para que o voucher de confirmação possa ser renderizado no próprio contexto do estabelecimento sem forçar transição para tela genérica.
  - `src/components/OfferDetailScreen.tsx` & `src/components/ConfirmationScreen.tsx`:
    - Suporte a tema escuro/claro dinâmico com `useTheme`, garantindo consistência visual em qualquer ponto de entrada residual.
- **Resumo Técnico:** Clean code rigoroso aplicado sem código morto ou variáveis órfãs. Validação completa com `lint_applet` (`tsc --noEmit` aprovado com 0 erros) e `compile_applet` (`npm run build`) validado com sucesso.

---

### [2026-09-12] — Redirecionamento de Agendamentos para o Perfil Exclusivo do Estabelecimento
- **Tipo:** `[Feat & Flow Optimization]`
- **Motivo:** O usuário solicitou que o portal principal funcione como a feira de anúncios, buscas e vagas de negócios, mas que ao interagir para agendar um serviço ou horário, o cliente seja direcionado diretamente para o aplicativo/página exclusiva do estabelecimento (`SalonProfileView`), centralizando a conversão e o agendamento no perfil do salão.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Alterada a função `handleDirectBook` para redirecionar o usuário para a página exclusiva do estabelecimento (`setViewingSalonProfile(offer.salonName)`), guardando a oferta selecionada (`setBookingOfferForSalon(offer)`) e repassando-a para o `SalonProfileView`.
  - `src/components/SalonProfileView.tsx`: Adicionadas as propriedades opcionais `initialBookingOffer` e `autoOpenBooking` em `SalonProfileViewProps`, abrindo de forma imediata e fluida o modal de agendamento interno do salão com o serviço e horário pré-selecionados.
- **Resumo Técnico:** Limpeza pós-obra executada sem código morto, linter `tsc --noEmit` validado com 0 erros e compilação de produção (`compile_applet`) aprovada com êxito.

---

### [2026-09-12] — Sincronização da Tabela de Horários na Página do Estabelecimento e Eliminação Total de Texto Escuro sobre Fundo Verde/Frio
- **Tipo:** `[Feat & UI/UX Audit]`
- **Motivo:** 
  1. Replicar e sincronizar a seção da Tabela de Horários (div ultra enxuta de horários com filtros de turno) na seção/aba "Vagas" do perfil do estabelecimento (`SalonProfileView`), conectando a seleção direta de qualquer horário com abertura do modal de agendamento (`SalonBookingModal`) já pré-selecionado.
  2. Cumprimento emergencial e irrestrito da regra de contraste (Seção 7B do `KNOWLEDGE_BASE.md`): erradicação completa e em toda a base de código do uso de texto escuro (`text-slate-950`, `text-black`, `text-emerald-950`) sobre fundos verdes ou frios (`#20C933`, `bg-emerald-500`, etc.), padronizando rigorosamente com `text-white drop-shadow-xs`.
- **Arquivos Impactados:**
  - `src/utils/bookingSlots.ts`: Criado gerador centralizado e determinístico de slots de agendamento diário e turnos para sincronia de dados entre perfil e modal.
  - `src/components/SalonBookingModal.tsx`: Suporte a `initialTimeSlot`, temas claro/escuro dinâmicos e contraste corrigido com `text-white drop-shadow-xs`.
  - `src/components/SalonProfileView.tsx`: Substituída a seção anterior pela réplica exata e sincronizada da Tabela de Horários com filtros de turno ('todos', 'manha', 'tarde', 'noite'), abertura direta do modal com horário selecionado e correção de contraste nos botões e ícones.
  - `src/components/HomeScreen.tsx`: Correção de contraste para `text-white drop-shadow-xs` nos botões de layout (Reels/Grid), chips de categorias ativos, botões de ação rápida e botões de explorar.
  - `src/components/RadarOfferCard.tsx`: Correção de contraste no botão principal de agendamento rápido com `text-white drop-shadow-xs` e ícone branco.
  - `src/components/ConfirmationScreen.tsx`: Correção no botão principal de ação e no ícone de confirmação.
  - `src/components/FavoritesScreen.tsx`: Correção no botão de explorar vagas.
  - `src/components/InterestOnboardingModal.tsx`: Correção no botão de salvar interesses e indicadores de seleção.
  - `src/components/OfferDetailScreen.tsx`: Correção no botão CTA principal "AGENDAR AGORA".
  - `src/components/RadarStoryModal.tsx`: Correção no selo "VAGA AGORA" e botão "RESERVAR ESTE HORÁRIO".
  - `src/components/PartnerProfileScreen.tsx`: Correção no botão "Criar Nova Vaga Relâmpago".
  - `src/components/PinterestExploreScreen.tsx`: Correção nas pílulas ativas e botões de ação rápida.
  - `src/components/ProfileDrawer.tsx`: Correção nos seletores de perfil de preferência e badges.
  - `src/App.tsx`: Correção da cor de seleção de texto para `selection:text-white`.
- **Resumo Técnico:** Clean code aplicado, sem imports órfãos ou estados zumbis. Linter `tsc --noEmit` validado com 0 erros e compilação de produção aprovada com sucesso.

---

### [2026-09-12] — Correção de Retorno Indesejado de Aba e Suporte ao Tema Claro/Escuro no Modal de Agendamento
- **Tipo:** `[Fix / UI/UX]`
- **Motivo:** Ao selecionar uma data e avançar para a aba de horários, o modal automaticamente resetava e voltava para a seleção de datas devido a re-execuções de `useEffect` com dependências dinâmicas. Além disso, as cores do modal estavam fixadas no tema escuro mesmo quando o app estava no tema claro.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Adicionada referência com `useRef(false)` (`prevIsOpenRef`) para que a inicialização do modal e o reset para o passo inicial só ocorram estritamente na transição de fechado para aberto (`!prevIsOpenRef.current && isOpen`), preservando o estado do usuário durante toda a sessão de navegação.
    - Integrado o hook `useTheme()` do `ThemeContext` e refatoradas todas as classes utilitárias Tailwind (fundo, bordas, divisores, textos e botões) para alternar dinamicamente entre tema claro (`bg-white`, `text-slate-900`, etc.) e tema escuro (`bg-slate-950`, `text-white`, etc.).
- **Resumo Técnico:** Clean code aplicado, sem variáveis zumbis ou imports órfãos, linter validado (`tsc --noEmit` 100% limpo) e compilação de produção (`compile_applet`) bem-sucedida.

---

### [2026-09-12] — Simplificação dos Cards de Cadeiras em Atendimento (Focus Mode)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do avatar do profissional, título do serviço e badge superior de tempo dos cards de "Cadeiras em Atendimento", selecionados via Focus Mode para deixar o card ultra-minimalista.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Simplificada a estrutura visual do card de atendimento.
- **Resumo Técnico:** Clean code verificado, linter executado sem erros e build compilado com sucesso.

---

### [2026-09-12] — Remoção do Selo 'Ao Vivo' no Cabeçalho de Cadeiras em Atendimento (Focus Mode)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção da tag/badge "Ao Vivo" no cabeçalho da seção "Cadeiras em Atendimento", selecionada via Focus Mode para simplificar e limpar a interface.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o elemento `<span>` com badge de pulso "Ao Vivo".
- **Resumo Técnico:** Clean code verificado, linter executado sem erros e build compilado com sucesso.

---

### [2026-09-10] — Remoção da Cadeira 03 na Seção 'Cadeiras em Atendimento' (Focus Mode)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do card referente à Cadeira 03 selecionado via Focus Mode na lista de "Cadeiras em Atendimento".
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o item `chair-3` da estrutura `activeChairsData`.
- **Resumo Técnico:** Clean code verificado, zero variáveis zumbis, linter validado e build compilado com sucesso.

---

### [2026-09-09] — Remoção da Seção 'Ofertas Relâmpago em Destaque' (Focus Mode)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do contêiner de "Ofertas Relâmpago em Destaque" da aba principal do perfil do salão, simplificando a tela e priorizando a visualização das cadeiras e dos próximos horários livres.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o bloco da seção de ofertas relâmpago.
- **Resumo Técnico:** Clean code aplicado, linter validado e compilação de produção realizada com sucesso.

---

### [2026-09-09] — Remoção de Selo Redundante 'Livre' nos Cards de Horários (Focus Mode)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do selo redundante "Livre" selecionado via Focus Mode dentro dos cards de "Próximos Horários Livres", garantindo um design ainda mais limpo, minimalista e com foco total no horário.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o badge `<span>Livre</span>` e expandido o bloco do horário em destaque para preenchimento harmônico.
- **Resumo Técnico:** Clean code aplicado, linter validado e build compilado com sucesso.

---

### [2026-09-09] — Grid de Cadeiras em Atendimento (Sem Nomes de Clientes) & Grid de Horários Livres
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Conversão da seção de Cadeiras em Atendimento em um grid de cards responsivo, com remoção total de nomes de clientes por privacidade/segurança e simplificação dos nomes dos profissionais (somente primeiro nome). Na seção "Próximos Horários Livres", conversão em grid de cards focado estritamente em horários, sem tipos de serviços redundantes.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: `activeChairsData` e `upcomingOpenSlots` atualizados com primeiros nomes simples ("Carlos", "Mateus", "Juliana"); remoção de qualquer menção a nomes de clientes; renderização de Cadeiras em Atendimento em `grid grid-cols-2 sm:grid-cols-3 gap-2`; renderização de Horários Livres em `grid grid-cols-2 sm:grid-cols-4 gap-2` com horário em destaque, status, duração e botão de reserva rápida.
- **Resumo Técnico:** Limpeza pós-obra realizada, zero imports ou variáveis órfãs, TypeScript estritamente tipado, linter validado e compilação de produção bem-sucedida.

---

### [2026-09-09] — Refinamento do Mosaico Pinterest: Espaçamento Mínimo, Cantos Sutis e Curadoria Coesa de Fotos
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Redução do espaçamento entre as imagens do mosaico para o mínimo possível (`gap-1.5` / `mb-1.5`), ajuste dos cantos para bordas mais discretas e refinadas (`rounded-[6px]`) e substituição de fotos que destoavam por imagens coesas de alta resolução no universo de barbearia/salão premium (cortes na lâmina/tesoura, alinhamento, visagismo e cuidados capilares).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Curadoria atualizada do catálogo com imagens harmônicas de tons escuros e iluminação quente de estúdio; mosaico ajustado com espaçamento ultra-compacto (`gap-1.5`, `mb-1.5`, margem `px-2`), cantos discretos de 6px e badges proporcionais.
- **Resumo Técnico:** Clean code aplicado, linter 100% verde e build de produção compilado com sucesso.

---

### [2026-09-09] — Grid de Serviços Estilo Pinterest (Masonry com Imagens Maiores e Proporções Variadas)
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Substituição da grade de 3 colunas pequenas por um layout estilo Pinterest (Masonry Grid em 2 colunas com imagens muito maiores e proporções dinâmicas: verticais 3:4 e 4:5, quadradas 1:1 e horizontais 4:3), permitindo visualização rica, fotográfica e fluida dos serviços e procedimentos.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Adicionada propriedade opcional `aspectRatio?: string` à interface `CatalogServiceItem`.
  - `src/components/SalonProfileView.tsx`: Atualizado `catalogServices` com imagens ampliadas e proporções dinâmicas (verticais, horizontais e quadradas); implementado o container `columns-2 gap-3 [column-fill:_balance]` com cards `break-inside-avoid`, badges flutuantes de categoria/ícone, gradientes de alto contraste para leitura de título, preço e duração, além de interação de clique e hover.
- **Resumo Técnico:** Limpeza pós-obra realizada, zero imports ou variáveis zumbis, testado via `lint_applet` e build validado com `compile_applet`.

---

### [2026-09-09] — Escopo Exato: Slider na Página Inicial & Grid Instagram Exclusivo na Seção Serviços
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Restauração do slider/carrossel dinâmico de destaques na página inicial do estabelecimento (aba "Agenda/Vagas") e inserção exclusiva da grade de serviços em formato Instagram (3 colunas, proporção 1:1 e bordas finas) na aba "Serviços", removendo o slider desta seção conforme solicitação.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Slider reposicionado no topo da aba inicial (`activeTab === 'vagas'`), acompanhado dos botões e cards de atendimento ao vivo. Na aba "Serviços" (`activeTab === 'servicos'`), o slider foi omitido e o grid estilo Instagram de 3 colunas com borda fina (`gap-[1.5px]`) foi configurado como apresentação principal dos atendimentos.
- **Resumo Técnico:** Clean code aplicado, zero código morto ou imports zumbis, testado via `lint_applet` e validado com `compile_applet`.

---

### [2026-09-09] — Grid de Serviços em Formato Instagram com Bordas Finas
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do carrossel/slide de serviços e substituição por uma grade de fotos estilo Instagram (3 colunas, proporção quadrada 1:1, separadas apenas por uma borda fina), permitindo visualização rápida dos serviços e agendamento instantâneo por clique.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Substituído o carrossel/slides pelo grid estilo feed do Instagram (`grid grid-cols-3 gap-[1.5px]`), adicionadas fotos aos serviços do catálogo e removidos os estados e intervalos de autoplay do slide anterior.
  - `src/components/SalonBookingModal.tsx`: Atualizada a tipagem de `CatalogServiceItem` com a propriedade opcional `image`.
- **Resumo Técnico:** Clean code aplicado, imports zumbis removidos, verificado com `lint_applet` e compilado com `compile_applet`.

---

### [2026-09-09] — Implementação das Cadeiras Ao Vivo e Próximos 4 Horários Livres
- **Tipo:** `[Feat / UI/UX]`
- **Motivo:** Implementação da exibição das cadeiras em atendimento em tempo real (com barras de progresso e tempo restante) e lista dos próximos 4 horários livres do dia na aba "Agenda".
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Adicionados os componentes visuais para monitoramento ao vivo das cadeiras (`activeChairsData`) com contagem regressiva e progresso, e a grade com os 4 próximos horários futuros para agendamento instantâneo (`upcomingOpenSlots`).
- **Resumo Técnico:** Checado com `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Atualização da Fonte da Logotipia para Sans-Serif Moderna
- **Tipo:** `[UI/UX / Typography]`
- **Motivo:** Substituição da fonte serifada estilo jornal antigo por uma fonte sans-serif moderna, limpa e com peso marcante (`font-sans font-extrabold tracking-tight`), transmitindo a identidade visual contemporânea de um salão de beleza.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualizadas as classes CSS do `span` de `font-serif tracking-wider` para `font-sans font-extrabold tracking-tight`.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Substituição do Logo da Empresa por Logotipia em Texto Estilizada
- **Tipo:** `[UI/UX / Redesign]`
- **Motivo:** Substituição da imagem do logo no cabeçalho por uma logotipia textual elegante, simples e refinada com a largura exata de 103px (`w-[103px]`), adequada para estabelecimentos de beleza.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido a tag `<img>` do logo e inserida logotipia em texto estilizada (`font-serif uppercase tracking-wider`) com destaque em verde esmeralda na primeira palavra e dimensões fixadas em 103px.
- **Resumo Técnico:** Checado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Realocação da Foto do Usuário para o Cabeçalho Principal
- **Tipo:** `[UI/UX]`
- **Motivo:** Mover o botão com a foto de perfil do usuário para o cabeçalho principal no canto direito, posicionando-o imediatamente após o ícone de notificações.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Movido o botão da foto de perfil (`userAvatarUrl`) para o contêiner do cabeçalho principal (`<header>`) ao lado direito do ícone de sino, e removido do subcabeçalho de boas-vindas.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Ajuste na Altura do Menu de Navegação Inferior
- **Tipo:** `[UI/UX / Style]`
- **Motivo:** Ajuste da altura do menu de navegação inferior (`nav`) para 54px (`h-[54px]`) conforme seleção de elemento via Modo Foco.
- **Arquivos Impactados:**
  - `src/components/BottomNav.tsx`: Atualizada a classe CSS de altura do contêiner `<nav>` de `h-16` para `h-[54px]`.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Exibição Exclusiva do Primeiro Nome no Subcabeçalho
- **Tipo:** `[UI/UX]`
- **Motivo:** Atualização da mensagem de boas-vindas no subcabeçalho do estabelecimento para exibir apenas o primeiro nome do usuário.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Extração do primeiro nome (`userName.trim().split(' ')[0]`) dentro do elemento `span` da saudação.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Ajuste na Moldura da Foto do Usuário e Remoção do Ícone de 3 Pontinhos
- **Tipo:** `[UI/UX / Refactor]`
- **Motivo:** Remoção do ícone de 3 pontinhos/menu do cabeçalho do estabelecimento e ampliação da moldura da foto de perfil do usuário no subcabeçalho com dimensões explícitas (`w-10 h-10 rounded-[3px]`), perfeitamente alinhada e ajustada à altura do subcabeçalho (`h-12`). Ajustado o espaçamento superior da seção imediatamente abaixo.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Definido tamanho fixo `40x40px` (`w-10 h-10 rounded-[3px]`) com `ring-1.5 ring-emerald-500` e removido o padding superior redundante abaixo do subcabeçalho (`pt-0`).
- **Resumo Técnico:** Limpeza de imports não utilizados efetuada, checado via `lint_applet` e compilado via `compile_applet`.

---

### [2026-09-09] — Correção de Enquadramento do Menu do Estabelecimento no Container do Aplicativo
- **Tipo:** `[Fix / UI Layout]`
- **Motivo:** O menu de navegação do estabelecimento expandiu fora do container do aplicativo em telas desktop devido ao uso de `position: fixed` relativo ao viewport global da janela.
- **Arquivos Impactados:**
  - `src/components/BottomNav.tsx`: Adicionado suporte ao contexto dinâmico do estabelecimento (`salonContext`). Quando ativo, o próprio `BottomNav` renderiza as 4 abas do estabelecimento dentro do container nativo flex do app (`w-full flex-shrink-0`), garantindo contenção 100% perfeita.
  - `src/components/SalonProfileView.tsx`: Passou a registrar o contexto de navegação com o `BottomNav` nativo ao ser montado, removendo qualquer elemento fixo externo.
  - `src/components/HomeScreen.tsx` & `src/App.tsx`: Conectado o estado do contexto do estabelecimento do `SalonProfileView` ao `BottomNav`.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Correção na Codificação Data URI dos Logotipos SVG/PNG
- **Tipo:** `[Bug Fix / Image Encoding]`
- **Motivo:** Correção na renderização das imagens de logotipos dos estabelecimentos. A ausência de `encodeURIComponent` nos Data URIs de SVG causava falha na renderização de marcas com caracteres especiais (como `&` de "BELLA DONNA HAIR & SPA"), gerando um ícone de imagem quebrada na tela.
- **Arquivos Impactados:**
  - `src/utils/salonLogos.ts`: Implementada a função helper `makeSvgDataUri` utilizando `encodeURIComponent` para codificar de forma 100% segura todos os SVG Data URIs retangulares com fundo transparente.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Substituição das Fotos de Perfil dos Estabelecimentos por Logotipos PNG Transparentes Retangulares
- **Tipo:** `[Feat / UI/UX]`
- **Motivo:** Substituídas as fotos de pessoas dos estabelecimentos por logotipos em PNG/SVG transparentes e retangulares, com tipografia e marcas vetorizadas para todos os estabelecimentos mock do aplicativo.
- **Arquivos Impactados:**
  - `src/utils/salonLogos.ts`: Criado utilitário dedicado com marcas nominais transparentes e gerador dinâmico de logotipos SVG/PNG retangulares para todos os salões.
  - `src/types.ts`: Adicionada propriedade opcional `salonLogo` à interface `ServiceOffer`.
  - `src/data.ts`: Mapeado array `MOCK_OFFERS` para injetar automaticamente logotipos transparentes em todos os estabelecimentos.
  - `src/components/SalonProfileView.tsx`: Atualizada a visualização da imagem principal do cabeçalho para carregar a marca transparente retangular com `object-contain`.
  - `src/components/RadarOfferCard.tsx`: Atualizado badge superior do card de oferta para contêiner retangular com logotipo em PNG transparente.
  - `src/components/RadarStoryModal.tsx`: Atualizado cabeçalho dos stories para contêiner com logotipo da marca.
- **Resumo Técnico:** Limpeza pós-obra realizada, código verificado com `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Refatoração do Cabeçalho e Subcabeçalho (Logo Full Height, Botão Sair e Limpeza de Tema/Redundâncias)
- **Tipo:** `[UI/UX Adjustment & Focus Mode]`
- **Motivo:** Removido o botão de alternância de tema do cabeçalho (mantido exclusivamente na gaveta de perfil); movido o botão "Sair do Estabelecimento" para o subcabeçalho à esquerda da mensagem de boas-vindas; removido a tag redundante "Boas-vindas ao app"; ajustado a imagem/logo do perfil do estabelecimento para preencher a altura vertical máxima do cabeçalho (`full height`) sem moldura, bordas ou margens top/bottom/left.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Refatorado `<header>` para imagem full height responsiva (`h-full w-auto object-cover`) sem moldura/margens; removidos botões de tema e sair do cabeçalho; atualizado subcabeçalho com botão "Sair" posicionado à esquerda de `"Seja bem-vindo, {userName}"` sem span redundante.
- **Resumo Técnico:** Limpeza pós-obra realizada, verificado com `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Remoção de Textos Redundantes do Cabeçalho Principal
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção do rótulo "ESTABELECIMENTO", do nome da empresa e do selo verificado do cabeçalho fixo superior conforme solicitação via seleção de elementos no aplicativo, mantendo o cabeçalho focado exclusivamente na div do logotipo e botões de ação rápidos.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removidos elementos `<span>` e `<h1>` do lado esquerdo do `<header>`, preservando a `div` com imagem do logotipo do estabelecimento; limpo import não utilizado de `ShieldCheck`.
- **Resumo Técnico:** Limpeza pós-obra concluída, verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Ampliação do Cabeçalho Principal (+25% / 1/4 do Tamanho)
- **Tipo:** `[UI/UX Adjustment]`
- **Motivo:** Ajuste de proporção do cabeçalho do estabelecimento, aumentando sua altura, estofamento (padding) e proporção de ícones/botões de ação em +25% para melhor ergonomia e visibilidade em telas de celulares.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Aumentado padding do `<header>` de `py-2.5 px-3.5` para `py-3.5 px-4`, avatar da marca de `w-9 h-9` para `w-11 h-11`, botões de ação de `w-8 h-8` para `w-10 h-10` e fontes do título/rótulo proporcionalmente.
- **Resumo Técnico:** Verificado via `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Reformulação do Slide (Full Width + Swipe Gesture + Altura Ampliada) e Subcabeçalho de Boas-Vindas
- **Tipo:** `[Feat & UI/UX]`
- **Motivo:** Implementação do slide em largura total (full width) com suporte a gesto touch de arrastar/deslizar (swipe left/right com `motion/react`), transição automática mantida e altura ampliada (+1/3) para destaque das imagens do catálogo; substituição do botão Radar por um contêiner exclusivo para o logotipo da empresa no cabeçalho principal, e criação do subcabeçalho de boas-vindas com nome do usuário e foto no lado oposto.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Substituído botão do Radar por `div` de logotipo do estabelecimento no cabeçalho superior; criado o subcabeçalho de boas-vindas (`"Seja bem-vindo, {userName}"` à esquerda e foto do perfil no lado oposto); reformulado o carrossel de portfólio para full width (`w-full`), altura ampliada para `210px`/`240px`, drag/swipe manual por toque e indicador de slides aprimorado.
- **Resumo Técnico:** Limpeza pós-obra realizada, verificado com `lint_applet` e compilado com sucesso (`compile_applet`).

---

### [2026-09-09] — Implementação de Tema Claro & Escuro (Theme Switcher) e Documentação na Base de Conhecimento
- **Tipo:** `[Feat, Theming & Documentation]`
- **Motivo:** Implementação do suporte nativo a Tema Claro (Light Pearl) e Tema Escuro (Dark Slate) em toda a aplicação, com botão dinâmico de alternância no cabeçalho do micro-app do salão e na gaveta de perfil, refatoração de contraste para eliminar texto preto pesado sobre o verde, e registro formal dos padrões cromáticos e iconográficos na `KNOWLEDGE_BASE.md`.
- **Arquivos Impactados:**
  - `src/context/ThemeContext.tsx`: Criação do provider de tema (`dark` | `light`) com persistência em `localStorage`.
  - `src/main.tsx`: Envolvimento da aplicação com `ThemeProvider`.
  - `src/App.tsx`: Consumo do tema dinâmico nos contêineres principais.
  - `src/components/BottomNav.tsx`: Suporte a estados e cores dinâmicas para modo claro e escuro.
  - `src/components/SalonProfileView.tsx`: Refatoração visual completa para alternância instantânea entre Dark Slate e Light Pearl (cabeçalho com botão de sol/lua, carrossel de portfólio, botão de alta conversão "HORÁRIOS HOJE", abas e conteúdo).
  - `src/components/ProfileDrawer.tsx`: Adicionado botão de alternância de tema nas opções e estilização adaptativa.
  - `KNOWLEDGE_BASE.md`: Registrada a Seção 7 com a escala cromática comparativa (Dark Slate vs. Light Pearl), regras de relevo com gradientes, eliminação de preto sobre verde e transições fluidas com `motion/react`.
- **Resumo Técnico:** Clean code aplicado, zero dependências ou variáveis não utilizadas, conformidade total com as diretrizes de design system e acessibilidade WCAG AA.

---

### [2026-09-09] — Documentação Técnica de Ícones Semânticos no Micro-App do Estabelecimento
- **Tipo:** `[Documentation & Design System]`
- **Motivo:** Registro formal no `KNOWLEDGE_BASE.md` dos padrões consolidados de iconografia (`lucide-react`) para as abas de navegação, cabeçalho e catálogo do micro-app do salão (`Calendar` para Agenda, `Scissors` para Serviços, `Users`/`UserCheck` para Equipe/Perfil, `Store`/`Car` para Espaço/Atendimento, e ações rápidas).
- **Arquivos Impactados:**
  - `KNOWLEDGE_BASE.md`: Adicionada seção 6 com tabela de mapeamento de ícones primários, condicionais e regras de negócio/UI.

---

### [2026-09-09] — Conversão da Seção do Salão em Aplicativo Dedicado do Estabelecimento
- **Tipo:** `[Feat & UI/UX Refactor]`
- **Motivo:** Conversão da visualização de perfil de salão (que apresentava aspecto de rede social/feed genérico) em uma interface dedicada de aplicativo nativo do estabelecimento, com cabeçalho exclusivo, carrossel compacto de portfólio, botão de alta conversão "HORÁRIOS HOJE", grade de 4 abas dinâmicas e paleta cromática sofisticada Dark Slate + Emerald Silk (eliminando texto preto sobre fundo verde).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`:
    - **Cabeçalho de Aplicativo:** Integrado logotipo do estabelecimento com selo verificado, saudação personalizada ("Olá, Lucas 👋"), botão sutil de retorno ao Radar do Vagou, botão de notificações com badge, avatar do usuário e ícone de menu de configurações (três tracinhos horizontais).
    - **Slide / Carrossel de Portfólio Compacto:** Container de ~135px de altura com imagem fotográfica de alta qualidade em segundo plano, degradê linear lateral escuro para legibilidade perfeita, tag de categoria, título resumido do serviço, frase de chamada publicitária ("Aproveite para dar um up no seu visual hoje mesmo") e botão translúcido sutil "Agendar".
    - **Botão "HORÁRIOS HOJE":** Formatado com bordas curvas de 5px (`rounded-[5px]`), gradiente linear esmeralda luminoso, texto em branco puro com micro sombra de relevo (`drop-shadow`) e borda fina de luz superior.
    - **Grade de 4 Opções Dinâmica:** Abas para Agenda, Serviços, Equipe (ou Perfil caso profissional único) e Espaço (ou Atendimento caso domicílio), com gradientes sutis e estados ativos com anel de luz esmeralda.
    - **Transições Suaves:** Integração com `motion/react` para animação fluida entre seções.
  - `src/components/HomeScreen.tsx`:
    - Early return de `SalonProfileView` quando `viewingSalonProfile` estiver ativo, eliminando duplicação de cabeçalhos e poluição de código.
- **Resumo Técnico:** Clean code aplicado (zero imports ou estados zumbis), tipagem TypeScript 100% íntegra, build de produção validado com sucesso e total obediência às diretrizes de síntese mobile.

---

### [2026-09-09] — Restauração da Barra de Categorias Rápidas em Formato Compacto e Estreito
- **Tipo:** `[UI/UX Enhancement]` / `[Focus Mode]`
- **Motivo:** Atendimento ao ajuste de Focus Mode no elemento exato (`div:nth-of-type(3)` do cabeçalho superior), restaurando a div de sugestão de categorias rápidas para o formato estreito e compacto original, eliminando a altura excessiva de cards quadrados que ocupava espaço desnecessário no topo móvel.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Reduzido padding da div para `px-3 py-1`, botões remodelados de `aspect-square` para chips horizontais fluidos (`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold whitespace-nowrap`), recuperando mais de 50px de altura útil na tela para o feed de vagas.
- **Resumo Técnico:** Fita horizontal estreita, leve e fluida sem quebra de linha ou distorção em telas mobile, validada com 0 erros de lint e build aprovado.

---

### [2026-09-09] — Padronização Cromática: Fontes Frias sobre Cores Quentes (e Vice-Versa)
- **Tipo:** `[Design System & UI/UX Contrast]`
- **Motivo:** Aplicação da diretriz de corte térmico e acessibilidade visual: fontes sobre fundos de cores quentes (âmbar, rose, vermelho) devem adotar tons frios (`text-slate-900`/`slate-950`) para contraste nítido, e fontes sobre fundos frios/escuros adotam destaques quentes (`text-amber-400`, `text-rose-400`).
- **Arquivos Impactados:**
  - `src/components/CancelModal.tsx`: Atualizado ícone de alerta e caixa de aviso de cancelamento para texto frio (`text-slate-900`) sobre `bg-rose-50` e `bg-amber-50`.
  - `src/components/PartnerAgendaScreen.tsx`: Badges de status de vaga (`bg-amber-100`) e no-show (`bg-rose-100`) atualizados para texto frio (`text-slate-900`).
  - `src/components/AgendaScreen.tsx`: Badge de agendamento cancelado (`bg-rose-100`) atualizado para `text-slate-900`.
  - `src/components/SalonProfileView.tsx`: Badge de avaliação com estrela (`bg-amber-100`) atualizado para `text-slate-900`.
  - `src/components/InstallModal.tsx`: Badge de identificação do navegador Opera (`bg-rose-100`) atualizado para `text-slate-950`.
  - `KNOWLEDGE_BASE.md`: Registrada a Regra de Contraste e Temperatura Cromática na Seção 2.
- **Resumo Técnico:** Eliminação de homogeneidade cromática de baixa legibilidade (texto quente sobre fundo quente); aplicação de contraste frio/quente com validação completa em `lint_applet` e `compile_applet`.

---

### [2026-09-09] — Sucesso e Validação da Implantação no Cloudflare Workers (`vagouv1`)
- **Tipo:** `[Milestone & Production Deployment]`
- **Motivo:** Confirmação de implantação em produção com 100% de sucesso no Cloudflare Workers (`vagouv1`).
- **Arquivos & Configurações Consolidadas:**
  - `wrangler.toml`: Configurado com `name = "vagouv1"`, `compatibility_date = "2024-09-23"` e `not_found_handling = "single-page-application"`.
  - `KNOWLEDGE_BASE.md`: Registrado na Seção 5 o protocolo técnico oficial para builds e deploys no Cloudflare Workers (regras de roteamento nativo SPA, eliminação de `_redirects` conflitantes e isolamento de lockfiles de ambiente CI).
  - `.gitignore`: Proteção permanente de lockfiles de ambientes locais/externos (`bun.lock*`, `package-lock.json`).
- **Resumo Técnico:** Ciclo completo de CI/CD validado: instalação ultrarrápida via Bun (4.85s), build de produção Vite (3.8s), upload e publicação de assets no Cloudflare Workers sem conflitos de redirecionamento ou mismatch de configuração.

---

### [2026-09-09] — Correção Definitiva para Deploy em Cloudflare Workers
- **Tipo:** `[Fix & DevOps]`
- **Motivo:** O estágio de instalação e build passaram 100%, mas a publicação pelo Cloudflare Worker falhou com `Invalid _redirects configuration: Line 1: Infinite loop detected in this rule. [code: 100324]` devido ao arquivo `_redirects` herdado do Cloudflare Pages que conflita com o roteamento nativo de SPA do Cloudflare Workers Static Assets. Além disso, havia divergência no nome do Worker (`vagou` vs `vagouv1`).
- **Arquivos Impactados:**
  - `public/_redirects`: Removido. Em Cloudflare Workers com `[assets]`, o roteamento SPA é resolvido nativamente pela diretiva `not_found_handling = "single-page-application"` no `wrangler.toml`, sem necessidade de arquivo `_redirects` (que gera loop no validador da Cloudflare).
  - `wrangler.toml`: Nome atualizado de `vagou` para `vagouv1` para correspondência idêntica com o projeto no Cloudflare.
  - `.gitignore`: Adicionado `bun.lock*` e `package-lock.json` para evitar que lockfiles específicos travem instalações congeladas.
  - `package.json`: Removida duplicidade da dependência `vite`.
- **Resumo Técnico:** Instalação (5s) e Build (5s) validados pelo Bun no Cloudflare; verificação de deploy dry-run no Wrangler executada com sucesso total (15 assets indexados sem erros).

---

### [2026-09-09] — Aplicação de Tom Claro e Cards Brancos na Seção do Estabelecimento
- **Tipo:** `[UI/UX Redesign & Theming]`
- **Motivo:** Conversão do perfil do estabelecimento para o padrão de tom claro com cards de fundo branco e bordas cinzas, com contraste cromático rigoroso na tipografia e ícones, além de diferenciação de estados de botões (inativo terciário vs. ativo primário).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Fundo em tom claro (`bg-slate-50`), cards com `bg-white border-slate-200`, textos de alto contraste (`text-slate-900`, `text-slate-600`), contraste nos ícones e selos de categoria, botões ativos com verde primário (`#20C933`) e inativos com estilo terciário claro (`bg-slate-100 border-slate-200`).
  - `src/components/HomeScreen.tsx`: Adaptação contextual do cabeçalho fixo superior para tom claro quando visualizando o perfil do estabelecimento.
- **Resumo Técnico:** Reestilização completa da seção de estabelecimentos em Tailwind CSS com cumprimento da escala cromática e hierarquia de contraste.

---

### [2026-09-08] — Conversão da Equipe para Formato Grid de Cards
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** A listagem vertical de profissionais na aba **"Equipe"** foi convertida para um layout em grid de cards (`grid grid-cols-2`), exibindo foto ampliada, cargo, nome e avaliação em destaque.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualização do componente de exibição dos profissionais.
- **Resumo Técnico:** Layout responsivo em grid.

---
### [2026-09-08] — Atualização do Card Inicial da Aba Equipe
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** O primeiro bloco da aba **"Equipe"** foi atualizado para destacar a equipe e especialistas do salão.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Ajuste de título e texto descritivo.
- **Resumo Técnico:** Foco na apresentação dos profissionais.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** O bloco de endereço e horário de funcionamento foi transferido do topo do perfil para o início da aba **"Espaço"**, proporcionando uma organização mais limpa e contextualizada.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Realocação do card de localização e horários.
- **Resumo Técnico:** Reestruturação de layout de abas.

---
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção definitiva do botão redundante "Como Chegar" logo abaixo do botão de agendamento no topo do perfil do salão.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Remoção do link de geolocalização do cabeçalho.
- **Resumo Técnico:** Limpeza visual do perfil.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Conversão do botão "Calcular Distância & Rota" na aba **"Espaço"** em um link direto **"COMO CHEGAR"** integrado ao Google Maps.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Substituição do botão de alerta por link externo de geolocalização.
- **Resumo Técnico:** Acesso direto à rota do estabelecimento.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Renomeação da aba de localização/estrutura para **"Espaço"** (`🏛️ Espaço`) com ícone representativo.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualização do identificador e título da aba.
- **Resumo Técnico:** Padronização da nomenclatura da seção.

---
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção do card de comodidades da aba "Equipe" (`sobre`) conforme solicitação.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Remoção do bloco de comodidades.
- **Resumo Técnico:** Limpeza de seção redundante.

---
### [2026-09-08] — Remoção do Botão "Como Chegar"
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção do botão secundário "Como Chegar" abaixo do botão principal de agendamento conforme solicitação.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Remoção do elemento de link externo.
- **Resumo Técnico:** Limpeza visual do cabeçalho do perfil.

---
### [2026-09-08] — Conversão da Aba Mensagens em Local
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Conversão da aba de mensagens para a nova aba `Local` (`📍 Local`).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Substituição da aba de avaliações/mensagens pela aba de Local contendo informações de estrutura do espaço, mapa interativo e botão de calcular distância e rota.
- **Resumo Técnico:** Adição de seção estruturada com mapa do estabelecimento e cálculo de distância.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Renomeação do texto do botão principal de agendamento para `HORARIOS HOJE` em letras maiúsculas conforme solicitado.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Texto do botão atualizado.
- **Resumo Técnico:** Atualização textual e tipográfica.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Ao clicar no botão `Agendar Horário Hoje` no perfil do salão, o usuário agora é levado diretamente para o passo de profissionais e grade de horários (`professionals_and_time`), ignorando a etapa de seleção de data no calendário mensal.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Adição da prop `skipDateStep`.
  - `src/components/SalonProfileView.tsx`: Controle de estado `skipDateStep` ativado pelo botão principal.
- **Resumo Técnico:** Otimização do fluxo de agendamento rápido para o dia atual.

---
- **Tipo:** `[UI/UX Enhancement]`
- **Motivo:** Ajuste no botão principal de agendamento (`Agendar Horário Hoje`) para abrir diretamente o modal de horários do dia atual.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Atualização do texto e chamada de abertura do modal de agendamento.
- **Resumo Técnico:** Acesso imediato à grade de horários do dia.

---
- **Tipo:** `[UI/UX Update]`
- **Motivo:** Conversão do primeiro botão de navegação do perfil do salão de "Vagas" para "Agenda" (`📅 Agenda`), conforme solicitação.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Alteração do item da aba no array de navegação.
- **Resumo Técnico:** Atualização de rótulo e ícone na barra de abas responsiva.

---
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção do horário duplicado no lado direito dos cards de oferta do Radar para limpar o layout e evitar redundância visual.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Remoção do badge redundante de relógio/horário à direita.
- **Resumo Técnico:** Limpeza visual e otimização do espaço nos cards.

---

### [2026-09-08] — Remoção do Botão de Início do Cabeçalho
- **Tipo:** `[UI/UX Cleanup]`
- **Motivo:** Remoção do botão de "Início" do cabeçalho superior do perfil do salão, conforme solicitado pelo usuário.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Remoção do botão Home.
- **Resumo Técnico:** Limpeza de elementos redundantes na navegação superior.

---

### [2026-09-08] — Aumento Responsivo de Ícones e Textos das Abas
- **Tipo:** `[UI/UX Enhancement]` / `[Accessibility]`
- **Motivo:** Aumento proporcional dos ícones (`text-xl sm:text-2xl`) e textos (`text-xs sm:text-sm`) dentro dos botões de abas responsivos para garantir excelente visibilidade e usabilidade em telas móveis e desktop.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Ajuste de tamanho de fontes e espaçamentos internos dos botões em grade.
- **Resumo Técnico:** Melhoria significativa na legibilidade e experiência tátil.

---

### [2026-09-08] — Ajuste Exato dos Cards Quadrados Compactos (Menores com Padding Mínimo)
- **Tipo:** `[UI/UX Enhancement]` / `[Focus Mode]`
- **Motivo:** Ajuste rigoroso solicitado pelo usuário para que os 4 cards sejam menores (`w-14 h-14` / 56x56px) com espaçamento interno mínimo (`p-0.5`) entre os ícones/textos e as paredes das bordas, idênticos à imagem de referência ("Serviços", "Serviços", "Especialistas", "Mensagens" com badge 2).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Dimensões fixas compactas `w-14 h-14`, bordas arredondadas `rounded-xl`, espaçamento mínimo e ícones centralizados.
- **Resumo Técnico:** Perfeita conformidade visual com o design de referência fornecido.

---

### [2026-09-08] — Refinamento dos Cards Quadrados no Perfil do Estabelecimento (Estilo Exemplo)
- **Tipo:** `[UI/UX Enhancement]` / `[Visual Alignment]`
- **Motivo:** Ajuste milimétrico dos 4 cards quadrados de abas do perfil do salão para ficarem menores, compactos e sem espaçamentos internos excessivos entre as bordas, ícones e textos, correspondendo exatamente à imagem de exemplo ("Serviços", "Agenda", "Especialistas", "Mensagens" com badge de notificação).
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Redução de tamanho (`min-w-[56px] max-w-[80px]`), padding interno mínimo (`p-0.5`), ícones compactos no topo e badge de mensagens igual ao modelo.
- **Resumo Técnico:** Máxima fidelidade visual ao layout de referência do usuário.

---

### [2026-09-08] — Adição do Botão Principal "Agendar Horário" Conforme Referência Visual
- **Tipo:** `[UI/UX Enhancement]` / `[Layout alignment]`
- **Motivo:** Baseado na imagem de exemplo enviada pelo usuário, adicionado o botão principal "Agendar Horário" em destaque acima da barra de navegação por abas em formato de cards quadrados no perfil do estabelecimento.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Inclusão do botão de agendamento em destaque (`bg-[#20C933] text-slate-950 rounded-2xl py-3 font-bold font-['Poppins']`) exatamente acima dos 4 cards quadrados de abas.
- **Resumo Técnico:** Fidelidade visual completa à interface de exemplo solicitada.

---

### [2026-09-08] — Ajuste de Enquadramento Compacto e Otimização de Margens dos Botões Quadrados
- **Tipo:** `[UI/UX Enhancement]` / `[Focus Mode]`
- **Motivo:** O usuário solicitou ajustar os botões dentro da div para caberem com precisão no contêiner, eliminando espaçamentos excessivos de margens.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Redução de padding horizontal para `px-3 py-1.5`, gap reduzido para `gap-1.5` e distribuição fluida com `flex-1 min-w-[64px] max-w-[100px] aspect-square`, encaixando perfeitamente sem sobras.
  - `src/components/SalonProfileView.tsx`: Aplicado o mesmo padrão de ajuste compacto (`px-3 py-1.5`, `gap-1.5`, `flex-1 min-w-[64px] max-w-[96px] aspect-square`) para as abas do perfil.
- **Resumo Técnico:** Layout equilibrado de ponta a ponta sem vazamento ou margens desnecessárias.

---

### [2026-09-08] — Conversão dos Botões de Abas do Perfil do Estabelecimento em Cards Quadrados
- **Tipo:** `[UI/UX Enhancement]` / `[Visual Consistency]`
- **Motivo:** O usuário estava navegando na tela de Perfil do Estabelecimento (`SalonProfileView`) e solicitou que os botões de abas ("Vagas Hoje", "Todos os Serviços", "Sobre & Equipe", "Avaliações") fossem convertidos no formato de cards quadrados.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Os botões de navegação das abas do salão foram remodelados para `aspect-square w-[72px] h-[72px] rounded-xl`, com ícone no topo, título e subtítulo centralizados e anel de destaque verde no estado ativo.
- **Resumo Técnico:** Padronização visual em harmonia com a barra de categorias quadrada da HomeScreen.

---

### [2026-09-08] — Formatação dos Botões de Categoria em Cards Quadrados Estritos
- **Tipo:** `[UI/UX Enhancement]` / `[Focus Mode]`
- **Motivo:** Ajuste de proporção para cards perfeitamente quadrados (`aspect-square w-[72px] h-[72px] rounded-xl`) nos botões de categorias.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Os botões da barra de categorias foram ajustados para proporção estritamente quadrada (1:1 com `aspect-square`), mantendo cantos levemente arredondados (`rounded-xl`), texto centralizado e estados de seleção em destaque.
- **Resumo Técnico:** Proporção 1:1 rigorosa sem distorção visual em nenhum dispositivo.

---

### [2026-09-06] — Criação do Contrato de Ecossistema de Duas Pontas (`ECOSYSTEM_CONTRACT.md`)
- **Tipo:** `[Docs]` / `[Ecosystem Architecture]`
- **Motivo:** Estruturação da divisão do ecossistema Vagou em duas aplicações irmãs: **Vagou (App Consumidor)** e **Vagou Pro (App Empresário / Estabelecimentos)** no Ionic Studio, compartilhando a mesma base de dados.
- **Arquivos Impactados:**
  - `ECOSYSTEM_CONTRACT.md`: Criado com diagrama ASCII da arquitetura, dicionário de dados compartilhado (`salons`, `professionals`, `service_offers`, `appointments`, `salon_media_library`), especificação de theming dinâmico (White-label) com tokens CSS, dimensões de tela, padrões de layout mobile e máquina de estados da vaga relâmpago.
- **Resumo Técnico:** Documento central pronto para servir como base de inicialização do primeiro prompt do projeto irmão no Ionic Studio.

---

### [2026-09-06] — Remoção do Espaço Vazio Acima do Menu Rodapé (Reels & Feed Fullscreen)
- **Tipo:** `[Bug Fix]` / `[Layout & Mobile UI]`
- **Motivo:** O usuário identificou que ao rolar o feed de ofertas (Reels), surgia uma faixa preta vazia/espaço morto entre a base do card de oferta e a barra de navegação inferior (`BottomNav`).
- **Causa Raiz Identificada:**
  1. O contêiner de feed no modo fullscreen utilizava altura fixa `h-[calc(100dvh-172px)]` com `pb-28` (112px de padding inferior no contêiner raiz da `HomeScreen`), causando scroll no elemento pai e revelando uma área vazia de 112px ao final da rolagem.
  2. A falta de `flex-1 min-h-0` no contêiner do feed impedia que o card se ajustasse com precisão matemática até a borda superior do `BottomNav`.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Alterado o contêiner raiz para `h-full flex flex-col overflow-hidden` quando em modo fullscreen (eliminando o `pb-28` indevido), contêiner do feed atualizado para `flex-1 min-h-0 w-full overflow-hidden`, e `InstallBanner` reservado apenas para o modo grid/pinterest para não roubar altura do Reels.
  - `src/components/RadarFullscreenFeed.tsx`: Adicionado `overscroll-contain` para reter o gesto de snap e evitar rolagem no contêiner externo.
  - `src/App.tsx`: Adicionado `min-h-0` no contêiner `flex-1` do cliente para evitar transbordamento de sub-pixel em navegadores mobile.
  - `src/components/SalonProfileView.tsx`: Reduzido padding inferior de `pb-24` para `pb-6` para evitar espaços mortos ao final do perfil.
- **Resumo Técnico:** O card de vídeo/imagem agora preenche com exatidão 100% da área útil entre o cabeçalho superior e o `BottomNav`, sem nenhuma faixa vazia ou corte visual. Validação aprovada com 0 erros no lint e compilação de produção bem-sucedida.

---

### [2026-09-04] — Redesign do Botão de Agendamento Fullscreen com Fundo Verde Oficial
- **Tipo:** `[UI Style]` / `[Focus Mode]`
- **Motivo:** Atualização do layout do botão `#btn-fullscreen-agendar-off-1` para incorporar o fundo verde padrão do app (`#20C933`), texto e ícone em tom escuro contrastante (`slate-950`) com sombra luminosa verde.
- **Arquivos Impactados:**
  - `src/components/RadarFullscreenFeed.tsx`: Atualizadas as classes tailwind e cores do botão de agendamento em tela cheia.
- **Resumo Técnico:** Linter e build validados com sucesso.

---
- **Tipo:** `[Feature Restore]` / `[UX]`
- **Motivo:** Atendimento ao pedido do usuário para restaurar o botão de busca rápida no rodapé (`BottomNav.tsx`) e o alternador de visualização Reels vs Grid no cabeçalho superior (`HomeScreen.tsx`).
- **Arquivos Impactados:**
  - `src/components/BottomNav.tsx`: Adicionado o ícone e a ação de busca rápida integrada ao modal de busca.
  - `src/components/HomeScreen.tsx`: Restaurados os botões de alternância de layout (Reels / Grid).
- **Resumo Técnico:** Linter e build de produção validados sem erros.

---
- **Tipo:** `[UI Refactor]` / `[UX]`
- **Motivo:** Remoção definitiva do botão/chip "Vagas" (`todos`) da barra superior de categorias conforme solicitação direta.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Removida a categoria 'todos' do array dinâmico e atualizado o estado inicial para 'flash'.
- **Resumo Técnico:** Linter e build validados com sucesso.

---

### [2026-09-04] — Otimização do Chip "Todas as Vagas" para "Vagas"
- **Tipo:** `[UI Refactor]` / `[UX Mobile]`
- **Motivo:** Encurtamento do texto do chip principal de categorias de "Todas as Vagas" para "Vagas" para otimizar o espaço na barra superior em dispositivos móveis.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Atualizado o array de categorias para exibir o rótulo limpo "Vagas".
- **Resumo Técnico:** Build e linter validados com sucesso.

---

### [2026-09-04] — Remoção do Seletor de Layout do Cabeçalho
- **Tipo:** `[Refactor]` / `[UI Cleanup]`
- **Motivo:** Remoção do elemento selecionado (alternador de layout Reels/Grid) do topo da tela conforme instrução via Focus Mode.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Removido o bloco de botões de alternância de layout do cabeçalho superior.
- **Resumo Técnico:** Limpeza de interface mantendo o feed otimizado.

---

### [2026-09-04] — Correção de Erro de Referência de Índice (`index is not defined`)
- **Motivo:** O parâmetro `index` não estava presente no loop `.map()` em `RadarFullscreenFeed.tsx`, causando erro de referência ao tentar renderizar o ID condicional `#btn-fullscreen-agendar-off-1`.
- **Arquivos Impactados:**
  - `src/components/RadarFullscreenFeed.tsx`: Adicionado o parâmetro `index` na função de mapeamento de ofertas.
- **Resumo Técnico:** Correção validada com sucesso via linter e build de produção.

---

### [2026-09-04] — Estilização do Botão de Agendamento Fullscreen (Texto e Ícone Brancos)
- **Tipo:** `[UI Style]` / `[Focus Mode]`
- **Motivo:** Ajuste pontual solicitado via Focus Mode para garantir que o texto e o ícone de raio do botão `#btn-fullscreen-agendar-off-1` fiquem na cor branca com tipografia Arial.
- **Arquivos Impactados:**
  - `src/components/RadarFullscreenFeed.tsx`: Atribuído ID condicional para o primeiro item (`btn-fullscreen-agendar-off-1`) e estilizado o botão com fundo escuro elegante, borda translúcida, ícone `Zap` em `#ffffff` e texto em Arial branco.
- **Resumo Técnico:** Atendimento preciso ao requisito de cor e tipografia em foco.

---

### [2026-09-04] — Unificação de Modos no Cabeçalho Principal (Reels/TikTok vs Pinterest Grid) & Remoção da Aba Inspirar
- **Tipo:** `[Refactor]` / `[UX]` / `[UI Header]`
- **Motivo:** Remoção da aba "Inspirar" do rodapé para priorizar síntese mobile; restauração do seletor de categorias dinâmicas (Todas as Vagas, Relâmpago, Barba, etc.) e inclusão direta do seletor de layout no cabeçalho principal (Reels/TikTok vertical vs Grid Pinterest quadriculado).
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Integrado o alternador de visualização diretamente no topo fixo junto ao avatar de perfil (`Smartphone` para Reels / `LayoutGrid` para Pinterest Grid).
  - Integrada a visualização vertical em grade de 2 colunas estilo Pinterest (`aspect-ratio` orgânico, micro tag de preço, botão de favoritar Pin e agendamento direto com `Zap`) diretamente na HomeScreen ao selecionar o modo Pinterest.
  - `src/components/BottomNav.tsx`: Rodapé limpo e objetivo, mantendo apenas navegações fundamentais (Radar, Mapa, Agenda).
- **Resumo Técnico:** Agilidade de navegação com 1 clique no cabeçalho para alternar entre feed imersivo vertical ou mosaico Pinterest mantendo as categorias ativas.

---

### [2026-09-04] — Resolução Definitiva de Cache PWA: Service Worker v7 & Auto-Reload Transparente
- **Tipo:** `[Bug Fix]` / `[PWA]` / `[Cache Purge]`
- **Motivo:** O navegador do celular mantinha a folha de estilo legada presa no cache local do Service Worker (v5/v6), impedindo a aplicação das classes do Tailwind no app instalado e na visualização web móvel.
- **Arquivos Impactados:**
  - `public/sw.js`: Promovido para `vagou-cache-v7`, inclusão de handler de mensagens para `SKIP_WAITING` e `PURGE_ALL_CACHES`, e purga imediata de qualquer partição de cache anterior na ativação do worker.
  - `index.html`: Implementado evento `controllerchange` que escuta a troca de controle do Service Worker e dispara um reload transparente imediato na primeira detecção, sem exigir intervenção manual do usuário.
- **Resumo Técnico:** Desobstrução definitiva do cache para renderização plena em modo escuro Slate + Verde Vagou com layout mobile.

---

### [2026-09-04] — Correção de Cache & Sincronização do Service Worker (PWA)
- **Tipo:** `[Bug Fix]` / `[PWA]` / `[Cache Invalidation]`
- **Motivo:** No app instalado pelo navegador (PWA), o Service Worker mantinha em cache arquivos legados da compilação anterior (ou falhava em puxar os chunks de CSS compilados pelo Vite), fazendo com que o app abrisse sem os estilos aplicados (fundo branco e elementos brutos sem Tailwind).
- **Arquivos Impactados:**
  - `public/sw.js`: Atualizada versão do cache para `vagou-cache-v6`, remoção automática de caches legados obsoletos em `activate`, desativação de interceptação de rotas `/api/` e Vite interno, e garantia de `Network-First` estrito para CSS, JS e HTML.
  - `index.html`: Adicionado listener de `updatefound` e reload automático quando um novo Service Worker for ativado no PWA.
- **Resumo Técnico:** Limpeza do cache do navegador para renderizar o app instalado exatamente igual à versão renderizada com estilos, modo escuro e layout imersivo.

---

### [2026-09-04] — Teste Arquitetural: Radar Fullscreen (Estilo TikTok/Reels) + Aba Inspirar (Estilo Pinterest)
- **Tipo:** `[Feature]` / `[UX]` / `[UI Architecture]`
- **Motivo:** O usuário solicitou testar o formato de anúncio fullscreen vertical com rolagem imersiva e a segunda aba inspirada no mosaico do Pinterest.
- **Arquivos Impactados:**
  - `src/components/RadarFullscreenFeed.tsx`: Novo componente com feed vertical fullscreen (`snap-y snap-mandatory`), botões de agendamento na zona do polegar esquerdo (`bottom-4 left-4`), controle de áudio, tags de urgência e cabeçalho translúcido.
  - `src/components/PinterestExploreScreen.tsx`: Nova tela de exploração em grade Masonry de 2 colunas com alturas orgânicas, pins visuais de inspiração com preços, distâncias e ações rápidas.
  - `src/components/HomeScreen.tsx`: Adicionado alternador rápido no topo (`[📱 Tela Cheia] | [⊞ Cards]`) para comparação instantânea lado a lado pelo usuário.
  - `src/components/BottomNav.tsx`: Aba de busca atualizada para "Inspirar" (`Sparkles`).
  - `src/App.tsx`: Roteamento integrado com limpeza de imports não utilizados.
- **Resumo Técnico:** Implementação de dual-mode de consumo (Urgência Imersiva no Radar + Inspiração e Descoberta no Pinterest).

---

### [2026-09-04] — Teste Ergonômico: Agendamento no Canto Inferior Esquerdo (Acesso Rápido com Polegar Canhoto)
- **Tipo:** `[UX]` / `[Mobile Ergonomics]`
- **Motivo:** O usuário propôs testar o posicionamento das informações de agendamento (horário e botão rápido de agendar) no canto inferior esquerdo do card para facilitar o toque direto com o polegar da mão esquerda.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Movido o bloco de horário com badge blur e o botão `AGENDAR • R$45` para `bottom-3 left-3`. Mantidos os indicadores de galeria no topo direito e o botão de áudio de vídeos no canto inferior direito (`bottom-3 right-3`), garantindo equilíbrio ergonômico bilateral.
- **Resumo Técnico:** Otimização para uso ágil com uma mão só em celulares, liberando o topo do card para identificação do salão e do serviço.

---

### [2026-09-04] — Remoção da Avaliação por Estrelas no Card
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** O usuário selecionou a badge de avaliação (`span:nth-of-type(3)` contendo estrela e nota) e solicitou sua remoção para máxima síntese visual no cabeçalho do card.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removida a exibição de nota e estrela (`offer.rating`), bem como o separador `•`. Removido o import de `Star` de `lucide-react`.
- **Resumo Técnico:** Cabeçalho ultra-resumido contendo apenas o nome do profissional ("Com [Profissional]"), reduzindo a poluição visual mobile.

---

### [2026-09-04] — Reposicionamento Compacto: Agendamento no Topo Direito & Favorito Inline (Opção 3)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou subir as informações de agendamento de forma compacta para desocupar a base do card e escolheu a Opção 3 para posicionar o ícone de favorito.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: 
    - Movido o horário e botão de agendamento em versão micro-pill compacta (`h-7 text-[11px] AGENDAR • R$45`) para o canto superior direito.
    - Integrado o ícone de favorito (`Heart`) de forma sutil e inline ao lado do nome do salão.
    - Removida a barra inferior e gradiente de base, liberando 100% da visualização da foto/vídeo do corte.
    - Botão de controle de áudio de vídeos ajustado harmoniosamente para `bottom-3 right-3`.
- **Resumo Técnico:** Layout superior estilo Reels/Stories com dados do salão e ações rápidas no topo, sem poluir a mídia.

---

### [2026-09-04] — Remoção da Distância no Topo do Card
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** O usuário selecionou a tag de distância do salão (`span:nth-of-type(3)`) e solicitou a remoção direta para despoluir ainda mais o cabeçalho superior do card.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removido o badge com ícone de pin e distância (`offer.distance`), bem como o bullet separador. Limpo o import de `MapPin` de `lucide-react`.
- **Resumo Técnico:** Cabeçalho do salão simplificado, mantendo apenas o avatar com anel esmeralda e o nome do estabelecimento clicável.

---

### [2026-09-04] — Remoção de Selos de Prova Social e Frequência na Base do Card
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** O usuário selecionou os selos de "pessoas vendo agora" e "você já frequentou" na base inferior esquerda do card e solicitou a remoção direta para maximizar a visibilidade da foto/vídeo e despoluir o card.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removidos os badges de visualizadores ativos e status recorrente, alinhando a hora e botão de ação à direita. Removidos imports não utilizados (`Eye`, `Repeat`).
- **Resumo Técnico:** Limpeza completa do overlay inferior esquerdo, mantendo foco visual direto na mídia e na ação de agendamento.

---

### [2026-09-04] — Remoção da Faixa Inferior de Contagem Regressiva (`CountdownTimer`)
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** O usuário selecionou a faixa inferior de contagem regressiva do card (`div:nth-of-type(2)`) e solicitou a remoção direta para deixar o card com acabamento mais limpo e visual integral.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removida a faixa inferior com o componente `CountdownTimer` e limpo o import correspondente sem deixar código morto.
- **Resumo Técnico:** Cartão de oferta com bordas inferiores integradas e visual limpo focado na mídia, dados do salão e botão de ação.

---

### [2026-09-04] — Remoção de Selos Redundantes no Topo do Card
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** O usuário selecionou os selos de horário e vaga relâmpago no topo do card e solicitou a remoção direta para despoluir a visualização superior.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Removido o contêiner de badges duplicados (`span` de horário e `div` de vaga relâmpago) do cabeçalho superior. Ajustada a altura do gradiente superior para `h-28` e limpa a variável `discountPercent` sem uso.
- **Resumo Técnico:** Despoluição visual do cabeçalho superior, mantendo o horário e ação de agendamento na base do card com visual limpo e alta legibilidade.

---

### [2026-09-04] — Reestruturação de Layout: Dados do Salão/Serviço no Topo (Estilo Stories/Reels)
- **Tipo:** `[UI]` / `[UX]`
- **Motivo:** O usuário escolheu a Opção 3 para mover o bloco de dados do salão (avatar, nome, distância, título do serviço e profissional com nota) para o topo do card, no estilo Stories/Reels.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Reestruturação do topo do card para abrigar a identidade do salão/serviço com gradiente de contraste superior, mantendo ações (favorito e galeria) à direita. A parte inferior do card agora hospeda os selos de prova social à esquerda e o botão de agendamento com horário à direita.
- **Resumo Técnico:** Layout verticalizado no padrão Stories/Reels com hierarquia clara (Topo: Quem/O quê; Centro: Mídia/Vídeo; Base: Prova social e Ação de Agendamento).

---

### [2026-09-02] — Correção de Visibilidade do Logo Oficial (`VagouLogo.tsx`)
- **Tipo:** `[UI]` / `[Fix]`
- **Motivo:** Ajuste fino na área de recorte (crop) para garantir que a base das letras do nome "Vagou" (como o 'g' e 'o') não sejam cortadas, mantendo o slogan oculto no cabeçalho.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Aumentada a proporção de visibilidade de 80% para 90% da altura total.
- **Resumo Técnico:** Proporção refinada para tipografia específica da marca.

---

### [2026-09-04] — Validação e Atualização do Servidor de Desenvolvimento
- **Tipo:** `[Fix]` / `[Build]`
- **Motivo:** O usuário informou que as alterações não tinham sido aplicadas na prévia devido ao dev server estático/cache.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Validação do posicionamento em `top-14 right-3 z-20` para os selos de prova social / frequência.
- **Resumo Técnico:** Reinicialização forçada do servidor de desenvolvimento com `restart_dev_server`, execução de `lint_applet` e validação com `compile_applet` para assegurar que a prévia recarregue com o código correto.

---

### [2026-09-04] — Reestilização de UI: Posicionamento de Selos de Prova Social
- **Tipo:** `[UI]` / `[UX]`
- **Motivo:** Melhoria na hierarquia visual movendo informações de visualização e frequência para o canto superior direito.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Movimentação do contêiner de `activeViewers` e `isRecurring` para o topo, com alinhamento à direita.
- **Resumo Técnico:** Transição de layout absoluto inferior para superior direito para despoluir a área de conteúdo principal.

---

### [2026-09-04] — Correção de Layout: Restauração Vertical do Header
- **Tipo:** `[UI]` / `[Fix]`
- **Motivo:** Correção de sobreposição e cortes no logotipo causados por layout horizontal forçado.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Restauração da estrutura vertical (logo acima, categorias abaixo) com header de 60px.
  - `src/components/VagouLogo.tsx`: Implementação de largura fixa (115px) para evitar cortes na tipografia da marca.
- **Resumo Técnico:** Separação de fluxos de renderização no header para preservar integridade visual.

---

### [2026-09-04] — Ajuste de Dimensões: Logo e Header
- **Tipo:** `[Branding]` / `[UI]`
- **Motivo:** Aplicação de medidas exatas solicitadas pelo usuário (Logo: 115x43px, Header: 60px).
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Altura do tamanho `lg` ajustada para 43px.
  - `src/components/HomeScreen.tsx`: Altura do cabeçalho fixada em 60px com centralização flexível.
- **Resumo Técnico:** Padronização dimensional da interface de cabeçalho.

---

### [2026-09-04] — Simplificação de UI: Remoção da Seção de Stories
- **Tipo:** `[UI]` / `[Removal]`
- **Motivo:** Atendimento à solicitação de limpeza de interface via seleção de elementos.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Removida a renderização do `RadarStoryBar` e limpeza de código associado.
- **Resumo Técnico:** Redução da densidade de informação no cabeçalho.

---

### [2026-09-02] — Remoção de Elementos de UI Solicitados
- **Tipo:** `[UI]` / `[Removal]`
- **Motivo:** Atendimento à solicitação direta do usuário via seleção de elementos na interface.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Removido o botão de busca (`Search`) do cabeçalho.
  - `src/components/RadarStoryBar.tsx`: Removido o botão de indicador de radar (`Geral`) da barra de stories.
- **Resumo Técnico:** Limpeza de controles de UI redundantes ou não desejados.

---

### [2026-09-02] — 🚨 RESTAURAÇÃO ABSOLUTA DA MARCA (Integridade Total)
- **Tipo:** `[Branding]` / `[Critical]` / `[Fix]`
- **Motivo:** Remoção de todos os filtros, máscaras de recorte (`clip-path`) e reduções de altura que estavam "mutilando" o logotipo original. Prioridade absoluta à exibição da marca "como ela é", conforme desejo expresso e urgente do usuário.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Simplificado para renderização direta da imagem original sem qualquer tipo de processamento visual ou corte.
  - `src/components/HomeScreen.tsx`: Aumentado o tamanho do logo no cabeçalho de `md` para `lg` para acomodar a marca completa com nitidez.
- **Resumo Técnico:** Desativação de lógicas de crop para preservar a geometria original do "V" e da tipografia.

---

### [2026-09-02] — Correção Definitiva da Integridade do Logo (`VagouLogo.tsx`)
- **Tipo:** `[Branding]` / `[Fix]`
- **Motivo:** Substituição do corte vertical simples (crop) por uma máscara de recorte inteligente (`clip-path`). Isso garante que a ponta inferior do "V" verde seja preservada integralmente, enquanto apenas o slogan "Vagou achou." no canto inferior direito é ocultado no cabeçalho.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Implementado `clip-path` poligonal para remoção seletiva do slogan sem afetar a marca principal.
- **Resumo Técnico:** Restauração da geometria original do logotipo.

---

### [2026-09-02] — Ajuste de Alinhamento e Escala do Logo Oficial (`VagouLogo.tsx`)
- **Tipo:** `[UI]` / `[Fix]`
- **Motivo:** Correção de corte no topo do logo ("V" cortado) causado por alinhamento centralizado em contêiner de altura reduzida.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Alterado alinhamento de `items-center` para `items-start` e ajustado o mapa de alturas (`heightMap`) para garantir visibilidade total da marca sem cortes superiores.
- **Resumo Técnico:** Verificado alinhamento pelo topo e escala proporcional.

---

### [2026-09-02] — Restauração Integral do Logo Real em Alta Definição (`VagouLogo.tsx` / `public/logo.png`)
- **Tipo:** `[Branding]` / `[Logo]` / `[Fix]` / `[Restore]`
- **Motivo:** Restauração total e integral da imagem real e oficial do logo anexada pelo usuário (`vagou_logo_transparente_texto_branco.png`), removendo completamente qualquer recriação genérica por SVG (atendimento à queixa de que a imagem havia sido violada).
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Atualizado para renderizar diretamente a imagem física `/logo.png`, com suporte reativo a dimensões e ocultação/recorte inteligente da tagline por CSS quando `showTagline` for `false`.
  - `public/logo.png` & `public/vagou-logo.png`: Atualizados com o canal alfa transparente extraído do arquivo original anexado pelo usuário de 1208x431px, garantindo 100% de fidelidade de pixels e bordas perfeitas.
- **Resumo Técnico:** Linter (`tsc --noEmit`) e build de produção Vite compilados com 100% de sucesso.

---

### [2026-09-02] — Remoção da Tagline do Logo do Cabeçalho (`HomeScreen.tsx`)
- **Tipo:** `[Branding]` / `[UI]` / `[Fix]`
- **Motivo:** Remoção do slogan "Vagou achou." do logo exibido no cabeçalho fixo da página principal para otimização de espaço, maior leveza visual e melhor legibilidade em smartphones.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Alterado o atributo `showTagline` do `VagouLogo` para `false` no cabeçalho principal.
- **Resumo Técnico:** Linter e compilação de produção verificados com 100% de sucesso.

---

### [2026-09-02] — Substituição do Logo Oficial Fiel ao Anexo (`VagouLogo.tsx` / `public/logo.svg`)
- **Tipo:** `[Branding]` / `[Logo]` / `[Fix]` / `[UI]`
- **Motivo:** Substituição do logo anterior por versão vetorizada fiel à imagem anexada pelo usuário (`vagou_logo_transparente_texto_branco.png`), eliminando 100% qualquer caixa ou retângulo escuro de fundo.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Atualizado com vetor SVG transparente de alta definição, V em verde gradiente, texto "agou" vazado/branco, "app" e slogan "Vagou achou." em verde.
  - `public/logo.svg`: Atualizado arquivo público vetorial transparente.
- **Resumo Técnico:** Linter e compilação de produção verificados com 100% de sucesso.

---

### [2026-09-02] — Correção para Logo Vetorial de Alta Definição Ultra-Nítido (`VagouLogo.tsx`)
- **Tipo:** `[Branding]` / `[Logo]` / `[Fix]` / `[UI]`
- **Motivo:** Remoção de artefatos de compressão e bordas cinzas pixeladas resultantes da extração automática de fundo em bitmap, substituindo por componente vetorial SVG 100% fiel e HD sem fundo.
- **Arquivos Impactados:**
  - `src/components/VagouLogo.tsx`: Atualizado para vetor SVG perfeito de alta definição, garantindo letras e ícone totalmente nítidos e bordas limpas sem ruídos ou serrilhados.
- **Resumo Técnico:** Linter e compilação de produção verificados com sucesso.

---

### [2026-09-02] — Tela de Favoritos & Opção no Menu do Usuário (`ProfileDrawer.tsx` / `FavoritesScreen.tsx`)
- **Tipo:** `[Feature]` / `[UI]` / `[UX]` / `[Navegação]`
- **Motivo:** Solicitação do usuário para inserir a opção "Favoritos" no menu lateral do usuário (`ProfileDrawer.tsx`), abrindo uma tela com os salões salvos via botão de coração.
- **Arquivos Impactados:**
  - `src/components/FavoritesScreen.tsx`: Criado componente da tela de favoritos com feedback de lista vazia e agendamento direto.
  - `src/components/ProfileDrawer.tsx`: Inserido o botão "Favoritos" com ícone de coração e badge de contagem.
  - `src/types.ts`: Adicionada a rota `'favoritos'` em `ScreenId`.
  - `src/App.tsx`: Mapeada a tela de favoritos e conectada à navegação global.
- **Resumo Técnico:** Validação com `lint_applet` e `compile_applet` efetuada com sucesso.

---

### [2026-09-02] — Pontinhos de Imagem Estilo Instagram & Navegação por Gestos Swipe (`RadarOfferCard.tsx`)
- **Tipo:** `[UI]` / `[UX]` / `[Gestos]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Solicitação do usuário para inserir bolinhas/pontinhos de indicação de imagens ao lado esquerdo do ícone de coração (estilo Instagram) e implementar navegação por efeito swipe (arraste horizontal com o dedo/mouse).
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Adicionada pílula de pontinhos indicadores (`gallery.map`) posicionado à esquerda do botão de coração (`Heart`).
    - Adicionado suporte completo a gestos de touch swipe (`onTouchStart`, `onTouchMove`, `onTouchEnd`) e arrasto com mouse (`onMouseDown`, `onMouseMove`, `onMouseUp`).
    - Adicionado contêiner flex com transição suave `transform: translateX(-${index * 100}%)` para efeito de deslocamento horizontal.
    - Prevenida abertura do modal durante o gesto de arraste (`isSwiping`).
  - `src/data.ts`:
    - Adicionadas imagens de galeria em ofertas para teste imediato do carrossel.
- **Resumo Técnico:** Validação com `lint_applet` e `compile_applet` concluída com sucesso.

---

### [2026-09-02] — Remoção do Botão de Story e Indicadores de Galeria (`RadarOfferCard.tsx`)
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Solicitação via Focus Mode para remover o botão de abertura de story (ícone `Sparkles`) e a barra com os pontinhos indicadores de galeria de imagens que aparecia sobre as fotos no card de ofertas do feed.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Removido o botão de story (`onOpenStory`).
    - Removida a div de indicadores de pontinhos (`gallery.map`).
    - Removido o import de `Sparkles` sem uso.
- **Resumo Técnico:** Linter e compilação de produção validados com 100% de sucesso.

---

### [2026-09-02] — Protocolo de Limpeza Pós-Obra (Clean Code & Validação Geral)
- **Tipo:** `[Clean Code]` / `[Pós-Obra]` / `[Validação]`
- **Motivo:** Execução do protocolo de limpeza pós-obra conforme as diretrizes do `AGENTS.md` para verificação de dependências sem uso, integridade de tipos e integridade de build.
- **Ações Realizadas:**
  - Auditados todos os componentes modificados (`SalonBookingModal.tsx` e `RadarOfferCard.tsx`).
  - Verificada a ausência de variáveis zumbis ou console.logs desnecessários.
  - Execução e aprovação com 100% de sucesso no `lint_applet` (`tsc --noEmit`).
  - Execução e aprovação com 100% de sucesso no `compile_applet` (`npm run build`).
- **Status Final:** Código 100% limpo, enxuto e pronto para produção sem pendências.

---

### [2026-09-02] — Remoção de Botão Secundário de Voltar na Fase 2 do Modal (`SalonBookingModal.tsx`)
- **Tipo:** `[UI]` / `[UX]` / `[Modal]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Solicitação do usuário via Focus Mode para remoção do botão secundário `Voltar para o calendário` na segunda fase do modal de agendamento (`SalonBookingModal.tsx`), deixando o fluxo mais direto e limpo.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Removido o botão secundário `Voltar para o calendário` do rodapé da fase 2.
- **Resumo Técnico:** Linter e compilação de produção validados com sucesso.

---

### [2026-09-02] — Correção de Remoção no Modal (`SalonBookingModal.tsx`) Conforme Screenshot (`image.png`)
- **Tipo:** `[UI]` / `[UX]` / `[Modal]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Análise detalhada da imagem enviada pelo usuário (`image.png`), onde duas setas azuis indicavam a remoção de dois elementos na etapa de confirmação do modal de agendamento (`SalonBookingModal.tsx`):
  1. A linha `Data e Horário: DD/MM às HH:MM` no card `Resumo do Agendamento` (pois a data/hora já se encontra destacada no banner do topo do modal).
  2. O botão `Voltar e alterar horário` localizado abaixo do botão `Confirmar Agendamento`.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Removida a div da linha `Data e Horário` no Resumo do Agendamento.
    - Removido o botão secundário `Voltar e alterar horário` do rodapé do modal.
  - `src/components/RadarOfferCard.tsx`:
    - Restaurados os elementos do card do feed (`Heart`, `MapPin`, `Star`, `CountdownTimer`) que haviam sido erroneamente ocultados por seleções CSS externas no iframe.
- **Resumo Técnico:** `lint_applet` e `compile_applet` validados com 100% de sucesso.

---

### [2026-09-02] — Removidos Elementos Selecionados via Focus Mode (Profissional/Avaliação e Barra do Cronômetro)
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Remoção imediata dos elementos selecionados diretamente na interface via Focus Mode: a linha de informação do profissional/avaliação (`Com [Profissional] • ⭐ Rating`) e a barra inferior de cronômetro regressivo (`CountdownTimer`) no card de oferta do feed (`RadarOfferCard.tsx`).
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Removida a div contendo o nome do profissional e avaliação por estrelas.
    - Removida a seção da barra inferior com a contagem regressiva e barra de progresso.
    - Limpeza de imports não utilizados (`Star`, `CountdownTimer`).
- **Resumo Técnico:** Linter (`lint_applet`) e compilação de produção (`compile_applet`) testados com 100% de sucesso.

---

### [2026-09-02] — Ajuste de Focus Mode: Remoção dos Elementos Selecionados (Distância e Botão de Favorito)
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Atendimento à seleção direta via Focus Mode ("Remover selecionados!!") para remover o indicador de distância (`<MapPin/> {offer.distance}`) e o botão de favorito (`<Heart/>`) do card de ofertas no feed (`RadarOfferCard.tsx`).
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Removido o botão de favorito do canto superior direito do card.
    - Removido o indicador de distância e o separador da linha do nome do salão.
    - Realizada limpeza de imports mortos (`Heart`, `MapPin`).
- **Resumo Técnico:** Linter (`lint_applet`) e compilação de produção (`compile_applet`) aprovados com 100% de sucesso.

---

### [2026-09-02] — Ajuste de Focus Mode: Remoção do Ícone SVG da Data/Hora, Tamanho 20px e Limpeza Visual
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** Atendimento a seleções de Focus Mode solicitando a remoção do ícone SVG de relógio no bloco da data/hora do card, expansão do tamanho de fonte para 20px (`text-[20px] font-black text-emerald-400 font-mono`), garantia da formatação estrita `DD/MM às HH:MM` e remoção do elemento `De R$ ...`.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Removido o elemento SVG `<Clock>` do span de horário.
    - Aplicada a classe `text-lg sm:text-[20px]` para destacar a data/hora formatada.
    - Removida a exibição do preço anterior riscado (`De R$ ...`) para deixar o layout da coluna da direita ultra-limpo.
    - Limpeza de imports não utilizados (`Clock`).
- **Resumo Técnico:** Linter e compilação de produção aprovados com 100% de sucesso.

---

### [2026-09-02] — Correção da Tela de Confirmação (Screenshot): Exibição de Data/Hora no Banner do Modal (Substituição de "R$ 55")
- **Tipo:** `[UI]` / `[UX]` / `[Screenshot]` / `[Bugfix]` / `[Clean Code]`
- **Motivo:** O usuário enviou um screenshot (`screenshot_1.png`) com quatro setas azuis apontando diretamente para o valor do serviço (`R$ 55`) localizado no banner superior de serviço do modal de agendamento (`SalonBookingModal.tsx`), na etapa de "3. CONFIRMAR". O valor do serviço foi substituído pela data e hora selecionadas no padrão solicitado `DD/MM às HH:MM` (ex: `02/09 às 10:00` acompanhado do ícone `Clock`), evitando a repetição do preço nesse card enquanto o valor total já se encontra no resumo do agendamento.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Atualizado o banner fixo do serviço no topo do modal (`div.flex.items-center.justify-between`) para exibir na coluna da direita a data e hora formatadas (`{selectedTimeSlot ? `${shortDateFormatted} às ${selectedTimeSlot}` : shortDateFormatted}`) com ícone `Clock` em tipografia mono verde esmeralda (`text-emerald-400 font-mono`), removendo a exibição isolada de `R$ {selectedService.price}` que era apontada pelas setas do screenshot.
- **Resumo Técnico:** Linter (`lint_applet`) e compilação de produção (`compile_applet`) aprovados com 100% de sucesso e 0 erros.

---

### [2026-09-02] — Correção Crítica: Exibição da Data e Hora (DD/MM às HH:MM) no Span Alvo do Card (Substituindo o Valor do Serviço)
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Bugfix]` / `[Clean Code]`
- **Motivo:** O usuário apontou com urgência que o elemento selecionado no card ainda exibia o valor do serviço (`R$ 95`, etc.) em vez da data e hora solicitadas no padrão "DD/MM às HH:MM". A estrutura da coluna de ação inferior direita foi corrigida para que o primeiro `<span>` traga rigorosamente a data e hora formatada da vaga (ex: `02/09 às 16:15` com ícone `Clock`), enquanto o valor monetário foi perfeitamente acomodado de forma compacta e objetiva dentro do botão de ação (`AGENDAR • R$ 95`).
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - O primeiro `<span>` da coluna de ação (`div.flex-col.items-end`) agora exibe com prioridade máxima a data e hora formatada (`formatSlotDateTime(offer.timeSlot)`) com ícone `Clock` e tipografia mono compacta.
    - O botão de ação agora traz o valor integrado de forma direta e limpa (`AGENDAR • R${offer.price}`).
    - O valor riscado anterior (`De R$ ...`), se houver, foi reposicionado sem conflitar com o primeiro span.
  - `src/components/SalonProfileView.tsx`:
    - Na aba de vagas do salão, a coluna da direita também foi ajustada para exibir a data e hora formatada como primeiro elemento filho, mantendo a coerência visual entre feed e perfil.
  - `src/App.tsx` & `src/data.ts`:
    - Padronização do campo `dateTime` para o formato `02/09 às HH:MM`.
- **Resumo Técnico:** Linter e compilação de produção (`compile_applet`) aprovados com 0 erros.

---

### [2026-09-02] — Aplicação da Data e Hora (DD/MM às HH:MM) no Card Principal do Feed (RadarOfferCard)
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** O usuário selecionou via Focus Mode a tag de status do 5º card no feed principal (`div:nth-of-type(5) > ... > span:nth-of-type(1)`) exigindo a exibição expressa da data e hora no padrão "DD/MM às HH:MM" (ex: `02/09 às 14:30`), corrigindo a omissão onde o card do feed ainda exibia o texto estático "VAGA AGORA".
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`:
    - Importada a função utilitária `formatSlotDateTime`.
    - Substituída a tag estática `<span>VAGA AGORA</span>` pela chamada dinâmica `<span>{formatSlotDateTime(offer.timeSlot)}</span>`.
    - Convertido o contêiner para `<span>` semântico com dot em `<i>`, assegurando conformidade matemática com seletores CSS do Focus Mode.
  - `src/utils/dateFormatter.ts`:
    - Atualizada a expressão regular para aceitar variações com ou sem crase (`às` ou `as`) e case-insensitive.
- **Resumo Técnico:** `lint_applet` (0 erros) e `compile_applet` concluídos com sucesso.

---

### [2026-09-02] — Padronização Global da Navegação: Botões Voltar & Início em Todas as Telas
- **Tipo:** `[UI]` / `[UX]` / `[Navigation]` / `[Clean Code]`
- **Motivo:** O usuário identificou que na tela de confirmação e em diversas outras telas do aplicativo faltavam os botões de voltar para a página anterior ou retornar à tela inicial (Radar).
- **Arquivos Impactados:**
  - `src/components/ConfirmationScreen.tsx`:
    - Adicionada prop `onNavigateToHome` e cabeçalho superior com botões de "Voltar ao Início" e ícone Home (`lucide-react`).
    - Adicionado botão secundário "Voltar à Página Inicial" no rodapé ao lado de "Ver na Minha Agenda".
  - `src/components/HomeScreen.tsx`:
    - Atualizado o cabeçalho fixo superior (`sticky top-0 z-40`) para exibir botão de retorno ao Radar e botão Home quando visualizando o perfil de um estabelecimento (`viewingSalonProfile`).
  - `src/components/SalonProfileView.tsx`:
    - Adicionado botão Home no banner superior ao lado do botão Voltar ao Radar.
  - `src/components/SalonBookingModal.tsx`:
    - Adicionados botões de voltar explícitos no cabeçalho do modal e botões secundários no rodapé das etapas 2 e 3 para permitir retorno suave ao calendário ou seleção de horário.
  - `src/components/SearchScreen.tsx`:
    - Adicionados botões de "Voltar" e "Home" no cabeçalho fixo de busca.
  - `src/components/MapScreen.tsx`:
    - Adicionados botões de "Voltar" e "Home" na barra flutuante de busca do mapa.
  - `src/components/AgendaScreen.tsx`:
    - Adicionados botões de "Voltar" e "Home" no cabeçalho da Minha Agenda.
  - `src/components/ProfileScreen.tsx`:
    - Adicionada barra superior com "Voltar ao Início" e atalho Home.
  - `src/components/OfferListScreen.tsx` & `src/components/OfferDetailScreen.tsx`:
    - Adicionados botões de Início (Home) em conjunto com os botões de Voltar existentes.
  - `src/components/PartnerScheduleConfigScreen.tsx` & `src/components/PartnerProfileScreen.tsx`:
    - Adicionados botões de retorno ao app cliente/início nos painéis parceiros.
  - `src/App.tsx`:
    - Conectados todos os callbacks de navegação (`onBack`, `onNavigateToHome`, `onGoHome`) para `setCurrentScreen('home')`.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) verificada com sucesso.

---

### [2026-09-02] — Correção Crítica do Focus Mode: Data Abreviada (DD/MM às HH:MM) na Lista de Vagas do Salão
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]` / `[Clean Code]`
- **Motivo:** O usuário indicou corretamente que o elemento selecionado no Focus Mode (`div:nth-of-type(5) > ... > span:nth-of-type(1)`) não havia sido atualizado na resposta anterior. O seletor correspondia à tag de horário da vaga na aba "Vagas Imediatas" do Perfil do Salão (`SalonProfileView.tsx`), que exibia o prefixo `Vaga às Hoje • 14:30`.
- **Arquivos Impactados:**
  - `src/utils/dateFormatter.ts`:
    - Criado helper utilitário centralizado `formatSlotDateTime()` para converter com precisão qualquer formato (`Hoje • 14:30`, `Amanhã • 10:00`, `15:00`) para a síntese mobile padrão `DD/MM às HH:MM` (ex: `02/09 às 14:30`).
  - `src/components/SalonProfileView.tsx`:
    - Substituído o badge `<span ...>Vaga às {offer.timeSlot}</span>` por `<span ...>{formatSlotDateTime(offer.timeSlot)}</span>`.
  - `src/components/RadarStoryModal.tsx`, `src/components/OfferListScreen.tsx`, `src/components/MapScreen.tsx`:
    - Padronizados os displays de horários para a mesma síntese compacta `DD/MM às HH:MM`.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Formatação de Data Abreviada DD/MM às HH:MM (Focus Mode)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]` / `[Focus Mode]`
- **Motivo:** Solicitação do usuário via Focus Mode para substituir exibições longas de data pelo padrão abreviado móvel `DD/MM às HH:MM` (ex: `02/09 às 14:00`).
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Adotado o padrão `shortDateFormatted` no formato `DD/MM` (`selDay/selMonth`).
    - Banner da Fase 2 atualizado para exibir `DD/MM` (ou `DD/MM às HH:MM` quando o horário for selecionado), eliminando texto por extenso redundante entre parênteses.
    - Resumo da Fase 3 padronizado para `DD/MM às HH:MM`.
    - Repassado o formato limpo no callback `onConfirmAppointment`.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Eliminação de Poluição de Serviços e Unificação do Card de Confirmação no Modal
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]` / `[Focus Mode]`
- **Motivo:** O usuário apontou com precisão a poluição de informação e inconsistência lógica no modal: quando o agendamento é acessado por meio de uma oferta ou serviço publicado, o modal não deve conter opções de troca de serviço (`<select>`) nem descrições redundantes.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`:
    - Eliminado o `<select>` de troca de serviços e o card duplicado da Fase 3.
    - Substituídos os dois cards volumosos por um único card de resumo claro, objetivo e elegante com serviço, estabelecimento, profissional, data, horário e valor a pagar.
    - Adicionado um banner compacto de 1 linha no topo do modal com o serviço publicado contratado (`title`, `salonName`, `duration`, `price`), dando clareza em todas as etapas sem redundância.
    - Simplificado os títulos do cabeçalho ("Data", "Profissional & Horário", "Confirmação") e stepper ("1. Data", "2. Horário", "3. Confirmar").
    - Removido import não utilizado `MapPin` (Clean Code).
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Remoção de Textos Introdutórios e Tutoriais no Calendário (Focus Mode)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]` / `[Focus Mode]`
- **Motivo:** Remoção solicitada dos elementos de texto selecionados via Focus Mode ("Agenda Mensal" e parágrafo tutorial "Clique em um dia disponível no calendário para continuar:"), além do subtítulo redundante "Selecione a data desejada" no seletor do mês, ampliando o foco visual e o espaço para a grade de dias.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Removido o bloco textual inicial da Fase 1 e o subtítulo redundante do cabeçalho do mês, iniciando o modal diretamente nos controles de navegação e grade de datas.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Diretriz Mestra de Síntese Mobile & Compactação Visual da Fase 2
- **Tipo:** `[UI]` / `[UX]` / `[Docs]` / `[Focus Mode]`
- **Motivo:** Solicitação do usuário para resumir drasticamente informações e textos longos no modal e instituir nos arquivos de instrução (`AGENTS.md` e `GEMINI.md`) a regra mestra inegociável de foco mobile: menos texto, máxima síntese textual, priorizando ícones e botões objetivos sem poluição ou explicações redundantes.
- **Arquivos Impactados:**
  - `AGENTS.md`: Adicionada a regra inegociável "📱 Síntese Mobile & Menos Texto (Regra Inegociável de UX)".
  - `GEMINI.md`: Adicionada a Regra de Ouro nº 7 ("📱 Síntese Mobile & Menos Texto").
  - `src/components/SalonBookingModal.tsx`: Resumido o banner de data da Fase 2 (ícone de calendário + `02/09/26 (qua., 2 de set.)` + botão `Alterar`), removido texto longo "1. Escolha o Profissional: / Atualiza os horários" para apenas "Profissional", enxugado o card "Qualquer", e simplificado o cabeçalho de horários para apenas "Horários".
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Remoção da Informação Redundante de Data no Calendário (Focus Mode)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** Atendimento à seleção de elementos via Focus Mode ("remover") para eliminar os spans com o texto redundante de data selecionada ("Selecionado: DD/MM/AA") abaixo do calendário, unificando a ação em um botão de avanço limpo de largura total e removendo variáveis e containers obsoletos.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Removidos os spans selecionados e o container redundante, substituídos por um botão de avanço direto de largura total, e removida a constante `shortDateFormatted`.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Eliminação de Redundância e Formato Resumido da Data Selecionada ("Selecionado" "DD/MM/AA")
- **Tipo:** `[UI]` / `[UX]` / `[Focus Mode]`
- **Motivo:** Atendimento à solicitação de remoção da redundância do botão de avançar e simplificação do texto do dia selecionado para o formato compacto `"Selecionado"` `"02/09/26"`.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Formatado o dia selecionado para o formato estrito `DD/MM/AA` (`shortDateFormatted`), simplificado o texto para `"Selecionado: DD/MM/AA"` com botão compacto de avançar no card, e removido o botão duplicado de rodapé durante a Fase 1 (calendário).
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Otimização Ultra-Compacta dos Cards e Grade de Horários na Fase 2
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** Redução drástica de paddings, margens e dimensões dos cards de profissionais e botões de horários na Fase 2 da agenda, garantindo que a tabela de horários encaixe 100% dentro da tela do modal sem cortes.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Ajustado o container para `p-3`, banner de data enxuto (`p-2 py-1`), cards de profissionais compactos (`min-w-[125px]`, `w-6 h-6` avatar) e grade de horários configurada em 4 colunas horizontais de ~24px de altura.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Exibição de Profissionais em Carrossel Horizontal na Fase 2 do Agendamento
- **Tipo:** `[UX]` / `[UI]` / `[Refactor]`
- **Motivo:** Otimização do espaço vertical na Fase 2 da agenda: os profissionais agora aparecem em uma linha de carrossel deslizante (`overflow-x-auto`), liberando espaço na tela para que a tabela de horários livres seja exibida com máxima visibilidade e destaque logo abaixo.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Substituída a grade vertical de profissionais por uma linha de carrossel horizontal estilizada com cards compactos.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Remoção do Botão "WhatsApp Direto" no Perfil do Salão (Focus Mode)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** Atendimento à seleção de elemento via Focus Mode ("remover") para eliminar o botão de WhatsApp no perfil do salão, ajustando o botão de ação rápida "Como Chegar" para largura total (`w-full`) e limpando os imports não utilizados.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o botão `<a href="https://wa.me/...">WhatsApp Direto</a>`, mantendo o botão *"Como Chegar"* expandido, e limpo o import do ícone `MessageSquare`.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Reestruturação da Agenda em Fases Claras (Calendário -> Profissionais + Horários -> Confirmação)
- **Tipo:** `[Refactor]` / `[UX]` / `[Clean Code]`
- **Motivo:** Atendimento à solicitação de reestruturação do fluxo da agenda em fases distintas:
  - **Fase 1**: Somente a agenda mensal com os dias do calendário.
  - **Fase 2**: Seleção de profissionais com a tabela de horários logo abaixo, que atualiza dinamicamente conforme a seleção do profissional.
  - **Fase 3**: Confirmação final do agendamento e detalhes do serviço.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Reestruturado o estado de etapas para `date` (Fase 1) -> `professionals_and_time` (Fase 2) -> `confirmation` (Fase 3) com reatividade dinâmica da grade de horários ao profissional escolhido.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Ajuste de Espaçamento Vertical na Barra de Categorias e Filtros
- **Tipo:** `[UI]` / `[Clean Code]`
- **Motivo:** Aplicação do ajuste de estilo via Focus Mode para adicionar `padding-top: 10px` e `padding-bottom: 10px` (`py-2.5`) no container de chips de categorias e filtro do cabeçalho superior.
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Atualizado a classe CSS da barra de categorias de `px-4 pb-2.5` para `px-4 py-2.5` (`10px` superior e inferior).
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Ajuste de Alinhamento e Proporção do Avatar e Botões do Cabeçalho
- **Tipo:** `[Fix]` / `[UI]` / `[Clean Code]`
- **Motivo:** Correção do desalinhamento e proporção do botão de avatar do perfil no cabeçalho superior (o container e a imagem interna possuíam dimensões assimétricas de 32px x 32px e 28px x 28px sem centralização flex), e ajuste na barra de Stories (`RadarStoryBar`) para alinhamento uniforme pelo topo (`items-start`).
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Padronizado a dimensão do botão de avatar para 36px x 36px (`w-9 h-9`) igual ao botão de busca, com a imagem ajustada para preenchimento total e centralizado (`w-full h-full object-cover`).
  - `src/components/RadarStoryBar.tsx`: Ajustado o container da barra de stories para `items-start` e alinhado a margem do rótulo *"Geral"*.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Ajuste Fino do Agendamento: Calendário Mensal com Profissionais em Exibição Direta
- **Tipo:** `[Refactor]` / `[UX]` / `[Clean Code]`
- **Motivo:** Ajuste no modal de agendamento para responder com precisão à experiência solicitada: na **1ª Etapa**, ao selecionar o dia no Calendário Mensal, a lista de profissionais (com o card *"Qualquer Profissional"*) aparece em destaque logo abaixo da grade para visualização imediata. Ao clicar no card do profissional, o modal avança diretamente para a **2ª Etapa (Horários Disponíveis)**, e a seleção do horário leva à **3ª Etapa (Confirmação e Detalhes do Serviço)**.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Unificado a seleção de data e profissional em uma única etapa inicial integrada, adicionado hook de reset automático dos estados ao reabrir o modal, e estruturado em 3 etapas intuitivas (`date & pros` -> `time` -> `confirmation`).
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Remoção do Botão Superior "Agendar Horário na Agenda" no Perfil do Salão
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** Remoção do botão redundante de agendamento no topo do perfil do salão conforme seleção no modo Focus do usuário, mantendo os atalhos limpos de *"WhatsApp Direto"* e *"Como Chegar"* e os agendamentos concentrados no cardápio de serviços e avisos.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o botão de agendamento do bloco de ações rápidas no topo do perfil do salão.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação (`npm run build`) 100% verificada.

---

### [2026-09-02] — Reestruturação do Agendamento em Etapas (Calendário Mensal -> Profissional -> Horário -> Serviço na Confirmação)
- **Tipo:** `[Refactor]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou a evolução do fluxo de agendamento em etapas guiadas: 1ª etapa com Calendário Mensal em grade, 2ª etapa com seleção de profissionais (incluindo a opção *"Qualquer um"*), 3ª etapa com horários disponíveis e 4ª etapa final com a confirmação e exibição dos detalhes do serviço. Além disso, todas as menções textuais a *"60 dias"* foram ocultadas/removidas.
- **Arquivos Impactados:**
  - `src/components/SalonBookingModal.tsx`: Reformulado o modal para um Stepper/Wizard de 4 etapas (`date` -> `professional` -> `time` -> `confirmation`), com suporte a navegação por mês no calendário mensal em grade, transições fluidas e apresentação dos detalhes do serviço na tela final de confirmação.
  - `src/components/SalonProfileView.tsx`: Ocultadas todas as referências do texto *"com 60 dias"* dos botões e banners.
- **Resumo Técnico:** Linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Implementação do Sistema de Agendamento da Agenda do Salão (Até 60 Dias)
- **Tipo:** `[Feat]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou um fluxo completo de agendamento na seção de serviços do salão/profissional: ao clicar em "Agendar", o cliente é direcionado à agenda do estabelecimento, onde escolhe a data (com restrição máxima de até 2 meses / 60 dias) e, sucessivamente, um horário disponível.
- **Arquivos Criados & Modificados:**
  - `src/components/SalonBookingModal.tsx`: Criado o modal/componente de agendamento interativo com seleção de serviço, escolha de profissional (ou *"Qualquer um"* para maior flexibilidade de horários), carrossel de datas limitado a 60 dias a partir de hoje (com bloqueio de domingos/dias fechados e indicador do dia atual), grade de horários disponíveis divididos por turnos (Manhã, Tarde, Noite), resumo de reserva e confirmação.
  - `src/components/SalonProfileView.tsx`: Integração do `SalonBookingModal`, botão rápido *"📅 Agendar Horário na Agenda (Até 60 dias)"*, gatilhos em cada item do cardápio de serviços e no estado de vagas esgotadas para direcionar diretamente à agenda.
- **Resumo Técnico:** Clean code total sem imports mortos ou variáveis zumbis, tipagem estrita com TypeScript, linter (`tsc --noEmit`) 0 erros e compilação de produção (`npm run build`) 100% verificada.

---

### [2026-09-02] — Redução Adicional da Altura do Cabeçalho do Perfil do Salão
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou diminuir ainda mais a altura do cabeçalho da capa do salão/profissional para torná-lo ultracompacto e priorizar o conteúdo e serviços na tela.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Altura da capa reduzida para `h-24 sm:h-28` com botões e espaçamentos otimizados.
- **Resumo Técnico:** Linter 0 erros, compilação de produção verificada.

---

### [2026-09-02] — Ajuste no Cabeçalho do Perfil do Salão (Remoção do Badge de Vagas e Redução de Altura)
- **Tipo:** `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou no print do perfil do salão/profissional a remoção do badge flutuante "2 vagas abertas agora" do cabeçalho da capa (pois essa informação pertence à lista/cardápio de serviços) e a redução da altura do cabeçalho da capa, que estava muito alto.
- **Arquivos Impactados:**
  - `src/components/SalonProfileView.tsx`: Removido o badge "vagas abertas agora" da foto de capa e reduzida a altura do cabeçalho de `h-56/h-64` para `h-36/h-40`, tornando o topo compacto e dando visibilidade imediata às informações e serviços.
- **Resumo Técnico:** Clean code sem sobras, linter (`tsc --noEmit`) 0 erros e build de produção validado.

---

### [2026-09-02] — Restauração Integral do App ao Estado Original
- **Tipo:** `[Rollback]` / `[UI]` / `[Clean Code]`
- **Motivo:** Restauração total de todos os elementos e componentes originais do app (Barra de Stories no cabeçalho `RadarStoryBar`, badges informativos dos cards, perfil de salão completo `SalonProfileView` e feed de vagas).
- **Arquivos Impactados:**
  - `src/components/HomeScreen.tsx`: Barra de stories superior preservada e integrada.
  - `src/components/RadarOfferCard.tsx`: Todos os dados e overlays originais mantidos intactos.
- **Resumo Técnico:** Estado original 100% restaurado, linter (`tsc --noEmit`) 0 erros e build de produção validado.

---

### [2026-09-02] — Implementação e Ativação da Página/Seção do Estabelecimento/Profissional (SalonProfileView)
- **Tipo:** `[Feat]` / `[UI]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou que ao clicar no avatar do salão/profissional na barra de stories ou no card do feed, abra-se a página/seção dedicada do estabelecimento ocupando toda a seção principal do aplicativo, mantendo o cabeçalho superior unificado e incluindo um cabeçalho próprio com foto de capa, dados de contato, vagas imediatas, cardápio de serviços, equipe e avaliações.
- **Arquivos Criados & Modificados:**
  - `src/components/SalonProfileView.tsx`: Criado o componente de perfil completo com Hero Header próprio (capa, avatar, status de vagas abertas ao vivo, botão *"← Voltar ao Feed"*, nota, distância, endereço, WhatsApp Direto, Como Chegar/GPS) e abas navegáveis (`⚡ Vagas Hoje`, `✂️ Todos os Serviços`, `🏢 Sobre & Equipe`, `⭐ Avaliações`).
  - `src/components/RadarStoryBar.tsx`: Conexão do clique no avatar do salão com `onOpenSalonProfile`.
  - `src/components/RadarOfferCard.tsx`: Conexão do mini-avatar e nome do salão com `onOpenSalonProfile`.
  - `src/components/HomeScreen.tsx`: Controle de estado `viewingSalonProfile` renderizando a `SalonProfileView` na área principal e ocultando a barra de filtros para permitir imersão total no perfil do salão, com transição limpa de volta para o feed.
- **Resumo Técnico:** Clean code total, sem warnings de linter (`tsc --noEmit`), compilação Vite de produção 100% verificada.

---

### [2026-09-02] — Filtro de Vagas Direto pelo Card do Feed
- **Tipo:** `[Feat]` / `[UX]` / `[Clean Code]`
- **Motivo:** O usuário solicitou que ao clicar no nome/identificação do estabelecimento dentro do próprio card do feed (`RadarOfferCard`), o feed filtre dinamicamente exibindo exclusivamente as vagas daquele salão/profissional.
- **Arquivos Impactados:**
  - `src/components/RadarOfferCard.tsx`: Adicionada ação interativa no nome do salão (`onFilterBySalon`) para filtrar com 1 clique direto do feed.
  - `src/components/HomeScreen.tsx`: Conexão do callback `onFilterBySalon` com o estado reativo `setSelectedSalonFilter`.
- **Resumo Técnico:** Clean code total, TypeScript estrito sem erros e compilação de produção 100% validada.

---

### [2026-09-02] — Filtro Dinâmico do Feed por Salão ao Clicar no Ícone do Story
- **Tipo:** `[Feat]` / `[UX]` / `[Clean Code]`
- **Motivo:** Ajuste no comportamento da barra de stories para que, ao clicar no ícone de um estabelecimento/profissional, o feed filtre exclusivamente as vagas daquele salão, sem misturar itens de outros estabelecimentos.
- **Arquivos Impactados:**
  - `src/components/RadarStoryBar.tsx`: Agrupamento único de ofertas por salão, exibição de badge de vagas por estabelecimento (`Xv`), destaque ativo em verde `#20C933` com opacidade suave nos demais, e botão "Geral/Todos" para reset.
  - `src/components/HomeScreen.tsx`: Controle de estado `selectedSalonFilter`, filtro no feed `filteredAndSortedOffers`, fita indicadora *"Filtrando vagas de: [Nome]"* com botão *"Ver todos"*.
- **Resumo Técnico:** Clean code total, tipagem estrita no TypeScript e build de produção 100% validado.

---

### [2026-09-02] — Correção de Atualização de Estado Concorrente no RadarStoryModal
- **Tipo:** `[Fix]` / `[React 19]` / `[Clean Code]`
- **Motivo:** O React emitia warning/erro de `Cannot update a component (HomeScreen) while rendering a different component (RadarStoryModal)` devido ao fechamento ou atualização de estado síncrono acionado dentro do loop de progresso/renderização do story.
- **Arquivos Impactados:**
  - `src/components/RadarStoryModal.tsx` (Encapsulamento seguro do callback `onClose` fora do ciclo de renderização e estabilização do sincronismo de `initialIndex` e `progress`).
- **Resumo Técnico:** Eliminação de warnings no console, linter e build 100% aprovados.

### [2026-09-04] — Limpeza Pós-Obra (Clean Code) e Remoção de Componentes Obsoletos
- **Tipo:** `[Clean Code]` / `[Pós-Obra]`
- **Motivo:** Execução do protocolo rigoroso de "Limpeza Pós-Obra" previsto no `AGENTS.md` para eliminar arquivos que perderam utilidade após a simplificação e reestruturação do aplicativo, reduzindo assim o peso da base de código.
- **Arquivos Impactados:**
  - Removidos: `SearchScreen.tsx`, `CountdownTimer.tsx`, `DriveExplorer.tsx`, `FigmaShortcutsDrawer.tsx`, `FileViewerModal.tsx`, `StructureAnalyzerModal.tsx` e `RadarStoryBar.tsx` (códigos mortos e não mais utilizados).
  - Limpeza de imports não utilizados nas telas de `HomeScreen.tsx`.
- **Resumo Técnico:** A base de código está validada e super limpa (0 erros).
