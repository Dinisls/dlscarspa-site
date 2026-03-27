import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

function ThemeIcon({ theme }) {
  if (theme === 'dark') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, openLogin }     = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.nav-user')) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const avatarLetter = user?.displayName?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? '?';

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>

      {/* ── Esquerda: Logo ── */}
      <Link to="/" className="nav-logo">
        <img src="/images/dlsLogo.png" alt="DLS Car Spa" />
      </Link>

      {/* ── Centro: Links ── */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="/#precos"  onClick={handleLinkClick}>Serviços</a>
        <a href="/#galeria" onClick={handleLinkClick}>Galeria</a>
        <a href="/#reviews" onClick={handleLinkClick}>Avaliações</a>
        <a href="/agendar"  onClick={handleLinkClick}>Marcações</a>
        {user?.email === 'dlsinc9922@gmail.com' && (
          <a href="/admin" onClick={handleLinkClick} style={{ color: 'var(--red)' }}>Admin</a>
        )}
      </div>

      {/* ── Direita: Perfil + Tema ── */}
      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Mudar tema">
          <ThemeIcon theme={theme} />
        </button>

        {user ? (
          <div className="nav-user">
            <button className="nav-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" />
                : <span>{avatarLetter}</span>
              }
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-name">{user.displayName || user.email}</div>
                <div className="nav-dropdown-email">{user.email}</div>
                <hr className="nav-dropdown-divider" />
                <button onClick={handleLogout}>Terminar sessão</button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="#"
            className="nav-btn"
            onClick={(e) => { e.preventDefault(); openLogin(); }}
          >
            Iniciar Sessão
          </a>
        )}
      </div>

      {/* ── Mobile: Hamburger ── */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>

    </nav>
  );
}

export default Navbar;
