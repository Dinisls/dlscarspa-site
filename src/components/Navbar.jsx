import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <img src="/images/dlsLogo.png" alt="DLS Car Spa" />
      </Link>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="#precos" onClick={handleLinkClick}>Serviços</a>
        <a href="#galeria" onClick={handleLinkClick}>Galeria</a>
        <a href="#reviews" onClick={handleLinkClick}>Avaliações</a>
        <a href="#marcacoes" onClick={handleLinkClick}>Marcações</a>
        <a
          href="#"
          className="nav-btn"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick();
            onLoginClick();
          }}
        >
          Iniciar Sessão
        </a>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}

export default Navbar;
