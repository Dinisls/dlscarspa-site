function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src="/images/dlsLogo.png" alt="DLS Car Spa" />
      </div>
      <p>© {year} DLS Car Spa. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;
