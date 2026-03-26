import { useState } from 'react';
import Reveal from './Reveal';

/* ─── HORÁRIOS DISPONÍVEIS ───
   Edita este array para mudar os horários de agendamento.
*/
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
];

/* ─── INFORMAÇÕES DA EMPRESA ───
   Atualiza aqui a morada, horário e contacto.
*/
const companyInfo = [
  { icon: '📍', title: 'R. Gen. Norton de Matos 115, 1675-024', text: 'Pontinha — Portugal' },
  { icon: '🕐', title: 'Horário', text: 'Segunda a Sábado: 09:00 – 18:00' },
  { icon: '📞', title: 'Contacto', text: '+351 932 550 215' },
  { icon: '⏱️', title: 'Confirmação Rápida', text: 'Recebe confirmação em menos de 1 hora' },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  car: '',
  notes: '',
};

function Booking({ showToast }) {
  const [form, setForm] = useState(initialForm);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, email, service, date, time } = form;

    if (!name || !email || !service || !date || !time) {
      showToast('⚠️ Por favor preencha todos os campos obrigatórios');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('⚠️ Por favor insira um email válido');
      return;
    }

    // TODO: Integrar com backend (Firebase, Supabase, API própria)
    console.log('📋 Nova marcação:', { ...form, createdAt: new Date().toISOString() });

    showToast('✅ Marcação enviada com sucesso! Entraremos em contacto em breve.');
    setForm(initialForm);
  };

  return (
    <section className="section" id="marcacoes">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="label">Agendar</span>
            <h2>Marque o seu tratamento</h2>
            <div className="section-divider" />
            <p>Escolha o serviço, a data e a hora que mais lhe convém.</p>
          </div>
        </Reveal>

        <div className="booking-wrapper">
          {/* Info */}
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
                  <p>{info.text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Formulário */}
          <Reveal>
            <div className="booking-form">
              <div className="form-group">
                <label>Nome Completo</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="O seu nome" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.pt" />
                </div>
                <div className="form-group">
                  <label>Telemóvel</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+351 9XX XXX XXX" />
                </div>
              </div>

              <div className="form-group">
                <label>Serviço</label>
                <select name="service" value={form.service} onChange={handleChange}>
                  <option value="">Selecione um serviço</option>
                  <option value="exterior">Lavagem Exterior — 15€</option>
                  <option value="completa">Lavagem Completa — 30€</option>
                  <option value="premium">Detalhamento Premium — 75€</option>
                  <option value="vip">Pacote VIP — 120€</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} min={today} />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <select name="time" value={form.time} onChange={handleChange}>
                    <option value="">Selecione a hora</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Marca e Modelo do Veículo</label>
                <input name="car" value={form.car} onChange={handleChange} placeholder="Ex: BMW Série 3 2020" />
              </div>

              <div className="form-group">
                <label>Observações (opcional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Alguma informação adicional..." />
              </div>

              <button className="btn-submit" onClick={handleSubmit}>
                Confirmar Marcação →
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Booking;
