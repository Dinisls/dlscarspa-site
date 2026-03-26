# DLS Car Spa — Website

Site oficial da DLS Car Spa, feito em **React + Vite**.

## Estrutura do Projeto

```
dlscarspa/
├── index.html                    ← HTML raiz (Vite)
├── package.json                  ← Dependências e scripts
├── vite.config.js                ← Configuração do Vite
├── public/
│   └── images/
│       ├── logo-dark.jpg         ← Logo (fundo escuro - cartão)
│       └── logo-white.png        ← Logo (fundo branco)
└── src/
    ├── main.jsx                  ← Entry point do React
    ├── App.jsx                   ← Componente principal
    ├── styles/
    │   └── styles.css            ← Todos os estilos
    ├── hooks/
    │   └── useScrollReveal.js    ← Hook para animação scroll
    └── components/
        ├── Navbar.jsx            ← Barra de navegação
        ├── Hero.jsx              ← Secção principal (hero)
        ├── Pricing.jsx           ← Serviços e preços
        ├── Gallery.jsx           ← Galeria de fotos/vídeos
        ├── Reviews.jsx           ← Avaliações de clientes
        ├── Booking.jsx           ← Formulário de marcações
        ├── Footer.jsx            ← Rodapé
        ├── AuthModal.jsx         ← Login / Registo
        ├── Toast.jsx             ← Notificações popup
        └── Reveal.jsx            ← Componente de animação
```

## Como Instalar e Correr

### 1. Instalar Node.js
Se ainda não tens, instala o Node.js: https://nodejs.org (versão LTS)

### 2. Instalar dependências
Abre o terminal na pasta do projeto e corre:
```bash
npm install
```

### 3. Correr em modo de desenvolvimento
```bash
npm run dev
```
Abre o browser em `http://localhost:5173`

### 4. Fazer build para produção
```bash
npm run build
```
Os ficheiros prontos ficam na pasta `dist/`

## Como Fazer Deploy (Hosting Gratuito)

### GitHub Pages
1. Cria uma conta no GitHub com o nome `dlscarspa`
2. Cria um repositório novo
3. Corre `npm run build`
4. Faz upload da pasta `dist/` para o repositório
5. Nas Settings → Pages, ativa o GitHub Pages
6. URL: `dlscarspa.github.io`

### Vercel (Mais Fácil)
1. Vai a https://vercel.com e cria conta
2. Importa o repositório do GitHub
3. O Vercel deteta automaticamente que é Vite + React
4. URL: `dlscarspa.vercel.app`

### Netlify
1. Vai a https://netlify.com
2. Arrasta a pasta `dist/` para o browser
3. URL: `dlscarspa.netlify.app`

## Como Editar

### Alterar Preços / Serviços
Edita o array `services` no ficheiro `src/components/Pricing.jsx`

### Adicionar Fotos à Galeria
1. Coloca as fotos em `public/images/gallery/`
2. Edita o array `galleryItems` em `src/components/Gallery.jsx`

### Alterar Avaliações
Edita o array `reviews` em `src/components/Reviews.jsx`

### Alterar Morada / Telefone / Horário
Edita o array `companyInfo` em `src/components/Booking.jsx`

### Alterar Cores da Marca
Edita as variáveis CSS no topo de `src/styles/styles.css`:
```css
:root {
  --navy: #111D35;
  --red: #C41E2A;
  /* etc... */
}
```

## Próximos Passos (TODO)
- [ ] Integrar backend para marcações (Firebase / Supabase)
- [ ] Integrar autenticação real (Google OAuth / Apple Sign-In)
- [ ] Adicionar fotos e vídeos à galeria
- [ ] Atualizar morada, telefone e horário reais
- [ ] Configurar domínio personalizado (ex: dlscarspa.pt)
