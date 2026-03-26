import { useState, useEffect } from 'react';

function AuthModal({ isOpen, onClose, showToast }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isLogin = mode === 'login';

  // Fechar com Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setMode('login');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!email || !password) {
      showToast('⚠️ Preencha email e palavra-passe');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('⚠️ Por favor insira um email válido');
      return;
    }

    if (password.length < 6) {
      showToast('⚠️ A palavra-passe deve ter pelo menos 6 caracteres');
      return;
    }

    if (!isLogin && !name) {
      showToast('⚠️ Preencha o seu nome');
      return;
    }

    // TODO: Integrar com backend (Firebase Auth, Supabase, Auth0)
    console.log(isLogin ? '🔐 Login:' : '📝 Registo:', { name, email });

    onClose();
    showToast(isLogin ? '✅ Sessão iniciada com sucesso!' : '✅ Conta criada com sucesso!');
  };

  const handleSocialLogin = (provider) => {
    const providerName = provider === 'google' ? 'Google' : 'Apple';

    // TODO: Integrar com OAuth
    // Google: https://developers.google.com/identity
    // Apple:  https://developer.apple.com/sign-in-with-apple/
    console.log('🔗 Social login:', providerName);

    onClose();
    showToast(`✅ Sessão iniciada com ${providerName}!`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src="/images/logo-white.png" alt="DLS Car Spa" className="modal-logo" />
        <h3>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</h3>
        <p className="modal-sub">
          {isLogin ? 'Aceda à sua conta para gerir marcações' : 'Crie a sua conta e comece a marcar'}
        </p>

        {/* Social buttons */}
        <div className="social-btns">
          <button className="social-btn" onClick={() => handleSocialLogin('google')}>
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>
          <button className="social-btn" onClick={() => handleSocialLogin('apple')}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continuar com Apple
          </button>
        </div>

        <div className="divider">ou</div>

        {/* Email + Password */}
        {!isLogin && (
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="O seu nome" />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.pt" />
        </div>
        <div className="form-group">
          <label>Palavra-passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button className="btn-submit" onClick={handleSubmit}>
          {isLogin ? 'Iniciar Sessão' : 'Criar Conta'}
        </button>

        <div className="modal-switch">
          {isLogin ? (
            <>Não tem conta? <a onClick={() => setMode('register')}>Criar conta</a></>
          ) : (
            <>Já tem conta? <a onClick={() => setMode('login')}>Iniciar sessão</a></>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
