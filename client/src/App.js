import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Compliance from './pages/Compliance';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Categories />
      <HowItWorks />
      <CTA />
      <ContactForm />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/compliance" element={<Compliance />} />
      </Routes>
    </div>
  );
}

export default App;
