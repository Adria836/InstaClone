import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, getSupabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const { isSupabaseConnected } = useAuth();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!url.trim() || !anonKey.trim()) {
      alert('Por favor, preencha a URL e a Anon Key do seu projeto Supabase.');
      return;
    }

    saveSupabaseConfig(url.trim(), anonKey.trim());
    setTestStatus('Testando conexão...');

    try {
      const client = getSupabase();
      if (!client) throw new Error('Não foi possível inicializar o cliente Supabase.');
      
      const { error } = await client.from('profiles').select('count', { count: 'exact', head: true });
      if (error && !error.message.includes('relation "public.profiles" does not exist')) {
        throw error;
      }

      setTestStatus('Conexão realizada com sucesso! Recarregando...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setTestStatus(`Aviso: Conectado com Supabase, mas lembre-se de rodar o SQL Schema na aba ao lado! Erro: ${err.message}`);
    }
  };

  const handleResetToDemo = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestStatus('Modo Demo ativado.');
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const sqlSchemaSnippet = `-- 1. Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Publicações (Posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  filter TEXT DEFAULT 'normal',
  location TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Curtidas (Likes)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 4. Comentários (Comments)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const copySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSchemaSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#dbdbdb] dark:border-[#333]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#efefef] dark:border-[#2f2f2f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#262626] dark:text-[#f5f5f5]">
                Integração Supabase Backend
              </h3>
              <span className="text-[11px] text-[#737373]">
                Conecte seu banco de dados Postgres & Autenticação
              </span>
            </div>
          </div>

          <button onClick={onClose} className="text-[#737373] hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div className="px-6 py-3 bg-[#f8f9fa] dark:bg-[#181818] border-b border-[#efefef] dark:border-[#2f2f2f] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold text-[#262626] dark:text-[#f5f5f5]">
              Status: {isSupabaseConnected ? 'Supabase Conectado' : 'Modo Demo (Dados Locais)'}
            </span>
          </div>

          <div className="flex items-center gap-1 border border-[#dbdbdb] dark:border-[#333] rounded-lg p-0.5 bg-white dark:bg-[#262626]">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeTab === 'config' ? 'bg-[#0095f6] text-white' : 'text-[#737373]'
              }`}
            >
              Configuração
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeTab === 'schema' ? 'bg-[#0095f6] text-white' : 'text-[#737373]'
              }`}
            >
              SQL Schema
            </button>
          </div>
        </div>

        {/* Tab 1: Config */}
        {activeTab === 'config' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1.5 flex items-center justify-between">
                <span>Project URL do Supabase</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0095f6] flex items-center gap-1 font-normal hover:underline"
                >
                  Abrir Supabase <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-neutral-400" />
                <span>Anon Public API Key</span>
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            {testStatus && (
              <div className="text-xs p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {testStatus}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Salvar e Conectar</span>
              </button>

              <button
                onClick={handleResetToDemo}
                className="px-4 py-2.5 border border-[#dbdbdb] dark:border-[#363636] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold rounded-xl transition-colors"
                title="Voltar ao modo demo local"
              >
                Resetar para Demo
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Schema */}
        {activeTab === 'schema' && (
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#737373]">
                Cole este script no <b>SQL Editor</b> do seu Supabase Dashboard:
              </span>
              <button
                onClick={copySql}
                className="flex items-center gap-1 text-xs font-semibold text-[#0095f6] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <div className="bg-neutral-900 text-neutral-100 rounded-xl p-4 font-mono text-[11px] max-h-60 overflow-y-auto no-scrollbar border border-neutral-800 leading-relaxed">
              <pre>{sqlSchemaSnippet}</pre>
            </div>

            <div className="text-[11px] text-[#737373]">
              💡 <b>Nota:</b> O arquivo completo com RLS e Triggers está salvo no projeto em <code>supabase/schema.sql</code>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
