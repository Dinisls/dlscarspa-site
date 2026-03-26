import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Booking from './components/Booking';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import ServicosPage from './pages/ServicosPage';

function HomePage({ onLoginClick, showToast }) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setShowAuth(true)} />
      <Hero />
      <Pricing />
      <Gallery />
      <Reviews />
      <Booking showToast={showToast} />
      <Footer />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        showToast={showToast}
      />
    </>
  );
}

function App() {
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3500);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage showToast={showToast} />} />
        <Route path="/servicos" element={<ServicosPage />} />
      </Routes>
      <Toast message={toast.message} visible={toast.visible} />
    </BrowserRouter>
  );
}

export default App;
