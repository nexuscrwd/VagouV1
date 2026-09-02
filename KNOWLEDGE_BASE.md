# 🧠 Base de Conhecimento & Padrões Consolidados — Vagou

Este documento reúne soluções técnicas testadas, padrões de layout e configurações que deram certo no aplicativo **Vagou**, permitindo que futuras intervenções vão direto ao ponto sem retrabalho.

---

## 🎯 1. Padrão de Camadas & Hierarquia de `z-index` (Solução Validada)

### O Problema Resolvido:
Os badges de urgência dos cards (*"VAGA AGORA"*, *"VAGA RELÂMPAGO"*) e botões de mídia estavam se sobrepondo à barra de categorias do topo durante a rolagem do feed.

### A Solução Padronizada:
1. **Cabeçalho Unificado no Topo (`HomeScreen.tsx`):**
   - Agrupar logo, atalhos, campo de busca e barra de categorias dentro de um **único contêiner `sticky top-0 z-40`**.
   - Fundo com `bg-slate-950/95` e `backdrop-blur-md` para isolar visualmente qualquer elemento que passe por baixo.
2. **Cards do Feed (`RadarOfferCard.tsx`):**
   - Contêiner raiz do card com `relative z-0`.
   - Controles internos (botão de som, setas de navegação do carrossel, badges) com `z-10`.
   - **Resultado:** O feed rola suavemente por trás de todo o bloco de categorias e busca sem conflito visual.

---

## 🎨 2. Paleta de Cores & Design System Oficial (Manual de Identidade)

- **Verde Vagou Principal:** `#20C933` (RGB: 32, 201, 51 | Destaques, botões ativos, check)
- **Verde Escuro Institucional:** `#087A2A` (RGB: 8, 122, 42 | Gradientes e sombra de marca)
- **Verde Claro Disponibilidade:** `#DFF7E3` (RGB: 223, 247, 227 | Tags suaves e fundos de badges)
- **Grafite Vagou (Fundo/Superfícies):** `#151A1E` (RGB: 21, 26, 30 | Fundo do app, containers escuros)
- **Branco:** `#FFFFFF`
- **Tipografia:** Família `Poppins` (Bold 700, Medium 500, Regular 400).
- **Slogan Oficial:** *"Vagou achou."* (Sempre com o ponto final).
- **Componentes Oficiais:**
  - `src/components/VagouLogo.tsx`: Suporta `variant="header"`, `variant="full"`, `variant="icon"`, `variant="splash"`.
  - `src/components/SplashScreen.tsx`: Splash screen com o "V" e slogan na inicialização.

---

## 📱 3. Padrões de Responsividade e Mobile-First

- A aplicação foi desenhada para visualização ideal em tela móvel (estilo app nativo PWA), centralizada com contêiner max-width quando visualizada no desktop.
- Elementos fixos inferiores (`BottomNav`, `PartnerBottomNav`) utilizam `fixed bottom-0` ou `sticky` com compensação de padding `pb-24` na tela para evitar que o conteúdo seja cortado pelo rodapé.

---

## 🧹 4. Checklist da "Limpeza Pós-Obra" (Clean Code)

Antes de finalizar qualquer tarefa, passe por este checklist mental:
- [ ] Foram removidos imports de ícones ou bibliotecas que não estão sendo usados no arquivo?
- [ ] Foram removidas variáveis ou estados intermediários de teste?
- [ ] As classes Tailwind estão limpas e sem regras duplicadas/conflitantes?
- [ ] O `npm run lint` (`tsc --noEmit`) rodou com **zero erros**?
- [ ] O `npm run build` compilou com sucesso?
- [ ] O arquivo `CHANGELOG.md` foi devidamente atualizado?
