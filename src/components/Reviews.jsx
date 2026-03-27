import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Reveal from './Reveal';

/* ─── AVALIAÇÕES ESTÁTICAS (ficam sempre visíveis) ─── */
const staticReviews = [
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

const SERVICOS = [
  'Lavagem Completa', 'Lavagem Premium', 'Lavagem de Bancos',
  'Base Interior', 'Base Exterior', 'Premium Interior',
  'Premium Exterior', 'Lavagem Bancos Individuais', 'Outro',
];

function ReviewCard({ review }) {
  const initials = review.initials || review.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const date = review.date || (review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '');

  return (
    <Reveal>
      <div className="review-card">
        <div className="review-stars">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</div>
        {review.service && <div className="review-service">{review.service}</div>}
        <p className="review-text">"{review.text}"</p>
        <div className="review-author">
          <div className="review-avatar">{initials}</div>
          <div className="review-info">
            <div className="name">{review.name}</div>
            <div className="date">{date}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hovered || value) ? 'active' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  );
}

function Reviews() {
  const { user, openLogin } = useAuth();
  const [firestoreReviews, setFirestoreReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', stars: 0, text: '' });

  // Carregar reviews aprovadas do Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'aprovada')
    );
    getDocs(q).then(snapshot => {
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFirestoreReviews(data);
    });
  }, []);

  // Pré-preencher nome se estiver logado
  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.displayName || '' }));
  }, [user]);

  const handleSubmit = async () => {
    if (!form.stars)   { alert('Selecione uma classificação'); return; }
    if (!form.name)    { alert('Insira o seu nome'); return; }
    if (!form.service) { alert('Selecione o serviço'); return; }
    if (!form.text)    { alert('Escreva a sua avaliação'); return; }

    setSending(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name:      form.name,
        service:   form.service,
        stars:     form.stars,
        text:      form.text,
        status:    'pendente',
        uid:       user?.uid || null,
        email:     user?.email || null,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setForm({ name: user?.displayName || '', service: '', stars: 0, text: '' });
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar avaliação. Tenta novamente.');
    } finally {
      setSending(false);
    }
  };

  const allReviews = [...staticReviews, ...firestoreReviews];

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
          {allReviews.map((review, i) => (
            <ReviewCard key={review.id || i} review={review} />
          ))}
        </div>

        {/* ── Deixar avaliação ── */}
        <Reveal>
          <div className="review-cta">
            {!showForm && !submitted && (
              <button
                className="review-cta-btn"
                onClick={() => {
                  if (!user) { openLogin(); return; }
                  setShowForm(true);
                }}
              >
                ✍️ Deixar a minha avaliação
              </button>
            )}

            {submitted && (
              <div className="review-submitted">
                <p>✅ Obrigado pela sua avaliação! Será publicada após aprovação.</p>
              </div>
            )}

            {showForm && !submitted && (
              <div className="review-form">
                <h3>A sua avaliação</h3>

                <div className="form-group">
                  <label>Classificação</label>
                  <StarPicker value={form.stars} onChange={v => setForm(f => ({ ...f, stars: v }))} />
                </div>

                <div className="form-group">
                  <label>Nome</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="O seu nome"
                  />
                </div>

                <div className="form-group">
                  <label>Serviço realizado</label>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="">Selecione o serviço</option>
                    {SERVICOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Comentário</label>
                  <textarea
                    rows={3}
                    value={form.text}
                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    placeholder="Partilhe a sua experiência..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn-submit" onClick={handleSubmit} disabled={sending}>
                    {sending ? 'A enviar...' : 'Enviar Avaliação'}
                  </button>
                  <button className="btn-cancel" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Reviews;
