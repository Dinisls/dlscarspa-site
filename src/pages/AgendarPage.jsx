import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';


const HORARIOS = {
  1: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00' ],
  2: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00' ],
  3: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00' ],
  4: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00' ],
  5: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00' ],
  6: [],
  0: [],
};

const SERVICOS = [
  { id: 'completa',           name: 'Lavagem Completa',           price: '25€' },
  { id: 'premium',            name: 'Lavagem Premium',            price: '35€' },
  { id: 'bancos',             name: 'Lavagem de Bancos',          price: '25€' },
  { id: 'base-interior',      name: 'Base Interior',              price: '20€' },
  { id: 'base-exterior',      name: 'Base Exterior',              price: '10€' },
  { id: 'premium-completa',   name: 'Premium Completa',           price: '35€' },
  { id: 'premium-interior',   name: 'Premium Interior',           price: '30€' },
  { id: 'premium-exterior',   name: 'Premium Exterior',           price: '15€' },
  { id: 'bancos-individuais', name: 'Lavagem Bancos Individuais', price: '15€' },
  { id: 'outro',              name: 'Outro',                      price: '—'   },
];

const DIAS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

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

  // Se não está autenticado, redirecionar para login
  useEffect(() => {
    if (user === null) {
      openLogin(window.location.pathname + window.location.search);
    }
  }, [user]);

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
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    // TODO: guardar no Firestore
    console.log('Marcação:', {
      uid:     user.uid,
      email:   user.email,
      servico: selectedService,
      data:    selectedDate.toLocaleDateString('pt-PT'),
      hora:    selectedTime,
      notas:   notes,
    });
    setConfirmed(true);
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
          <h2>Marcação Registada!</h2>
          <p>Entraremos em contacto para confirmar.</p>
          <div className="agendar-summary">
            <div><span>Serviço</span>{selectedServiceObj?.name} — {selectedServiceObj?.price}</div>
            <div><span>Data</span>{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <div><span>Hora</span>{selectedTime}</div>
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
            <p className="servicos-disclaimer">
  
          * Os preços e tempos de espera indicados são estimativas e podem estar sujeitos a alterações consoante o estado da viatura.
          * Os preços e tempos de espera indicados são para veículos de tamanho médio. Veículos maiores (SUVs, carrinhas, etc.) podem ter preços e tempos de espera superiores.
            </p>

          <select
            className="agendar-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {SERVICOS.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.price}</option>
            ))}
          </select>
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

              return (
                <div
                  key={i}
                  className={`cal-day${isPast || closed ? ' disabled' : ''}${isSel ? ' selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="cal-day-name">{DIAS[dow]}</div>
                  <div className="cal-day-num">{day.getDate()}</div>

                  {closed && <div className="cal-closed">Fechado</div>}

                  {!closed && !isPast && !isSel && (
                    <div className="cal-hint">{slots.length} horários</div>
                  )}

                  {!closed && !isPast && isSel && (
                    <div className="cal-slots">
                      {slots.map((time) => {
                        const past = isPastSlot(day, time);
                        return (
                          <button
                            key={time}
                            disabled={past}
                            className={`cal-slot${past ? ' past' : ''}${selectedTime === time ? ' active' : ''}`}
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
              <div><span>Data</span>{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <div><span>Hora</span>{selectedTime}</div>
            </div>
            <textarea
              className="agendar-notes"
              placeholder="Notas adicionais: modelo do carro, cor, observações..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <button className="btn-confirm" onClick={handleConfirm}>
              Confirmar Marcação
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default AgendarPage;
