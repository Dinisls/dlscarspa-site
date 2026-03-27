import Reveal from './Reveal';
const galleryItems = [
  { type: 'photo', src: '/images/Galeria/galeria-1.jpg', alt: 'Trabalho DLS Car Spa' },
  { type: 'photo', src: '/images/Galeria/galeria-2.jpg', alt: 'Trabalho DLS Car Spa' },
  { type: 'photo', src: '/images/Galeria/galeria-3.jpg', alt: 'Trabalho DLS Car Spa' },
  { type: 'photo', src: '/images/Galeria/galeria-4.jpg', alt: 'Trabalho DLS Car Spa' },
  { type: 'photo', src: '/images/Galeria/galeria-5.jpg', alt: 'Trabalho DLS Car Spa' },
];

function GalleryItem({ item }) {
  if (item.src) {
    return (
      <Reveal>
        <div className="gallery-item">
          {item.type === 'video' ? (
            <video src={item.src} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src={item.src} alt={item.alt} />
          )}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className="gallery-item">
        <div className="placeholder">
          <div className="icon-lg">{item.type === 'video' ? '🎬' : '📷'}</div>
          <p>{item.alt}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Gallery() {
  return (
    <section className="section" id="galeria">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="label">Galeria</span>
            <h2>Os nossos trabalhos</h2>
            <div className="section-divider" />
            <p>Veja os nossos trabalhos. Resultados que falam por si.</p>
          </div>
        </Reveal>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <GalleryItem key={i} item={item} />
          ))}
        </div>

        <Reveal>
          <div className="gallery-socials">
            <p>Ver mais trabalhos nas nossas redes sociais</p>
            <div className="gallery-socials-links">
              <a href="https://www.instagram.com/dls.carspa/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                @dls.carspa
              </a>
              <a href="https://www.tiktok.com/@dls.carspa" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
                </svg>
                @dls.carspa
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Gallery;
