import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
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
import FAQ from './pages/FAQ';
import JoinOurPanel from './pages/JoinOurPanel';

// Portal - Auth
import Login from './portal/pages/Login';
import AcceptInvite from './portal/pages/AcceptInvite';
import AuthCallback from './portal/pages/AuthCallback';
import ForgotPassword from './portal/pages/ForgotPassword';

// Portal - Expert
import PortalLayout from './portal/components/PortalLayout';
import ProtectedRoute from './portal/components/ProtectedRoute';
import Dashboard from './portal/pages/Dashboard';
import Profile from './portal/pages/Profile';
import Documents from './portal/pages/Documents';
import CaseInvitations from './portal/pages/CaseInvitations';
import Messages from './portal/pages/Messages';
import ChangePassword from './portal/pages/ChangePassword';

// Admin
import AdminLayout from './portal/admin/AdminLayout';
import AdminDashboard from './portal/admin/AdminDashboard';
import ExpertList from './portal/admin/ExpertList';
import ExpertDetail from './portal/admin/ExpertDetail';
import InviteExpert from './portal/admin/InviteExpert';
import CaseList from './portal/admin/CaseList';
import CaseCreate from './portal/admin/CaseCreate';
import CaseDetail from './portal/admin/CaseDetail';
import AdminMessages from './portal/admin/AdminMessages';

function HomePage() {
  return (
    <>
      <SEO
        description="Veracity Expert Witness connects legal professionals with qualified expert witnesses across medical, financial, technology, engineering, and more. HIPAA-compliant. Fast response."
        path="/"
      />
      <Navbar />
      <Hero />
      <Services />
      <Categories />
      <HowItWorks />
      <ContactForm />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          {/* Public Site */}
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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/join-our-panel" element={<JoinOurPanel />} />

          {/* Portal - Auth (public) */}
          <Route path="/portal/login" element={<Login />} />
          <Route path="/portal/accept-invite" element={<AcceptInvite />} />
          <Route path="/portal/auth/callback" element={<AuthCallback />} />
          <Route path="/portal/forgot-password" element={<ForgotPassword />} />

          {/* Portal - Expert (protected) */}
          <Route path="/portal/dashboard" element={<ProtectedRoute><PortalLayout><Dashboard /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/profile" element={<ProtectedRoute><PortalLayout><Profile /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/documents" element={<ProtectedRoute><PortalLayout><Documents /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/cases" element={<ProtectedRoute><PortalLayout><CaseInvitations /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/messages" element={<ProtectedRoute><PortalLayout><Messages /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/change-password" element={<ProtectedRoute><PortalLayout><ChangePassword /></PortalLayout></ProtectedRoute>} />

          {/* Admin (protected, admin only) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/experts" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ExpertList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/experts/:id" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ExpertDetail /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/invite" element={<ProtectedRoute requiredRole="admin"><AdminLayout><InviteExpert /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/cases" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CaseList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/cases/new" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CaseCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/cases/:id" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CaseDetail /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/change-password" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ChangePassword /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
