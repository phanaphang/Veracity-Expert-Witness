import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
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
import CalendarPage from './portal/pages/Calendar';

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
import AdminProfile from './portal/admin/AdminProfile';

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

function Root() {
  return (
    <AuthProvider>
      <div className="app">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // Public Site
      { path: '/', element: <HomePage /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms-of-service', element: <TermsOfService /> },
      { path: '/cookie-policy', element: <CookiePolicy /> },
      { path: '/compliance', element: <Compliance /> },
      { path: '/medical-healthcare', element: <MedicalHealthcare /> },
      { path: '/financial-accounting', element: <FinancialAccounting /> },
      { path: '/technology-cyber', element: <TechnologyCyber /> },
      { path: '/construction-engineering', element: <ConstructionEngineering /> },
      { path: '/environmental-science', element: <EnvironmentalScience /> },
      { path: '/intellectual-property', element: <IntellectualProperty /> },
      { path: '/accident-reconstruction', element: <AccidentReconstruction /> },
      { path: '/forensic-analysis', element: <ForensicAnalysis /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/join-our-panel', element: <JoinOurPanel /> },

      // Portal - Auth (public)
      { path: '/portal/login', element: <Login /> },
      { path: '/portal/accept-invite', element: <AcceptInvite /> },
      { path: '/portal/auth/callback', element: <AuthCallback /> },
      { path: '/portal/forgot-password', element: <ForgotPassword /> },

      // Portal - Expert (protected)
      { path: '/portal/dashboard', element: <ProtectedRoute><PortalLayout><Dashboard /></PortalLayout></ProtectedRoute> },
      { path: '/portal/profile', element: <ProtectedRoute><PortalLayout><Profile /></PortalLayout></ProtectedRoute> },
      { path: '/portal/documents', element: <ProtectedRoute><PortalLayout><Documents /></PortalLayout></ProtectedRoute> },
      { path: '/portal/cases', element: <ProtectedRoute><PortalLayout><CaseInvitations /></PortalLayout></ProtectedRoute> },
      { path: '/portal/messages', element: <ProtectedRoute><PortalLayout><Messages /></PortalLayout></ProtectedRoute> },
      { path: '/portal/change-password', element: <ProtectedRoute><PortalLayout><ChangePassword /></PortalLayout></ProtectedRoute> },
      { path: '/portal/calendar', element: <ProtectedRoute><PortalLayout><CalendarPage /></PortalLayout></ProtectedRoute> },

      // Admin (protected, admin only)
      { path: '/admin/dashboard', element: <ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute> },
      { path: '/admin/profile', element: <ProtectedRoute requiredRole="admin"><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute> },
      { path: '/admin/experts', element: <ProtectedRoute requiredRole="admin"><AdminLayout><ExpertList /></AdminLayout></ProtectedRoute> },
      { path: '/admin/experts/:id', element: <ProtectedRoute requiredRole="admin"><AdminLayout><ExpertDetail /></AdminLayout></ProtectedRoute> },
      { path: '/admin/invite', element: <ProtectedRoute requiredRole="admin-only"><AdminLayout><InviteExpert /></AdminLayout></ProtectedRoute> },
      { path: '/admin/cases', element: <ProtectedRoute requiredRole="admin"><AdminLayout><CaseList /></AdminLayout></ProtectedRoute> },
      { path: '/admin/cases/new', element: <ProtectedRoute requiredRole="admin-only"><AdminLayout><CaseCreate /></AdminLayout></ProtectedRoute> },
      { path: '/admin/cases/:id', element: <ProtectedRoute requiredRole="admin"><AdminLayout><CaseDetail /></AdminLayout></ProtectedRoute> },
      { path: '/admin/messages', element: <ProtectedRoute requiredRole="admin"><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute> },
      { path: '/admin/change-password', element: <ProtectedRoute requiredRole="admin"><AdminLayout><ChangePassword /></AdminLayout></ProtectedRoute> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
