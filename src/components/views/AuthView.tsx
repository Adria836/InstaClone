import React, { useState } from 'react';
import { InstagramLogo } from '../common/InstagramLogo';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { login, signup } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (isSignUp) {
      if (!emailOrUser || !username || !fullName || !password) {
        setErrorMsg('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }
      const res = await signup(emailOrUser, username, fullName, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Erro ao criar conta.');
      } else {
        if (onSuccess) onSuccess();
      }
    } else {
      if (!emailOrUser || !password) {
        setErrorMsg('Informe seu email/usuário e senha.');
        setIsSubmitting(false);
        return;
      }
      const res = await login(emailOrUser, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Erro ao realizar login.');
      } else {
        if (onSuccess) onSuccess();
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col justify-between py-8 px-4 selection:bg-pink-100 selection:text-pink-600">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-10 max-w-4xl w-full">
          {/* Phone Graphic on Desktop */}
          <div className="hidden lg:block relative w-[380px] h-[580px] flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[48px] p-2.5 shadow-2xl">
              <div className="w-full h-full bg-black rounded-[42px] overflow-hidden p-2 flex flex-col justify-between">
                {/* iPhone Notch */}
                <div className="w-24 h-4 bg-neutral-900 mx-auto rounded-full mt-1" />

                {/* Screenshot mock */}
                <div className="flex-1 my-2 rounded-2xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80"
                    alt="Instagram Feed Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="font-logo text-3xl mb-1 text-white">Instagram</div>
                    <p className="text-xs text-white/90 leading-relaxed font-normal">
                      Veja fotos, reels e histórias de amigos e criadores que você mais ama.
                    </p>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-28 h-1 bg-neutral-700 mx-auto rounded-full mb-1" />
              </div>
            </div>
          </div>

          {/* Right Column: Auth Cards */}
          <div className="w-full max-w-[350px] space-y-3">
            {/* Main Card */}
            <div className="bg-white dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] rounded-xl px-10 py-9 text-center shadow-sm">
              {/* Instagram Logo */}
              <div className="mb-8 flex justify-center cursor-pointer">
                <InstagramLogo size="lg" />
              </div>

              {isSignUp && (
                <p className="text-sm font-semibold text-[#737373] mb-5 leading-snug">
                  Cadastre-se para ver fotos e vídeos dos seus amigos.
                </p>
              )}

              {errorMsg && (
                <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs text-center border border-rose-200 dark:border-rose-800 animate-fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder={isSignUp ? "E-mail ou celular" : "Telefone, nome de usuário ou email"}
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dbdbdb] dark:border-[#363636] rounded-md focus:outline-none focus:border-[#737373] text-xs placeholder:text-[#737373]"
                  required
                />

                {isSignUp && (
                  <>
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-2.5 py-2.5 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dbdbdb] dark:border-[#363636] rounded-md focus:outline-none focus:border-[#737373] text-xs placeholder:text-[#737373]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nome de usuário (@)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-2.5 py-2.5 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dbdbdb] dark:border-[#363636] rounded-md focus:outline-none focus:border-[#737373] text-xs placeholder:text-[#737373]"
                      required
                    />
                  </>
                )}

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dbdbdb] dark:border-[#363636] rounded-md focus:outline-none focus:border-[#737373] text-xs placeholder:text-[#737373]"
                    required
                  />
                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-60 text-white font-semibold rounded-lg shadow-sm transition-colors mt-2 text-xs"
                >
                  {isSubmitting ? 'Aguarde...' : isSignUp ? 'Cadastre-se' : 'Entrar'}
                </button>

                {!isSignUp && (
                  <div className="pt-3">
                    <a href="#" className="text-[11px] text-[#00376b] dark:text-neutral-400 hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                )}
              </form>
            </div>

            {/* Switch between Login and Signup Card */}
            <div className="bg-white dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] rounded-xl py-5 text-center text-xs">
              {isSignUp ? (
                <p>
                  Tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMsg('');
                    }}
                    className="font-semibold text-[#0095f6] hover:underline"
                  >
                    Conecte-se
                  </button>
                </p>
              ) : (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMsg('');
                    }}
                    className="font-semibold text-[#0095f6] hover:underline"
                  >
                    Cadastre-se
                  </button>
                </p>
              )}
            </div>

            {/* App download badges */}
            <div className="text-center pt-2 space-y-3">
              <span className="text-xs text-[#737373]">Obtenha o aplicativo.</span>
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 px-3 bg-black text-white rounded-lg flex items-center gap-2 border border-neutral-700 cursor-pointer hover:opacity-80">
                  <span className="text-[9px] uppercase leading-tight text-left">
                    Disponível no<br /><strong className="text-xs">Google Play</strong>
                  </span>
                </div>
                <div className="h-10 px-3 bg-black text-white rounded-lg flex items-center gap-2 border border-neutral-700 cursor-pointer hover:opacity-80">
                  <span className="text-[9px] uppercase leading-tight text-left">
                    Baixar da<br /><strong className="text-xs">Microsoft</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Meta Links */}
      <footer className="max-w-4xl mx-auto w-full pt-8 text-[11px] text-[#737373] text-center space-y-3">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a href="#" className="hover:underline">Meta</a>
          <a href="#" className="hover:underline">Sobre</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Carreiras</a>
          <a href="#" className="hover:underline">Ajuda</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Privacidade</a>
          <a href="#" className="hover:underline">Termos</a>
          <a href="#" className="hover:underline">Localizações</a>
          <a href="#" className="hover:underline">Instagram Lite</a>
          <a href="#" className="hover:underline">Meta Verified</a>
        </div>
        <p className="text-[11px]">
          © 2026 INSTAGRAM FROM META
        </p>
      </footer>
    </div>
  );
};
