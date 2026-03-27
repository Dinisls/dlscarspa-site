import { useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Booking from './components/Booking';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ServicosPage from './pages/ServicosPage';
import AgendarPage from './pages/AgendarPage';
import AdminPage from './pages/AdminPage';

function HomePage({ showToast }) {
  return (
    <>
      <Navbar />
      <Hero />
      <Pricing />
      <Gallery />
      <Reviews />
      <Booking />
      <Footer />
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
      <AuthProvider>
        <Routes>
          <Route path="/"         element={<HomePage showToast={showToast} />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/agendar"  element={<AgendarPage />} />
          <Route path="/admin"    element={<AdminPage />} />
        </Routes>
        <Toast message={toast.message} visible={toast.visible} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
