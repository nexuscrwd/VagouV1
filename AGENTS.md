# 📜 Diretrizes Mestras da IA & Protocolo de Engenharia — Vagou

> **ATENÇÃO IA / AGENTE:** Este documento contém as regras inegociáveis de comportamento, governança e desenvolvimento do aplicativo **Vagou**. Você **DEVE** seguir este protocolo em **todas** as interações.

---

## 🛑 1. O Protocolo dos 6 Mandamentos

### 1. Leitura Prévia Obrigatória da Documentação (`.md`)
- Antes de qualquer modificação de código ou tomada de decisão arquitetural, consulte:
  - `ARCHITECTURE.md`: Arquitetura, tecnologias, camadas de dados e design system.
  - `KNOWLEDGE_BASE.md`: Soluções validadas, padrões de layout, z-index e boas práticas.
  - `CHANGELOG.md`: Histórico de alterações e rastreabilidade.
- **Nunca suponha** a estrutura de arquivos ou implemente lógicas sem validar os padrões já consolidados.

### 2. Análise de Viabilidade, Reestruturação & Confirmação de Escopo
- **Sempre analise o pedido do usuário antes de codificar:**
  - Se a mensagem contiver erros de digitação, ambiguidades ou requisições complexas, reestruture o pedido de forma clara e profissional.
  - Avalie a viabilidade técnica e impacto no sistema.
  - **Sugerir melhorias proativamente** caso identifique inconsistências, contradições lógicas, gargalos de performance ou quebras de UI/UX.
  - Peça a confirmação do usuário quando o escopo demandar decisão técnica.
- **Teto Absoluto de Escopo:** **JAMAIS** implemente nada além do que foi estritamente acordado com o usuário. Não crie telas, abas, servidores ou dependências não solicitadas.

### 3. Previsão de Impacto e Configurações Prévias
- Antes de alterar ou criar arquivos, mapeie:
  - Quais arquivos serão impactados.
  - Se há novas dependências (`npm packages`) ou variáveis de ambiente necessárias (`.env.example`).
  - Possíveis quebras de layout responsivo ou conflitos de `z-index`.

### 4. Validação, Teste de Contraprova e Compilação
- Após codificar, execute **obrigatoriamente**:
  1. `lint_applet` para checar tipagem TypeScript e sintaxe.
  2. `compile_applet` para garantir que o build de produção (`npm run build`) passe sem erros.
  3. Validação lógica e visual (verifique se todos os estados, cliques e transições estão íntegros).

### 5. 🧹 Protocolo de "Limpeza Pós-Obra" (Clean Code & Zero Poluição)
- **Fez a obra, limpe a casa!** É terminantemente proibido deixar sujeira no código:
  - ❌ **Sem imports não utilizados**: Remova qualquer ícone, tipo ou função importada sem uso.
  - ❌ **Sem variáveis/estados zumbis**: Não deixe `useState`, constantes ou parâmetros declarados e esquecidos.
  - ❌ **Sem CSS/Tailwind poluído**: Não acumule classes conflitantes ou regras obsoletas.
  - ❌ **Sem console.logs temporários**: Remova logs de debug antes da entrega.
  - ❌ **Sem comentários comentando código morto**: Remova blocos comentados descartados.

### 6. Rastreabilidade & Registro no `CHANGELOG.md`
- Toda modificação relevante deve ser registrada no arquivo `CHANGELOG.md` contendo:
  - Data e hora da alteração.
  - Motivo da mudança.
  - Arquivos e componentes afetados.
  - Resumo das mudanças para permitir rollback imediato se necessário.

---

## 🎨 2. Padrões de Design & UI/UX do Vagou

- **Tema & Atmosfera:** Dark Theme sofisticado baseado em `slate-950` (fundo principal), `slate-900` (cards/contêineres), `slate-800` (bordas/divisores) e destaques em **Emerald** (`emerald-500` / `emerald-400`).
- **Hierarquia de Camadas (`z-index`):**
  - `z-40`: Cabeçalho superior unificado fixo (`sticky top-0`) contendo logo, busca e barra de categorias.
  - `z-30`: Barra de navegação inferior (`BottomNav`) fixa no rodapé.
  - `z-20`: Modais e visualizadores de stories em tela cheia (`RadarStoryModal`, `FileViewerModal`).
  - `z-10`: Elementos interativos dentro do card (botão de áudio, carrossel de fotos).
  - `z-0`: Cards do feed (`RadarOfferCard`) e conteúdo rolante — rolam **por trás** do cabeçalho.
- **Anti-Slop Visual:**
  - Sem gradientes roxo-azul genéricos.
  - Indicadores de status estáticos e elegantes (sem animações exageradas ou `animate-ping` contínuo).
  - Textos de botões e chips em uma única linha (`whitespace-nowrap`).
- **📱 Síntese Mobile & Menos Texto (Regra Inegociável de UX):**
  - **Menos texto, máxima síntese:** O aplicativo é desenhado para uso ágil em celulares. Textos longos, parágrafos explicativos ou redundâncias atrapalham a navegação rápida.
  - **Mais ícones e botões objetivos:** Priorize ícones autoexplicativos (`lucide-react`), datas/horários compactos (ex: `02/09/26`) e ações diretas com o menor número de palavras possível.
  - **Zero "Blablabla" e poluição:** É proibido incluir instruções redundantes ou tutoriais óbvios dentro de cards e modais (ex: "Atualiza os horários abaixo", subtítulos redundantes). O design deve ser limpo, visual e ultra-resumido.

---

## 🗺️ 3. Regras de GIS, Mapas & Negócio

- **Geolocalização:** Cálculo de proximidade em metros/km com base na coordenada do usuário e do salão.
- **Urgência do Radar:** Vagas imediatas têm contagem regressiva (`expiresInMinutes`), selo de status e priorização no feed.
- **Stories do Radar:** Apresentação em vídeo vertical (Nível 3), carrossel de fotos (Nível 2) ou fallback temático estilizado (Nível 1).
