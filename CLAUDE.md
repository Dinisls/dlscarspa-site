# CLAUDE.md — DLS Car Spa

## Sobre o Projeto
Website da **DLS Car Spa**, uma empresa de lavagem e detalhamento automóvel em Portugal.
Feito em **React 18 + Vite 6**. Sem backend por agora — frontend only.

## Stack
- **Framework:** React 18 (JSX, hooks)
- **Bundler:** Vite 6
- **CSS:** Vanilla CSS com variáveis CSS (sem Tailwind, sem CSS modules)
- **Linguagem:** JavaScript (sem TypeScript)
- **Fontes:** Google Fonts (Playfair Display + Manrope)

## Comandos
```bash
npm install          # Instalar dependências
npm run dev          # Dev server em localhost:5173
npm run build        # Build para produção (pasta dist/)
npm run preview      # Preview do build
```

## Estrutura de Ficheiros

```
dlscarspa/
├── index.html                      # HTML raiz do Vite
├── package.json                    # Dependências e scripts
├── vite.config.js                  # Configuração do Vite
│
├── public/
│   └── images/
│       ├── logo-dark.jpg           # Logo com fundo escuro (usado no Hero)
│       ├── logo-white.png          # Logo com fundo branco (Navbar, Footer, Modal)
│       └── gallery/                # [FUTURO] Fotos e vídeos das lavagens
│
└── src/
    ├── main.jsx                    # Entry point — monta <App /> no DOM
    ├── App.jsx                     # Componente raiz — gere estado global (toast, auth modal)
    │
    ├── styles/
    │   └── styles.css              # TODOS os estilos do site (único ficheiro CSS)
    │
    ├── hooks/
    │   └── useScrollReveal.js      # Hook — IntersectionObserver para animação de scroll
    │
    └── components/
        ├── Navbar.jsx              # Barra de navegação fixa + menu mobile hamburger
        ├── Hero.jsx                # Secção principal com logo grande e CTAs
        ├── Pricing.jsx             # Secção de serviços e preços (array `services`)
        ├── Gallery.jsx             # Galeria de fotos/vídeos (array `galleryItems`)
        ├── Reviews.jsx             # Avaliações de clientes (array `reviews`)
        ├── Booking.jsx             # Formulário de marcações + info da empresa
        ├── AuthModal.jsx           # Modal de login/registo (email, Google, Apple)
        ├── Footer.jsx              # Rodapé com logo e copyright
        ├── Toast.jsx               # Componente de notificação popup
        └── Reveal.jsx              # Wrapper de animação scroll (usa useScrollReveal)
```

## Cores da Marca (variáveis CSS em styles.css)
```
--navy: #111D35          Azul marinho principal
--navy-deep: #0B1425     Azul marinho escuro (fundos)
--navy-mid: #1A2B4A      Azul marinho médio (cards)
--red: #C41E2A           Vermelho da marca (botões, destaques)
--red-light: #E0323E     Vermelho claro (hover states)
--red-dark: #9B1720      Vermelho escuro (gradientes)
```

## Onde Editar o Quê

| Quero alterar...                | Ficheiro                          | O que procurar                  |
|---------------------------------|-----------------------------------|---------------------------------|
| Preços e serviços               | `src/components/Pricing.jsx`      | Array `services` no topo        |
| Avaliações de clientes          | `src/components/Reviews.jsx`      | Array `reviews` no topo         |
| Fotos/vídeos da galeria         | `src/components/Gallery.jsx`      | Array `galleryItems` no topo    |
| Morada, telefone, horário       | `src/components/Booking.jsx`      | Array `companyInfo` no topo     |
| Horários de agendamento         | `src/components/Booking.jsx`      | Array `timeSlots` no topo       |
| Cores da marca                  | `src/styles/styles.css`           | Bloco `:root { }` no topo      |
| Links da navbar                 | `src/components/Navbar.jsx`       | Links `<a href>`                |
| Texto do hero                   | `src/components/Hero.jsx`         | Tags `<h1>` e `<p>`            |
| Logos                           | `public/images/`                  | Substituir ficheiros            |
| Título e meta tags              | `index.html`                      | Tags `<title>` e `<meta>`      |

## Padrões do Código

- **Dados editáveis** estão sempre em arrays/objetos no TOPO de cada componente, com comentários em PT
- **Estado global** (toast, auth modal) está no `App.jsx` e passa por props
- **Animações de scroll** usam o componente `<Reveal>` que wrapa qualquer conteúdo
- **CSS** usa variáveis CSS (`var(--red)`) — não há classes utilitárias tipo Tailwind
- **Formulários** usam `useState` com objeto (controlled components)
- **Sem routing** — é uma single page com anchor links (`#precos`, `#marcacoes`, etc.)

## TODOs (ainda não implementado)

- [ ] **Backend para marcações** — integrar Firebase/Supabase no `Booking.jsx` (ver comentário `// TODO`)
- [ ] **Autenticação real** — integrar Google OAuth e Apple Sign-In no `AuthModal.jsx` (ver `// TODO`)
- [ ] **Fotos da galeria** — adicionar imagens em `public/images/gallery/` e atualizar array em `Gallery.jsx`
- [ ] **Dados reais** — atualizar morada, telefone e horário em `Booking.jsx`
- [ ] **Deploy** — fazer build e deploy no Vercel/GitHub Pages/Netlify

## Notas Importantes

- O site é **português de Portugal** (não brasileiro) — usar "telemóvel" e não "celular", "marcação" e não "agendamento", etc.
- Os logos têm **duas versões**: fundo escuro (hero) e fundo branco (navbar, footer, modal)
- As reviews são **fictícias** com nomes portugueses — podem ser substituídas por reviews reais
- O formulário de marcações **não envia dados** por enquanto — só mostra toast de sucesso e faz console.log
- O login/registo **não está ligado a nenhum serviço** — é apenas UI por enquanto
