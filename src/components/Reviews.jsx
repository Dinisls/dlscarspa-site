import Reveal from './Reveal';

/* ─── AVALIAÇÕES ───
   Para adicionar/editar reviews, basta alterar este array.
*/
const reviews = [
  {
    initials: 'RM',
    name: 'Ricardo Mendes',
    date: 'Há 1 mês',
    stars: 5,
    text: 'Levei o meu carro que estava bastante sujo e voltou incrivel. Recomendo a Lavagem Premium, os detalhes valem a pena!',
  },
  
  {
    initials: 'JS',
    name: 'João Santos',
    date: 'Há 2 mêses',
    stars: 5,
    text: 'O Carro estava parado há 6 meses, a Lavagem de Bancos mais a Lavagem Premium deixaram o carro impecável.',
  },

  {
    initials: 'MI',
    name: 'Maria Isabel',
    date: 'Há 2 semanas',
    stars: 5,
    text: 'Depois do inverno, o meu carro estava cheio de marcas de chuva e bastante sujo por dentro. Com a Lavagem Premium, o carro ficou pronto para o verão.',
  },

  
  
  
];

function ReviewCard({ review }) {
  return (
    <Reveal>
      <div className="review-card">
        <div className="review-stars">{'★'.repeat(review.stars)}</div>
        <p className="review-text">"{review.text}"</p>
        <div className="review-author">
          <div className="review-avatar">{review.initials}</div>
          <div className="review-info">
            <div className="name">{review.name}</div>
            <div className="date">{review.date}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="label">Avaliações</span>
            <h2>O que dizem os nossos clientes</h2>
            <div className="section-divider" />
            <p>A satisfação dos nossos clientes é a nossa melhor publicidade.</p>
          </div>
        </Reveal>

        <div className="reviews-grid">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
