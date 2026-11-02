# 📸 Instagram Clone — Vite + React + Supabase

Clone fiel do Instagram desenvolvido com **Vite**, **React 19**, **TypeScript**, **Tailwind CSS** e **Supabase**.

---

## ✨ Funcionalidades Principais

- **Feed Autêntico**:
  - Exibição de publicações com foto única ou carrossel.
  - **Double-Tap to Like**: Clique duplo na foto exibe a animação do coração saltando e curte a foto instantaneamente!
  - Barra de ações: Curtir, Comentar, Compartilhar e Salvar (Bookmark).
  - Contador de curtidas em formato oficial.
  - Legendas expansíveis ("... mais") e tags de localização.
  - Comentários inline com seletor de emojis e botão dinâmico de publicar.
  - Modal de 3 pontinhos com opções da publicação (excluir, denunciar, copiar link).

- **Stories**:
  - Barra horizontal deslizante com anel de gradiente oficial do Instagram (`#f09433` -> `#bc1888`).
  - Badge `(+)` para adicionar stories ao perfil atual.
  - **Story Viewer em tela cheia**: Barras de progresso com timer automático de 5 segundos, navegação por toque nas metades esquerda/direita, pausa, respostas rápidas e reações de coração com confete.

- **Criar Publicação ("Criar nova publicação")**:
  - Modal em etapas idêntico ao Instagram desktop.
  - Seleção por arquivo do computador, URL personalizada ou fotos de exemplo.
  - **Filtros Fotográficos em tempo real**: *Normal, Clarendon, Gingham, Juno, Lark, Vintage, P&B*.
  - Inserção de legenda, contador de caracteres e marcação de localização.

- **Explorar (Explore Grid)**:
  - Mosaico de 3 colunas com itens normais e destaques verticais.
  - Efeito hover revelando contagem de curtidas e comentários.
  - Clique para abrir a visualização detalhada em 2 colunas.

- **Reels**:
  - Feed vertical full-screen com reprodutor de vídeo/áudio.
  - Ticker musical animado com título da faixa sonora.
  - Ações laterais (curtidas, comentários, compartilhamento, salvar e disco de vinil girando).

- **Mensagens Diretas (Instagram Direct)**:
  - Lista de conversas com indicador de status online e mensagens não lidas.
  - Chat em tempo real com histórico de balões estilizados (azul para enviados, cinza para recebidos).
  - Envio de textos e botão de reação rápida de coração ❤️.
  - Respostas automáticas simuladas para testar a experiência de conversa.

- **Perfil**:
  - Cabeçalho completo com foto, nome de usuário, selo de verificado, bio com quebras de linha e link clicável.
  - Contador de publicações, seguidores e seguindo.
  - Círculos de **Destaques de Stories** (*Setup, Viagens, Projetos, Café*).
  - Abas: *Publicações, Reels, Salvos e Marcados*.
  - Modal de **Editar Perfil** (alteração de foto, bio, site, nome e username).

- **Tema Claro e Escuro (Dark Mode)**:
  - Alternador completo entre o modo claro e o modo escuro oficial do Instagram.

- **Integração com Supabase Backend**:
  - Funciona imediatamente no **Modo Demo (Offline/Local)** com persistência em `localStorage`.
  - Conexão nativa com **Supabase Postgres & Auth**:
    - Script SQL completo fornecido em `supabase/schema.sql` (tabelas: `profiles`, `posts`, `likes`, `comments`, `stories`, `messages`, `saved_posts`, `follows`, mais políticas RLS).
    - Modal de status e configuração no app para colar URL e Chave Anon sem precisar reiniciar o servidor!

---

## 🚀 Como Executar

O servidor de desenvolvimento já está rodando em:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Para executar manualmente em qualquer terminal:
```bash
cd "C:\Users\Adria\.gemini\antigravity\scratch\instagram-clone"
npm run dev
```

Para gerar build de produção:
```bash
npm run build
```

---

## 🗄️ Conectando com seu Supabase (Opcional)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Acesse o **SQL Editor** do Supabase e cole o conteúdo de `supabase/schema.sql`.
3. Copie a **Project URL** e a **anon public key** do seu painel Supabase (Project Settings > API).
4. No aplicativo, clique no botão **Supabase** no menu lateral ou crie um arquivo `.env` com:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
