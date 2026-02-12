import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <Services />
      <Categories />
      <HowItWorks />
      <CTA />
      <ContactForm />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
