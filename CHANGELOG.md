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
