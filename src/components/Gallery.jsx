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
            <p>Veja o antes e depois de cada tratamento. Resultados que falam por si.</p>
          </div>
        </Reveal>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <GalleryItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
