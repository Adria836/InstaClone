import { User, Post, Story, Conversation, Message, NotificationItem } from '../types';

export const currentUser: User = {
  id: 'user_me',
  username: 'adrian.dev',
  fullName: 'Adrian Silva',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: '💻 Criando o futuro com código & café ☕\n🚀 Fullstack Developer & Designer\n📍 São Paulo, SP\n👇 Meus projetos e repositórios',
  website: 'https://github.com/adrian-dev',
  isVerified: true,
  followersCount: 1420,
  followingCount: 382,
  postsCount: 12,
};

export const sampleUsers: User[] = [
  {
    id: 'user_1',
    username: 'sofia_fotografia',
    fullName: 'Sofia Alencar',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Capturando a beleza efêmera do mundo 📸 | Sony Alpha Brasil',
    isVerified: true,
    followersCount: 45800,
    followingCount: 620,
    postsCount: 184,
  },
  {
    id: 'user_2',
    username: 'lucas.nomad',
    fullName: 'Lucas Mendonça',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Viajando por 35+ países com uma mochila e um laptop 🌍✈️',
    isVerified: false,
    followersCount: 12400,
    followingCount: 890,
    postsCount: 92,
  },
  {
    id: 'user_3',
    username: 'beatriz.gastronomia',
    fullName: 'Chef Bia Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Receitas descomplicadas e gastronomia brasileira afetiva 🥑🍳',
    isVerified: true,
    followersCount: 128000,
    followingCount: 410,
    postsCount: 520,
  },
  {
    id: 'user_4',
    username: 'tech_brasil',
    fullName: 'Tech Brasil News',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    bio: 'O portal diário com as maiores inovações de Inteligência Artificial e Tecnologia ⚡',
    isVerified: true,
    followersCount: 310000,
    followingCount: 112,
    postsCount: 1420,
  },
  {
    id: 'user_5',
    username: 'clara.design',
    fullName: 'Clara Meireles',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer no @meta • Minimalismo, tipografia & UI',
    isVerified: false,
    followersCount: 9400,
    followingCount: 330,
    postsCount: 77,
  }
];

export const initialStories: Story[] = [
  {
    id: 'story_me',
    userId: currentUser.id,
    user: currentUser,
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 1 HORA',
    viewed: false,
  },
  {
    id: 'story_1',
    userId: sampleUsers[0].id,
    user: sampleUsers[0],
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 2 HORAS',
    viewed: false,
  },
  {
    id: 'story_2',
    userId: sampleUsers[1].id,
    user: sampleUsers[1],
    mediaUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 4 HORAS',
    viewed: false,
  },
  {
    id: 'story_3',
    userId: sampleUsers[2].id,
    user: sampleUsers[2],
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 5 HORAS',
    viewed: false,
  },
  {
    id: 'story_4',
    userId: sampleUsers[3].id,
    user: sampleUsers[3],
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 7 HORAS',
    viewed: true,
  },
  {
    id: 'story_5',
    userId: sampleUsers[4].id,
    user: sampleUsers[4],
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
    createdAt: 'HÁ 12 HORAS',
    viewed: true,
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post_1',
    userId: sampleUsers[0].id,
    user: sampleUsers[0],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&auto=format&fit=crop&q=80',
    filter: 'filter-clarendon',
    location: 'Dolomitas, Alpes Italianos',
    caption: 'A luz mágica das primeiras horas da manhã nunca desaponta. Acordar às 4h30 valeu cada segundo para ver o reflexo das montanhas sob este lago congelado. Qual é o seu lugar dos sonhos para fotografar? ✨🏔️ #photography #nature #mountains #wanderlust',
    likesCount: 3842,
    commentsCount: 94,
    createdAt: 'HÁ 2 HORAS',
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        userId: sampleUsers[1].id,
        user: sampleUsers[1],
        content: 'Absurdo esse clique! As cores ficaram surreais 🔥',
        likesCount: 14,
        createdAt: 'HÁ 1 HORA',
        isLiked: true,
      },
      {
        id: 'c2',
        postId: 'post_1',
        userId: currentUser.id,
        user: currentUser,
        content: 'Inspiração pura! Dá vontade de pegar a câmera e viajar agora mesmo.',
        likesCount: 5,
        createdAt: 'HÁ 45 MINUTOS',
        isLiked: false,
      }
    ]
  },
  {
    id: 'post_2',
    userId: sampleUsers[1].id,
    user: sampleUsers[1],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1080&auto=format&fit=crop&q=80',
    filter: 'filter-vintage',
    location: 'Paris, França',
    caption: 'Manhã de outono caminhando pelas ruelas de Montmartre. O cheiro de café fresco e croissants saindo do forno é a melhor memória que levo daqui. ☕🥐🇫🇷 #Paris #TravelGram #NomadLife',
    likesCount: 2190,
    commentsCount: 42,
    createdAt: 'HÁ 6 HORAS',
    isLiked: true,
    isSaved: true,
    comments: [
      {
        id: 'c3',
        postId: 'post_2',
        userId: sampleUsers[2].id,
        user: sampleUsers[2],
        content: 'Experimente a padaria na Rue Lepic se ainda estiver por aí! Imperdível!',
        likesCount: 8,
        createdAt: 'HÁ 4 HORAS',
      }
    ]
  },
  {
    id: 'post_3',
    userId: sampleUsers[3].id,
    user: sampleUsers[3],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&auto=format&fit=crop&q=80',
    filter: 'filter-normal',
    location: 'São Paulo, Brasil',
    caption: 'O novo ecossistema com IA integrada está transformando a maneira como programamos e construímos produtos. Menos atrito, mais criatividade e foco na arquitetura que realmente importa. Quem aqui já adotou na rotina diária? 💻🚀 #developer #tech #coding #innovation',
    likesCount: 5410,
    commentsCount: 188,
    createdAt: 'HÁ 12 HORAS',
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: 'c4',
        postId: 'post_3',
        userId: currentUser.id,
        user: currentUser,
        content: 'Mudou 100% a produtividade no frontend e backend aqui! Muito mais agilidade.',
        likesCount: 21,
        createdAt: 'HÁ 10 HORAS',
      }
    ]
  },
  {
    id: 'post_4',
    userId: sampleUsers[2].id,
    user: sampleUsers[2],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1080&auto=format&fit=crop&q=80',
    filter: 'filter-juno',
    location: 'Napoli, Itália',
    caption: 'A autêntica Margherita com fermentação natural de 48 horas e manjericão fresco da horta. Menos ingredientes, máxima qualidade. A receita completa está nos destaques! 🍕❤️ #foodie #gastronomia #pizzanapoletana',
    likesCount: 8930,
    commentsCount: 154,
    createdAt: 'HÁ 1 DIA',
    isLiked: true,
    isSaved: false,
    comments: []
  }
];

export const exploreItems = [
  { id: 'exp_1', type: 'image', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', likes: '14.2k', comments: '230' },
  { id: 'exp_2', type: 'tall', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', likes: '29.5k', comments: '512' },
  { id: 'exp_3', type: 'image', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80', likes: '8.4k', comments: '98' },
  { id: 'exp_4', type: 'image', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80', likes: '19.1k', comments: '411' },
  { id: 'exp_5', type: 'image', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', likes: '33.8k', comments: '640' },
  { id: 'exp_6', type: 'tall', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80', likes: '45.1k', comments: '890' },
  { id: 'exp_7', type: 'image', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', likes: '5.2k', comments: '67' },
  { id: 'exp_8', type: 'image', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80', likes: '22.0k', comments: '344' },
  { id: 'exp_9', type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', likes: '11.6k', comments: '150' },
  { id: 'exp_10', type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', likes: '18.9k', comments: '210' },
  { id: 'exp_11', type: 'image', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80', likes: '9.3k', comments: '112' },
  { id: 'exp_12', type: 'tall', url: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80', likes: '31.4k', comments: '490' },
];

export const sampleReels = [
  {
    id: 'reel_1',
    user: sampleUsers[0],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42171-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&auto=format&fit=crop&q=80',
    audioTitle: 'sofia_fotografia • Áudio original',
    caption: 'Tóquio em timelapse noturno! As cores e as luzes parecem de outro planeta 🌃✨',
    likesCount: '48.2K',
    commentsCount: '1.240',
    isLiked: false,
  },
  {
    id: 'reel_2',
    user: sampleUsers[1],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80',
    audioTitle: 'Som do Mar • Sons relaxantes',
    caption: 'Quando a mente precisa de paz, o oceano tem todas as respostas 🌊🧘‍♂️',
    likesCount: '73.9K',
    commentsCount: '2.890',
    isLiked: true,
  },
  {
    id: 'reel_3',
    user: sampleUsers[3],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80',
    audioTitle: 'Tech Brasil • Coding Beat Lo-fi',
    caption: 'Dicas de atalhos no VS Code que você precisa usar hoje! Salva pra não esquecer ⌨️💻',
    likesCount: '124K',
    commentsCount: '3.410',
    isLiked: false,
  }
];

export const sampleConversations: Conversation[] = [
  {
    id: 'conv_1',
    participant: sampleUsers[0],
    lastMessage: 'Viu a foto que postei das montanhas?',
    lastMessageTime: '15m',
    unreadCount: 1,
  },
  {
    id: 'conv_2',
    participant: sampleUsers[1],
    lastMessage: 'Valeu pela indicação do app, funcionou super bem!',
    lastMessageTime: '2h',
    unreadCount: 0,
  },
  {
    id: 'conv_3',
    participant: sampleUsers[4],
    lastMessage: 'Enviei o arquivo figma para você revisar',
    lastMessageTime: '1d',
    unreadCount: 0,
  }
];

export const sampleMessages: Record<string, Message[]> = {
  conv_1: [
    { id: 'm1', senderId: sampleUsers[0].id, receiverId: currentUser.id, content: 'Oi Adrian! Tudo bem?', createdAt: '10:14' },
    { id: 'm2', senderId: currentUser.id, receiverId: sampleUsers[0].id, content: 'Fala Sofia! Tudo ótimo por aqui, e com você?', createdAt: '10:15' },
    { id: 'm3', senderId: sampleUsers[0].id, receiverId: currentUser.id, content: 'Tudo excelente! Consegui editar as fotos da viagem aos Alpes.', createdAt: '10:18' },
    { id: 'm4', senderId: sampleUsers[0].id, receiverId: currentUser.id, content: 'Viu a foto que postei das montanhas?', createdAt: '10:20', isRead: false },
  ],
  conv_2: [
    { id: 'm21', senderId: currentUser.id, receiverId: sampleUsers[1].id, content: 'E aí Lucas! Como está Paris?', createdAt: 'Ontem' },
    { id: 'm22', senderId: sampleUsers[1].id, receiverId: currentUser.id, content: 'Cidade incrível, o clima tá perfeito agora!', createdAt: 'Ontem' },
    { id: 'm23', senderId: sampleUsers[1].id, receiverId: currentUser.id, content: 'Valeu pela indicação do app, funcionou super bem!', createdAt: '08:30' },
  ],
  conv_3: [
    { id: 'm31', senderId: sampleUsers[4].id, receiverId: currentUser.id, content: 'Oi Adrian, terminei os componentes novos.', createdAt: 'Ontem' },
    { id: 'm32', senderId: sampleUsers[4].id, receiverId: currentUser.id, content: 'Enviei o arquivo figma para você revisar', createdAt: 'Ontem' },
  ]
};

export const sampleNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    fromUser: sampleUsers[0],
    post: { id: 'post_1', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80' },
    createdAt: 'HÁ 5 MIN',
  },
  {
    id: 'notif_2',
    type: 'comment',
    fromUser: sampleUsers[1],
    text: 'comentou: "Ficou sensacional esse setup! 👏"',
    post: { id: 'post_1', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80' },
    createdAt: 'HÁ 32 MIN',
  },
  {
    id: 'notif_3',
    type: 'follow',
    fromUser: sampleUsers[2],
    createdAt: 'HÁ 2 HORAS',
    isFollowing: false,
  },
  {
    id: 'notif_4',
    type: 'like',
    fromUser: sampleUsers[4],
    post: { id: 'post_1', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80' },
    createdAt: 'HÁ 1 DIA',
  }
];
