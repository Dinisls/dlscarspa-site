import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

// ─── EMAILJS ────────────────────────────────────────────────────────────────
// Usa o mesmo template do cliente (template_guab4kn) com variáveis dinâmicas
const EMAILJS_SERVICE_ID       = 'service_xvhubv9';
const EMAILJS_TEMPLATE_CLIENTE = 'template_guab4kn';
const EMAILJS_PUBLIC_KEY       = 'PRRsSquXKHaJoklFZ';
const OWNER_EMAIL              = 'dlsinc9922@gmail.com';
// ────────────────────────────────────────────────────────────────────────────

const STATUS_LABEL = {
  pendente:   'Pendente',
  confirmada: 'Confirmada',
  recusada:   'Recusada',
};

function BookingCard({ marcacao, onAction, processing }) {
  const isProcessing = processing === marcacao.id;

  return (
    <div className={`admin-card status-${marcacao.status}`}>
      <div className="admin-card-info">
        <div className="admin-card-client">
          <strong>{marcacao.name}</strong>
          <span>{marcacao.email}</span>
        </div>
        <div className="admin-card-details">
          <span>{marcacao.serviceName} — {marcacao.servicePrice}</span>
          <span>{marcacao.date} às {marcacao.time}</span>
          {marcacao.notes && <span className="admin-card-notes">"{marcacao.notes}"</span>}
        </div>
      </div>
      <div className="admin-card-right">
        <span className={`admin-badge badge-${marcacao.status}`}>
          {STATUS_LABEL[marcacao.status]}
        </span>
        {marcacao.status === 'pendente' && onAction && (
          <div className="admin-card-actions">
            <button
              className="btn-accept"
              disabled={isProcessing}
              onClick={() => onAction(marcacao, 'accept')}
            >
              {isProcessing ? '...' : 'Aceitar'}
            </button>
            <button
              className="btn-reject"
              disabled={isProcessing}
              onClick={() => onAction(marcacao, 'reject')}
            >
              {isProcessing ? '...' : 'Recusar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_REVIEW_LABEL = { pendente: 'Pendente', aprovada: 'Aprovada', rejeitada: 'Rejeitada' };

function ReviewAdminCard({ review, onAction, processing }) {
  const isProcessing = processing === review.id;
  const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);

  return (
    <div className={`admin-card status-${review.status}`}>
      <div className="admin-card-info">
        <div className="admin-card-client">
          <strong>{review.name}</strong>
          <span style={{ color: '#f59e0b', letterSpacing: '2px' }}>{stars}</span>
        </div>
        <div className="admin-card-details">
          {review.service && <span style={{ color: 'var(--red-light)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>{review.service}</span>}
          <span>"{review.text}"</span>
          {review.email && <span style={{ opacity: 0.4, fontSize: '0.78rem' }}>{review.email}</span>}
        </div>
      </div>
      <div className="admin-card-right">
        <span className={`admin-badge badge-${review.status}`}>
          {STATUS_REVIEW_LABEL[review.status]}
        </span>
        {onAction && (
          <div className="admin-card-actions">
            {review.status !== 'aprovada' && (
              <button className="btn-accept" disabled={isProcessing} onClick={() => onAction(review, 'approve')}>
                {isProcessing ? '...' : 'Aprovar'}
              </button>
            )}
            {review.status !== 'rejeitada' && (
              <button className="btn-reject" disabled={isProcessing} onClick={() => onAction(review, 'reject')}>
                {isProcessing ? '...' : 'Rejeitar'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [marcacoes, setMarcacoes] = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [processing, setProcessing] = useState(null);
  const [tab, setTab]             = useState('marcacoes');

  // Redirecionar se não for o dono
  useEffect(() => {
    if (user === null || (user && user.email !== OWNER_EMAIL)) {
      navigate('/');
    }
  }, [user]);

  // Carregar marcações e reviews
  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) return;
    Promise.all([
      getDocs(query(collection(db, 'marcacoes'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'reviews'))),
    ]).then(([marcSnap, revSnap]) => {
      setMarcacoes(marcSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });
  }, [user]);

  const handleReviewAction = async (review, action) => {
    setProcessing(review.id);
    const newStatus = action === 'approve' ? 'aprovada' : 'rejeitada';
    try {
      await updateDoc(doc(db, 'reviews', review.id), { status: newStatus });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert(`Erro: ${err?.message || JSON.stringify(err)}`);
    } finally {
      setProcessing(null);
    }
  };

  // Nota: a query de reviews em Reviews.jsx usa where+orderBy — pode precisar de índice no Firestore.
  // Se der erro no browser, vai a Firestore → Índices e cria um índice composto:
  // Colecção: reviews | Campo 1: status (Ascending) | Campo 2: createdAt (Descending)

  const handleAction = async (marcacao, action) => {
    setProcessing(marcacao.id);
    const newStatus = action === 'accept' ? 'confirmada' : 'recusada';
    const subject = action === 'accept'
      ? 'Marcação Confirmada — DLS Car Spa'
      : 'Marcação Não Disponível — DLS Car Spa';
    const main_message = action === 'accept'
      ? 'A sua marcação foi confirmada! Estamos à sua espera.'
      : 'Infelizmente não foi possível confirmar a sua marcação. Por favor contacte-nos pelo +351 932 550 215 para encontrar uma alternativa.';

    try {
      await updateDoc(doc(db, 'marcacoes', marcacao.id), { status: newStatus });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CLIENTE,
        {
          to_email:      marcacao.email,
          client_name:   marcacao.name,
          service_name:  marcacao.serviceName,
          service_price: marcacao.servicePrice,
          date:          marcacao.date,
          time:          marcacao.time,
          notes:         marcacao.notes || '—',
          subject,
          main_message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setMarcacoes(prev =>
        prev.map(m => m.id === marcacao.id ? { ...m, status: newStatus } : m)
      );
    } catch (err) {
      console.error('Erro:', err);
      alert(`Erro: ${err?.message || err?.text || JSON.stringify(err)}`);
    } finally {
      setProcessing(null);
    }
  };

  if (user === undefined || loading) {
    return (
      <div className="agendar-page">
        <Navbar />
        <div className="agendar-loading"><span>A carregar...</span></div>
      </div>
    );
  }

  if (!user || user.email !== OWNER_EMAIL) return null;

  const pendentes   = marcacoes.filter(m => m.status === 'pendente');
  const confirmadas = marcacoes.filter(m => m.status === 'confirmada');
  const recusadas   = marcacoes.filter(m => m.status === 'recusada');

  const reviewsPendentes  = reviews.filter(r => r.status === 'pendente');
  const reviewsAprovadas  = reviews.filter(r => r.status === 'aprovada');
  const reviewsRejeitadas = reviews.filter(r => r.status === 'rejeitada');

  return (
    <div className="agendar-page">
      <Navbar />

      <div className="agendar-header">
        <span className="label">Admin</span>
        <h1>Painel de Gestão</h1>
        <div className="section-divider" />
      </div>

      {/* Tabs */}
      <div className="container" style={{ marginBottom: 0 }}>
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'marcacoes' ? 'active' : ''}`}
            onClick={() => setTab('marcacoes')}
          >
            Marcações {pendentes.length > 0 && <span className="admin-tab-badge">{pendentes.length}</span>}
          </button>
          <button
            className={`admin-tab ${tab === 'reviews' ? 'active' : ''}`}
            onClick={() => setTab('reviews')}
          >
            Avaliações {reviewsPendentes.length > 0 && <span className="admin-tab-badge">{reviewsPendentes.length}</span>}
          </button>
        </div>
      </div>

      <div className="container agendar-container">

        {/* ── Tab Marcações ── */}
        {tab === 'marcacoes' && (
          <>
            <div className="agendar-step">
              <h3 className="agendar-step-title"><span>{pendentes.length}</span> Pendentes</h3>
              {pendentes.length === 0
                ? <p className="admin-empty">Sem marcações pendentes.</p>
                : pendentes.map(m => <BookingCard key={m.id} marcacao={m} onAction={handleAction} processing={processing} />)
              }
            </div>
            {confirmadas.length > 0 && (
              <div className="agendar-step">
                <h3 className="agendar-step-title">Confirmadas</h3>
                {confirmadas.map(m => <BookingCard key={m.id} marcacao={m} processing={processing} />)}
              </div>
            )}
            {recusadas.length > 0 && (
              <div className="agendar-step">
                <h3 className="agendar-step-title">Recusadas</h3>
                {recusadas.map(m => <BookingCard key={m.id} marcacao={m} processing={processing} />)}
              </div>
            )}
          </>
        )}

        {/* ── Tab Avaliações ── */}
        {tab === 'reviews' && (
          <>
            <div className="agendar-step">
              <h3 className="agendar-step-title"><span>{reviewsPendentes.length}</span> Pendentes</h3>
              {reviewsPendentes.length === 0
                ? <p className="admin-empty">Sem avaliações pendentes.</p>
                : reviewsPendentes.map(r => <ReviewAdminCard key={r.id} review={r} onAction={handleReviewAction} processing={processing} />)
              }
            </div>
            {reviewsAprovadas.length > 0 && (
              <div className="agendar-step">
                <h3 className="agendar-step-title">Aprovadas — visíveis no site</h3>
                {reviewsAprovadas.map(r => <ReviewAdminCard key={r.id} review={r} onAction={handleReviewAction} processing={processing} />)}
              </div>
            )}
            {reviewsRejeitadas.length > 0 && (
              <div className="agendar-step">
                <h3 className="agendar-step-title">Rejeitadas — não visíveis</h3>
                {reviewsRejeitadas.map(r => <ReviewAdminCard key={r.id} review={r} onAction={handleReviewAction} processing={processing} />)}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AdminPage;
