import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, openLogin }   = useAuth();

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
      <Link to="/" className="nav-logo">
        <img src="/images/dlsLogo.png" alt="DLS Car Spa" />
      </Link>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="/#precos"    onClick={handleLinkClick}>Serviços</a>
        <a href="/#galeria"   onClick={handleLinkClick}>Galeria</a>
        <a href="/#reviews"   onClick={handleLinkClick}>Avaliações</a>
        <a href="/#marcacoes" onClick={handleLinkClick}>Marcações</a>

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
            onClick={(e) => { e.preventDefault(); handleLinkClick(); openLogin(); }}
          >
            Iniciar Sessão
          </a>
        )}
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}

export default Navbar;
