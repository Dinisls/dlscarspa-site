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
          Lavagens profissionais, detalhamento cerâmico e cuidado minucioso.
          Cada veículo é tratado como único.
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
