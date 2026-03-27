import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

function AuthModal({ isOpen, onClose, showToast }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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
      setLoading(false);
      setResetSent(false);
    }
  }, [isOpen]);

  const handleForgotPassword = async () => {
    if (!email) { showToast('⚠️ Insira o seu email primeiro'); return; }
    if (!email.includes('@') || !email.includes('.')) { showToast('⚠️ Email inválido'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      showToast(err.code === 'auth/user-not-found'
        ? '⚠️ Email não encontrado'
        : '⚠️ Erro ao enviar email. Tente novamente'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) { showToast('⚠️ Preencha email e palavra-passe'); return; }
    if (!email.includes('@') || !email.includes('.')) { showToast('⚠️ Email inválido'); return; }
    if (password.length < 6) { showToast('⚠️ A palavra-passe deve ter pelo menos 6 caracteres'); return; }
    if (!isLogin && !name) { showToast('⚠️ Preencha o seu nome'); return; }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('✅ Sessão iniciada com sucesso!');
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        showToast('✅ Conta criada com sucesso!');
      }
      onClose();
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use':    '⚠️ Este email já está registado',
        'auth/user-not-found':          '⚠️ Email não encontrado',
        'auth/wrong-password':          '⚠️ Palavra-passe incorreta',
        'auth/invalid-credential':      '⚠️ Email ou palavra-passe incorretos',
        'auth/too-many-requests':       '⚠️ Muitas tentativas. Tente mais tarde',
        'auth/network-request-failed':  '⚠️ Erro de ligação. Verifique a internet',
      };
      showToast(msgs[err.code] || '⚠️ Ocorreu um erro. Tente novamente');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    const providerObj  = googleProvider;
    const providerName = 'Google';
    setLoading(true);
    try {
      await signInWithPopup(auth, providerObj);
      showToast(`✅ Sessão iniciada com ${providerName}!`);
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast(`⚠️ Erro ao entrar com ${providerName}`);
      }
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src="/images/dlsLogo.png" alt="DLS Car Spa" className="modal-logo" />
        <h3>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</h3>
        <p className="modal-sub">
          {isLogin ? 'Aceda à sua conta para gerir marcações' : 'Crie a sua conta e comece a marcar'}
        </p>

        {/* Social buttons */}
        <div className="social-btns">
          <button className="social-btn" onClick={() => handleSocialLogin()} disabled={loading}>
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
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
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ paddingRight: '2.8rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 0,
                color: 'rgba(255,255,255,0.4)', lineHeight: 1,
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {isLogin && (
          <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
            {resetSent ? (
              <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>Email enviado! Verifique a caixa de entrada e a pasta de spam (remetente: Firebase).</span>
            ) : (
              <a
                onClick={handleForgotPassword}
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
              >
                Esqueceu a palavra-passe?
              </a>
            )}
          </div>
        )}

        <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'A processar...' : isLogin ? 'Iniciar Sessão' : 'Criar Conta'}
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
