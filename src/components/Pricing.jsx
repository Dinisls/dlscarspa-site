import { Link } from 'react-router-dom';
import Reveal from './Reveal';

/* ─── DADOS DOS SERVIÇOS ───
   Para editar preços, nomes ou features, basta alterar este array.
*/
const services = [
  {
    id: 'completa',
    icon: '✨',
    name: 'Lavagem Completa',
    price: '25€',
    description: 'Lavagem Externa + Aspiração interna + Limpeza de Portas, Tabliers e Tapetes',
    features: [
      'Lavagem Exterior de Contacto.',
      'Lavagem de Jantes e Pneus.',
      'Aspiração Interna.',
      'Limpeza de Portas, Tabliers e Tapetes',
    ],
    featured: true,
  },
  {
    id: 'premium',
    icon: '💎',
    name: 'Lavagem Premium',
    price: '35€',
    description: 'Lavagem Completa + Tratamento de Plásticos',
    features: [
      'Pré Lavagem Exterior para remover sujidade solta.',
      'Lavagem Exterior de Contacto.',
      'Lavagem de Jantes e Pneus.',
      'Aspiração Interna.',
      'Limpeza de Portas, Tabliers e Tapetes',
      'Tratamento de Plásticos.',
    ],
    featured: false,
  },
  {
    id: 'bancos',
    icon: '🪑',
    name: 'Lavagem de Bancos',
    price: '25€',
    description: 'Lavagem de Bancos.',
    features: [
      'Limpeza Profunda de Bancos.',
      'Remoção de Manchas e Odores.',
      'Ideal para Bancos em Tecido ou Couro.',
    ],
    featured: false,
  },
];

function PriceCard({ service }) {
  return (
    <Reveal>
      <div className={`price-card ${service.featured ? 'featured' : ''}`}>
        <div className="icon">{service.icon}</div>
        <h3>{service.name}</h3>
        <div className="price">{service.price}</div>
        <p className="desc">{service.description}</p>
        <ul>
          {service.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
        <a
          href="#marcacoes"
          className={`btn-card ${service.featured ? 'red' : 'outline'}`}
        >
          Agendar
        </a>
      </div>
    </Reveal>
  );
}

function Pricing() {
  return (
    <section className="section" id="precos">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="label">Serviços & Preços</span>
            <h2>Escolha o tratamento ideal</h2>
            <div className="section-divider" />
            <p>Do básico ao premium, cada pacote foi desenhado para devolver o brilho ao seu veículo.</p>
          </div>
        </Reveal>

        <div className="pricing-grid">
          {services.map((service) => (
            <PriceCard key={service.id} service={service} />
          ))}
        </div>

        <Reveal>
          <div className="pricing-cta">
            <Link to="/servicos" className="btn-all-services">
              Ver todos os serviços
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Pricing;
