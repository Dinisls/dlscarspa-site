import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  const [toast, setToast]         = useState({ message: '', visible: false });
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  // Após login com sucesso, redirecionar para a página pendente
  useEffect(() => {
    if (user && pendingUrl) {
      navigate(pendingUrl);
      setPendingUrl(null);
      setShowLogin(false);
    }
  }, [user, pendingUrl, navigate]);

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3500);
  };

  // Abre o modal de login; após login redireciona para redirectTo
  const openLogin = (redirectTo = null) => {
    setPendingUrl(redirectTo);
    setShowLogin(true);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, openLogin }}>
      {children}
      <AuthModal
        isOpen={showLogin}
        onClose={() => { setShowLogin(false); setPendingUrl(null); }}
        showToast={showToast}
      />
      <Toast message={toast.message} visible={toast.visible} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
