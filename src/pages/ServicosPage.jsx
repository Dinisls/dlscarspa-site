import { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

/* ─── SERVIÇOS EM DESTAQUE (secção topo) ─── */
const featuredServices = [
  {
    id: 'completa',
    icon: '✨',
    name: 'Lavagem Completa',
    price: '25€',
    waitTime: '', // ex: '45 min'
    description: 'Lavagem Externa + Aspiração interna + Limpeza de Portas, Tabliers e Tapetes',
    features: [
      'Lavagem Exterior de Contacto.',
      'Lavagem de Jantes e Pneus.',
      'Aspiração Interna.',
      'Limpeza de Portas, Tabliers e Tapetes.',
    ],
    popular: true,
  },
  {
    id: 'premium',
    icon: '💎',
    name: 'Lavagem Premium',
    price: '35€',
    waitTime: '',
    description: 'Lavagem Completa + Tratamento de Plásticos',
    features: [
      'Pré Lavagem Exterior para remover sujidade solta.',
      'Lavagem Exterior de Contacto.',
      'Lavagem de Jantes e Pneus.',
      'Aspiração Interna.',
      'Limpeza de Portas, Tabliers e Tapetes.',
      'Tratamento de Plásticos.',
    ],
    popular: false,
  },
  {
    id: 'bancos',
    icon: '🪑',
    name: 'Lavagem de Bancos',
    price: '25€',
    waitTime: '',
    description: 'Lavagem de Bancos.',
    features: [
      'Limpeza Profunda de Bancos.',
      'Remoção de Manchas e Odores.',
      'Ideal para Bancos em Tecido ou Couro.',
    ],
    popular: false,
  },
];

/* ─── GRUPOS DE SERVIÇOS (secção abaixo) ───
   Cada grupo tem um título e uma lista de serviços.
   Para editar preços, tempo de espera ou features, basta alterar aqui.
*/
const serviceGroups = [
  {
    groupName: 'Lavagem Completa',
    services: [
      {
        id: 'completa-full',
        name: 'Lavagem Completa',
        price: '25€',
        waitTime: '1:30h',
        description: 'Lavagem Externa + Aspiração interna + Limpeza de Portas, Tabliers e Tapetes',
    features: [
      'Lavagem Exterior de Contacto.',
      'Lavagem de Jantes e Pneus.',
      'Aspiração Interna.',
      'Limpeza de Portas, Tabliers e Tapetes.',
    ],
      },
      {
        id: 'base-interior',
        name: 'Base Interior',
        price: '20€',
        waitTime: '45min',
        description: 'Aspiração interna + Limpeza de Portas, Tabliers e Tapetes',
        features: ['Aspiração Interna.', 'Limpeza de Portas, Tabliers e Tapetes.'],
      },
      {
        id: 'base-exterior',
        name: 'Base Exterior',
        price: '10€',
        waitTime: '45min',
        description: 'Lavagem Exterior de Contacto.',
        features: ['Lavagem Exterior de Contacto.', 'Lavagem de Jantes e Pneus.'],
      },
    ],
  },
  {
    groupName: 'Lavagem Premium',
    services: [
      {
        id: 'premium-completa',
        name: 'Premium Completa',
        price: '35€',
        waitTime: '2:00h',
        description: 'Lavagem Completa + Tratamento de Plásticos',
        features: [
          'Pré Lavagem Exterior para remover sujidade solta.',
          'Lavagem Exterior de Contacto.',
          'Lavagem de Jantes e Pneus.',
          'Aspiração Interna.',
          'Limpeza de Portas, Tabliers e Tapetes.',
          'Aplicação de cera para restautro de brilhos nos Plásticos.',
        ],
      },
      {
        id: 'premium-interior',
        name: 'Premium Interior',
        price: '30€',
        waitTime: '1:30h',
        description: 'Aspiração interna + Limpeza de Portas, Tabliers e Tapetes + Tratamento de Plásticos',
        features: ['Aspiração Interna.', 'Limpeza de Portas, Tabliers e Tapetes.', 'Aplicação de cera para restautro de brilhos nos Plásticos.'],
      },
      {
        id: 'premium-exterior',
        name: 'Premium Exterior',
        price: '15€',
        waitTime: '1:00h',
        description: 'Pré Lavagem Exterior para remover sujidade solta + Lavagem Exterior de Contacto + Lavagem de Jantes e Pneus.',
        features: ['Pré Lavagem Exterior para remover sujidade solta.', 'Lavagem Exterior de Contacto.', 'Lavagem de Jantes e Pneus.'],
      },
    ],
  },
  {
    groupName: 'Lavagem de Bancos',
    services: [
      {
        id: 'bancos-full',
        name: 'Lavagem de Bancos',
        price: '25€',
        waitTime: '2:30h',
        description: 'Limpeza Profunda de todos os Bancos + Remoção de Manchas e Odores (Ideal para Bancos em Tecido ou Couro)',
        features: ['Limpeza Profunda de Bancos com estrator de liquidos.', 'Remoção de Manchas e Odores.'],
      },
      {
        id: 'bancos-individuais',
        name: 'Lavagem Bancos Individuais',
        price: '15€',
        waitTime: '1:30h',
        description: 'Limpeza Profunda de Bancos (Escolha de Bancos da Frente ou Bancos Traseiros) + Remoção de Manchas e Odores (Ideal para Bancos em Tecido ou Couro)',
        features: ['Limpeza Profunda de Bancos com estrator de liquidos.', 'Remoção de Manchas e Odores.'],
      },
    ],
  },
  {
    groupName: 'Outros Serviços',
    services: [
      {
        id: 'outro',
        name: 'Outro',
        price: 'Entrar em contacto para orçamento',
        waitTime: '',
        description: 'Realizamos outros serviços de limpeza automóvel. Entre em contacto para um orçamento personalizado.',
        features: [],
      },
    ],
  },
];

function FeaturedCard({ s }) {
  return (
    <div className={`servicos-card ${s.popular ? 'featured' : ''}`}>
      {s.popular && <span className="servicos-badge">Mais Popular</span>}
      <div className="servicos-card-icon">{s.icon}</div>
      <h2>{s.name}</h2>
      <div className="servicos-card-price">{s.price}</div>
      {s.waitTime && (
        <div className="servicos-wait">⏱ {s.waitTime}</div>
      )}
      <p className="servicos-card-desc">{s.description}</p>
      {s.features.length > 0 && (
        <ul>
          {s.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
      <a href="/#marcacoes" className={`btn-card ${s.popular ? 'red' : 'outline'}`}>
        Agendar
      </a>
    </div>
  );
}

function GroupRow({ group }) {
  return (
    <div className="servicos-group">
      <h3 className="servicos-group-title">{group.groupName}</h3>
      <div className="servicos-group-grid">
        {group.services.map((s) => (
          <div key={s.id} className="servicos-row-card">
            <div className="servicos-row-top">
              <div className="servicos-row-info">
                <span className="servicos-row-name">{s.name}</span>
                {s.waitTime && (
                  <span className="servicos-row-wait">⏱ {s.waitTime}</span>
                )}
              </div>
              <div className="servicos-row-right">
                <span className="servicos-row-price">{s.price}</span>
                <a href="/#marcacoes" className="servicos-row-btn">Agendar</a>
              </div>
            </div>
            {s.description && (
              <p className="servicos-row-desc">{s.description}</p>
            )}
            {s.features.length > 0 && (
              <ul className="servicos-row-features">
                {s.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicosPage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="servicos-page">
      <Navbar onLoginClick={() => setShowAuth(true)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} showToast={() => {}} />

      <div className="servicos-page-header">
        <span className="label">Serviços & Preços</span>
        <h1>Todos os Serviços</h1>
        <div className="section-divider" />
        <p>Escolha o serviço ideal para o seu veículo.</p>
      </div>

      <div className="container">

        {/* ── SECÇÃO DE DESTAQUE ── */}
        <div className="servicos-destaque-label">
          <span className="label">Mais Escolhidos</span>
        </div>
        <div className="servicos-grid">
          {featuredServices.map((s) => (
            <FeaturedCard key={s.id} s={s} />
          ))}
        </div>

        {/* ── TODOS OS SERVIÇOS ── */}
        <div className="servicos-all-title">
          <span className="label">Todos os Serviços</span>
        </div>
        <div className="servicos-groups">
          {serviceGroups.map((group) => (
            <GroupRow key={group.groupName} group={group} />
          ))}
        </div>

        {/* ── AVISO ── */}
        <p className="servicos-disclaimer">
  
          * Os preços e tempos de espera indicados são estimativas e podem estar sujeitos a alterações consoante o estado da viatura.
          * Os preços e tempos de espera indicados são para veículos de tamanho médio. Veículos maiores (SUVs, carrinhas, etc.) podem ter preços e tempos de espera superiores.
        </p>

      </div>
    </div>
  );
}

export default ServicosPage;
