import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const companyInfo = [
  {
    icon: '🗺️',
    title: 'R. Gen. Norton de Matos 115, 1675-024',
    text: 'Pontinha — Portugal',
    url: 'https://maps.app.goo.gl/e6XKzm81ec6h1aGH8'
  },
  { icon: '🕐', title: 'Horário', text: 'Segunda a Sábado: 09:00 – 18:00' },
  { icon: '📞', title: 'Contacto', text: '+351 932 550 215' },
  { icon: '⏱️', title: 'Confirmação Rápida', text: 'Recebe confirmação em menos de 1 hora' },
];

function Booking() {
  return (
    <section className="section" id="marcacoes">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="label">Contacto & Localização</span>
            <h2>Onde nos encontrar</h2>
            <div className="section-divider" />
            <p>Estamos disponíveis de segunda a sexta-feira. Marque o seu serviço online em poucos passos.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="contact-strip-group">
            <a href="tel:+351932550215" className="contact-strip">
              <span className="contact-strip-icon">📞</span>
              <span>Em caso de dúvidas, contacte-nos directamente</span>
              <strong>932 550 215</strong>
            </a>
            <a href="https://wa.me/351932550215" target="_blank" rel="noopener noreferrer" className="contact-strip">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366', flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Ou envie-nos uma mensagem pelo WhatsApp</span>
              <strong>932 550 215</strong>
            </a>
          </div>
        </Reveal>

        <div className="booking-wrapper booking-info-only">
          <Reveal className="booking-info">
            <h3>
              Porque escolher a <span style={{ color: 'var(--red)' }}>DLS Car Spa</span>?
            </h3>
            <p>
              Tratamos cada veículo com o máximo cuidado e atenção ao detalhe.
              Utilizamos apenas produtos de qualidade profissional.
            </p>
            {companyInfo.map((info, i) => (
              <div className="info-item" key={i}>
                <div className="info-icon">{info.icon}</div>
                <div className="info-text">
                  <h4>{info.title}</h4>
                  {info.url ? (
                    <>
                      <p style={{ margin: 0 }}>{info.text}</p>
                      <a href={info.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', textDecoration: 'none' }}>
                        Ver no Google Maps ↗
                      </a>
                    </>
                  ) : (
                    <p>{info.text}</p>
                  )}
                </div>
              </div>
            ))}

            <Link to="/agendar" className="btn-submit" style={{ display: 'inline-block', marginTop: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              Agendar Serviço →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Booking;
