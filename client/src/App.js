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
import MedicalHealthcare from './pages/MedicalHealthcare';
import FinancialAccounting from './pages/FinancialAccounting';
import TechnologyCyber from './pages/TechnologyCyber';
import ConstructionEngineering from './pages/ConstructionEngineering';
import EnvironmentalScience from './pages/EnvironmentalScience';
import IntellectualProperty from './pages/IntellectualProperty';
import AccidentReconstruction from './pages/AccidentReconstruction';
import ForensicAnalysis from './pages/ForensicAnalysis';

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
        <Route path="/medical-healthcare" element={<MedicalHealthcare />} />
        <Route path="/financial-accounting" element={<FinancialAccounting />} />
        <Route path="/technology-cyber" element={<TechnologyCyber />} />
        <Route path="/construction-engineering" element={<ConstructionEngineering />} />
        <Route path="/environmental-science" element={<EnvironmentalScience />} />
        <Route path="/intellectual-property" element={<IntellectualProperty />} />
        <Route path="/accident-reconstruction" element={<AccidentReconstruction />} />
        <Route path="/forensic-analysis" element={<ForensicAnalysis />} />
      </Routes>
    </div>
  );
}

export default App;
