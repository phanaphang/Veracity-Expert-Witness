import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  const [page, setPage] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPage(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setPage(path);
  };

  const isPrivacyPolicy = page === '/privacy-policy';

  return (
    <div className="app">
      <Navbar onNavigateHome={() => navigateTo('/')} isSubpage={isPrivacyPolicy} />
      {isPrivacyPolicy ? (
        <PrivacyPolicy onNavigateHome={() => navigateTo('/')} />
      ) : (
        <>
          <Hero />
          <Services />
          <Categories />
          <HowItWorks />
          <CTA />
          <ContactForm />
        </>
      )}
      <Footer onNavigate={navigateTo} isSubpage={isPrivacyPolicy} />
    </div>
  );
}

export default App;
