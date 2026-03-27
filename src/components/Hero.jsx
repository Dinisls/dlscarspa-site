function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-accent" />
      <div className="hero-accent2" />

      <div className="hero-content">
        <img src="/images/dlsLogo.png" alt="DLS Car Spa" className="hero-logo" />
        <div className="hero-badge">✦ Tratamento Premium</div>
        <h1>
          O seu carro merece <span>o melhor tratamento.</span>
        </h1>
        <p>
          
          Lavagens Detalhadas, Cuidadosas e Minuciosas.
          Para todos os carros, de todas as idades. Marque o seu serviço online em poucos passos.
        </p>
        <div className="hero-ctas">
          <a href="#marcacoes" className="btn-primary">Marcar Agora →</a>
          <a href="#precos" className="btn-outline">Ver Preços</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
