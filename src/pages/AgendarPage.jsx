import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

// ─── EMAILJS — substituir pelos teus valores ───────────────────────────────
// 1. Cria conta em emailjs.com
// 2. Cria um serviço (Gmail, etc.)
// 3. Cria dois templates (ver instruções abaixo)
// 4. Copia os IDs aqui
const EMAILJS_SERVICE_ID       = 'service_xvhubv9';
const EMAILJS_TEMPLATE_CLIENTE = 'template_guab4kn';
const EMAILJS_TEMPLATE_OWNER   = 'template_qpg94ph';
const EMAILJS_PUBLIC_KEY       = 'PRRsSquXKHaJoklFZ';
const OWNER_EMAIL              = 'dlsinc9922@gmail.com'; // O teu email de negócio
// ───────────────────────────────────────────────────────────────────────────

const HORARIOS = {
  1: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  2: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  3: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  4: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  5: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  6: [],
  0: [],
};

// ─── DURAÇÃO em minutos por serviço ─────────────────────────────────────────
const SERVICOS = [
  { id: 'completa',           name: 'Lavagem Completa',           price: '25€', duration: 75  }, // 1h15
  { id: 'premium',            name: 'Lavagem Premium',            price: '35€', duration: 150 }, // 2h30
  { id: 'bancos',             name: 'Lavagem de Bancos',          price: '25€', duration: 150 }, // 2h30},
  { id: 'base-interior',      name: 'Base Interior',              price: '20€', duration: 45  },
  { id: 'base-exterior',      name: 'Base Exterior',              price: '10€', duration: 30  },
  { id: 'premium-interior',   name: 'Premium Interior',           price: '30€', duration: 90  },
  { id: 'premium-exterior',   name: 'Premium Exterior',           price: '15€', duration: 60  },
  { id: 'bancos-individuais', name: 'Lavagem Bancos Individuais', price: '15€', duration: 90  }, // 1h30
  { id: 'outro',              name: 'Outro',                      price: '—',   duration: 60  },
];

const CLOSING_MINUTES = 18 * 60; // 18:00 em minutos

const DIAS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function isPastSlot(date, time) {
  const now = new Date();
  const slot = new Date(date);
  const [h, m] = time.split(':').map(Number);
  slot.setHours(h, m, 0, 0);
  return slot <= now;
}

// Verifica se um slot está disponível:
// - Não termina depois das 18:00
// - Não colide com marcações existentes
function isSlotAvailable(slot, bookedIntervals, serviceDuration) {
  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + serviceDuration;

  if (slotEnd > CLOSING_MINUTES) return false;

  for (const { start, end } of bookedIntervals) {
    if (slotStart < end && slotEnd > start) return false;
  }

  return true;
}

function AgendarPage() {
  const { user, openLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const servicoParam = searchParams.get('servico') || 'completa';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [weekStart, setWeekStart]         = useState(() => getMonday(new Date()));
  const [selectedService, setSelectedService] = useState(
    SERVICOS.some(s => s.id === servicoParam) ? servicoParam : 'completa'
  );
  const [selectedDate, setSelectedDate]   = useState(null);
  const [selectedTime, setSelectedTime]   = useState(null);
  const [notes, setNotes]                 = useState('');
  const [confirmed, setConfirmed]         = useState(false);
  const [bookedIntervals, setBookedIntervals] = useState([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [sending, setSending]             = useState(false);

  // Se não está autenticado, redirecionar para login
  useEffect(() => {
    if (user === null) {
      openLogin(window.location.pathname + window.location.search);
    }
  }, [user]);

  // Quando muda o serviço, limpar hora se já não for válida
  useEffect(() => {
    if (!selectedTime || !selectedDate) return;
    const serviceObj = SERVICOS.find(s => s.id === selectedService);
    if (!isSlotAvailable(selectedTime, bookedIntervals, serviceObj.duration)) {
      setSelectedTime(null);
    }
  }, [selectedService]);

  // Buscar marcações do dia selecionado no Firestore
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    setLoadingSlots(true);
    setSelectedTime(null);

    const q = query(
      collection(db, 'marcacoes'),
      where('date', '==', dateStr)
    );

    getDocs(q).then((snapshot) => {
      const intervals = snapshot.docs
        .filter(d => d.data().status !== 'recusada') // pendente e confirmada bloqueiam slots
        .map(d => {
          const { time, duration } = d.data();
          const start = timeToMinutes(time);
          return { start, end: start + duration };
        });
      setBookedIntervals(intervals);
      setLoadingSlots(false);
    });
  }, [selectedDate]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const prevDisabled = getMonday(new Date()) >= weekStart;

  const prevWeek = () => {
    if (prevDisabled) return;
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDayClick = (day) => {
    if (day < today) return;
    const slots = HORARIOS[day.getDay()] || [];
    if (slots.length === 0) return;
    const hasAvailable = slots.some(time =>
      !isPastSlot(day, time) &&
      isSlotAvailable(time, [], selectedServiceObj.duration)
    );
    if (!hasAvailable) return;
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    setSending(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const serviceObj = SERVICOS.find(s => s.id === selectedService);
    const dateLong = selectedDate.toLocaleDateString('pt-PT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    try {
      // Guardar no Firestore
      console.log('[1/3] A guardar no Firestore...');
      await addDoc(collection(db, 'marcacoes'), {
        uid:          user.uid,
        email:        user.email,
        name:         user.displayName || user.email,
        service:      selectedService,
        serviceName:  serviceObj.name,
        servicePrice: serviceObj.price,
        duration:     serviceObj.duration,
        date:         dateStr,
        time:         selectedTime,
        notes:        notes || '',
        status:       'pendente',
        createdAt:    new Date().toISOString(),
      });
      console.log('[1/3] Firestore OK');

      // Parâmetros partilhados para ambos os templates
      const baseParams = {
        client_name:   user.displayName || user.email,
        client_email:  user.email,
        service_name:  serviceObj.name,
        service_price: serviceObj.price,
        date:          dateLong,
        time:          selectedTime,
        duration:      formatDuration(serviceObj.duration),
        notes:         notes || '—',
      };

      // Email para o cliente — aviso de pedido recebido
      console.log('[2/3] A enviar email ao cliente...');
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CLIENTE,
        {
          ...baseParams,
          to_email:     user.email,
          subject:      'Pedido de Marcação Recebido — DLS Car Spa',
          main_message: 'Recebemos o seu pedido de marcação. Entraremos em contacto em breve para confirmar a disponibilidade.',
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('[2/3] Email cliente OK');

      // Email para o dono
      console.log('[3/3] A enviar email ao dono...');
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_OWNER,
        { ...baseParams, to_email: OWNER_EMAIL },
        EMAILJS_PUBLIC_KEY
      );

      console.log('[3/3] Email dono OK — marcação completa!');
      setConfirmed(true);
    } catch (err) {
      console.error('Erro ao confirmar marcação:', err);
      alert(`Erro: ${err?.message || err?.text || JSON.stringify(err)}`);
    } finally {
      setSending(false);
    }
  };

  const selectedServiceObj = SERVICOS.find(s => s.id === selectedService);
  const weekLabel = `${weekDays[0].getDate()} ${MESES[weekDays[0].getMonth()]} — ${weekDays[6].getDate()} ${MESES[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`;

  // A carregar
  if (user === undefined) {
    return <div className="agendar-page"><Navbar /><div className="agendar-loading"><span>A carregar...</span></div></div>;
  }

  // Não autenticado — o useEffect abre o login, mostrar ecrã vazio
  if (user === null) {
    return <div className="agendar-page"><Navbar /><div className="agendar-loading"><span>A redirecionar...</span></div></div>;
  }

  // Confirmado
  if (confirmed) {
    return (
      <div className="agendar-page">
        <Navbar />
        <div className="agendar-success">
          <div className="agendar-success-icon">✅</div>
          <h2>Pedido Recebido!</h2>
          <p>Receberás um email em <strong>{user.email}</strong> assim que a marcação for confirmada.</p>
          <div className="agendar-summary">
            <div><span>Serviço</span>{selectedServiceObj?.name} — {selectedServiceObj?.price}</div>
            <div><span>Data</span>{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <div><span>Hora</span>{selectedTime}</div>
            <div><span>Duração</span>{formatDuration(selectedServiceObj?.duration)}</div>
            {notes && <div><span>Notas</span>{notes}</div>}
          </div>
          <button className="btn-confirm" onClick={() => {
            setConfirmed(false);
            setSelectedDate(null);
            setSelectedTime(null);
            setNotes('');
          }}>
            Nova Marcação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agendar-page">
      <Navbar />

      <div className="agendar-header">
        <span className="label">Marcações</span>
        <h1>Agendar Serviço</h1>
        <div className="section-divider" />
        <p>Olá, <strong>{user.displayName || user.email}</strong>. Escolha o serviço, dia e hora.</p>
      </div>

      <div className="container agendar-container">

        {/* ── PASSO 1: Serviço ── */}
        <div className="agendar-step">
          <h3 className="agendar-step-title"><span>1</span> Serviço</h3>

          <select
            className="agendar-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {SERVICOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.price} ({formatDuration(s.duration)})
              </option>
            ))}
          </select>
          <p className="servicos-disclaimer">
            * Os preços e tempos de espera indicados são estimativas e podem estar sujeitos a alterações consoante o estado da viatura.
            * Os preços e tempos de espera indicados são para veículos de tamanho médio. Veículos maiores (SUVs, carrinhas, etc.) podem ter preços e tempos de espera superiores.
          </p>
        </div>

        {/* ── PASSO 2: Calendário ── */}
        <div className="agendar-step">
          <h3 className="agendar-step-title"><span>2</span> Data e Hora</h3>

          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevWeek} disabled={prevDisabled}>&#8249;</button>
            <span className="cal-nav-label">{weekLabel}</span>
            <button className="cal-nav-btn" onClick={nextWeek}>&#8250;</button>
          </div>

          <div className="cal-grid">
            {weekDays.map((day, i) => {
              const dow    = day.getDay();
              const slots  = HORARIOS[dow] || [];
              const isPast = day < today;
              const closed = slots.length === 0;
              const isSel  = selectedDate && isSameDay(day, selectedDate);

              // Conta apenas slots que ainda não passaram e que cabem antes das 18:00
              const availableCount = slots.filter(time =>
                !isPastSlot(day, time) &&
                isSlotAvailable(time, [], selectedServiceObj.duration)
              ).length;

              const fullyUnavailable = !closed && !isPast && availableCount === 0;

              return (
                <div
                  key={i}
                  className={`cal-day${isPast || closed || fullyUnavailable ? ' disabled' : ''}${isSel ? ' selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="cal-day-name">{DIAS[dow]}</div>
                  <div className="cal-day-num">{day.getDate()}</div>

                  {closed && <div className="cal-closed">Fechado</div>}
                  {!closed && fullyUnavailable && <div className="cal-closed">Sem horários</div>}

                  {!closed && !isPast && !isSel && !fullyUnavailable && (
                    <div className="cal-hint">{availableCount} horários</div>
                  )}

                  {!closed && !isPast && isSel && (
                    <div className="cal-slots">
                      {loadingSlots ? (
                        <div className="cal-loading">A verificar...</div>
                      ) : slots.map((time) => {
                        const past = isPastSlot(day, time);
                        const available = !past && isSlotAvailable(time, bookedIntervals, selectedServiceObj.duration);
                        const unavailable = !past && !available;
                        return (
                          <button
                            key={time}
                            disabled={past || unavailable}
                            title={
                              past ? 'Horário já passou' :
                              unavailable ? 'Indisponível' : ''
                            }
                            className={`cal-slot${past ? ' past' : ''}${unavailable ? ' unavailable' : ''}${selectedTime === time ? ' active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedTime(time); }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PASSO 3: Confirmar ── */}
        {selectedDate && selectedTime && (
          <div className="agendar-step">
            <h3 className="agendar-step-title"><span>3</span> Confirmar</h3>
            <div className="agendar-summary">
              <div><span>Serviço</span>{selectedServiceObj?.name} — {selectedServiceObj?.price}</div>
              <div><span>Duração estimada</span>{formatDuration(selectedServiceObj?.duration)}</div>
              <div><span>Data</span>{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <div><span>Hora</span>{selectedTime}</div>
              <div><span>Confirmação para</span>{user.email}</div>
            </div>
            <textarea
              className="agendar-notes"
              placeholder="Notas adicionais: modelo do carro, cor, observações..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <button className="btn-confirm" onClick={handleConfirm} disabled={sending}>
              {sending ? 'A enviar...' : 'Confirmar Marcação'}
            </button>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default AgendarPage;
