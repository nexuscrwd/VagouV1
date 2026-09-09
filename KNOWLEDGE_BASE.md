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
- **Regra de Contraste e Temperatura Cromática (Fontes & Fundos):**
  - **Fontes sobre fundos de cores quentes:** Em superfícies quentes (âmbar, amarelo, laranja, vermelho ou rose, como `bg-amber-100`, `bg-amber-50`, `bg-rose-100`), a tipografia e ícones **devem ser de tom frio** (`text-slate-900`, `text-slate-950`). É proibido usar texto quente sobre fundo quente (ex: `text-amber-800` em `bg-amber-50`).
  - **Fontes sobre fundos de cores frias:** Em superfícies frias/escuras (`bg-slate-950`, `#151A1E`, `bg-slate-900`), destaques e alertas de urgência adotam **temperatura quente** (`text-amber-400`, `text-rose-400`, `text-orange-400`) para corte térmico e visibilidade imediata.
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

---

## ⚡ 5. Padrão Consolidado: Deploy no Cloudflare Workers (Static Assets)

### Configuração Validada do `wrangler.toml`:
```toml
name = "vagouv1"
compatibility_date = "2024-09-23"

# Cloudflare Workers com Static Assets (SPA)
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

### Regras Críticas de Compatibilidade:
1. **Zero `_redirects` em Workers:** Arquivos `_redirects` com regras do tipo `/* /index.html 200` geram erro `[code: 100324]` (infinite loop). O roteamento SPA é feito exclusivamente por `not_found_handling = "single-page-application"` no `wrangler.toml`.
2. **Sem `binding = "ASSETS"` em workers apenas de assets:** O binding é proibido em workers sem script de entrada (`main`).
3. **Gerenciamento de Lockfiles:** `bun.lock` e `package-lock.json` são ignorados no repositório (`.gitignore`) para evitar que a diferença de versão do Bun/npm trave a instalação no runner CI do Cloudflare (`bun install` dinâmico em 5s).
4. **Comandos no painel Cloudflare:**
   - **Build command:** `bun run build`
   - **Deploy command:** `npx wrangler deploy`

