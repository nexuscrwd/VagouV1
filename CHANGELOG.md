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
