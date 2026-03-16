import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Home page components — always needed on first load
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

// Route wrappers — small, used on every portal/admin route
import PortalLayout from './portal/components/PortalLayout';
import ProtectedRoute from './portal/components/ProtectedRoute';
import AdminLayout from './portal/admin/AdminLayout';

// Public pages — lazy loaded
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Compliance = lazy(() => import('./pages/Compliance'));
const MedicalHealthcare = lazy(() => import('./pages/MedicalHealthcare'));
const FinancialAccounting = lazy(() => import('./pages/FinancialAccounting'));
const TechnologyCyber = lazy(() => import('./pages/TechnologyCyber'));
const ConstructionEngineering = lazy(() => import('./pages/ConstructionEngineering'));
const EnvironmentalScience = lazy(() => import('./pages/EnvironmentalScience'));
const IntellectualProperty = lazy(() => import('./pages/IntellectualProperty'));
const AccidentReconstruction = lazy(() => import('./pages/AccidentReconstruction'));
const ForensicAnalysis = lazy(() => import('./pages/ForensicAnalysis'));
const FAQ = lazy(() => import('./pages/FAQ'));
const JoinOurPanel = lazy(() => import('./pages/JoinOurPanel'));

// Portal — Auth pages
const Login = lazy(() => import('./portal/pages/Login'));
const AcceptInvite = lazy(() => import('./portal/pages/AcceptInvite'));
const AuthCallback = lazy(() => import('./portal/pages/AuthCallback'));
const ForgotPassword = lazy(() => import('./portal/pages/ForgotPassword'));

// Portal — Expert pages
const Dashboard = lazy(() => import('./portal/pages/Dashboard'));
const Profile = lazy(() => import('./portal/pages/Profile'));
const Documents = lazy(() => import('./portal/pages/Documents'));
const CaseInvitations = lazy(() => import('./portal/pages/CaseInvitations'));
const Messages = lazy(() => import('./portal/pages/Messages'));
const ChangePassword = lazy(() => import('./portal/pages/ChangePassword'));
const CalendarPage = lazy(() => import('./portal/pages/Calendar'));

// Training module — home + Expert Witness Foundations
const TrainingHome = lazy(() => import('./portal/training/TrainingHome'));
const TrainingDashboard = lazy(() => import('./portal/training/TrainingDashboard'));
const LessonPage = lazy(() => import('./portal/training/LessonPage'));
const QuizPage = lazy(() => import('./portal/training/QuizPage'));
const ScenarioPage = lazy(() => import('./portal/training/ScenarioPage'));
const AssessmentPage = lazy(() => import('./portal/training/AssessmentPage'));
const CertificatePage = lazy(() => import('./portal/training/CertificatePage'));
const ResourcesPage = lazy(() => import('./portal/training/ResourcesPage'));
const TrainingLayout = lazy(() => import('./portal/training/TrainingLayout'));

// Training module — Standards of Admissibility: Frye, Kelly, and Daubert
const AdmissibilityLayout = lazy(() => import('./portal/training/admissibility/AdmissibilityLayout'));
const AdmissibilityDashboard = lazy(() => import('./portal/training/admissibility/AdmissibilityDashboard'));
const AdmissibilityLessonPage = lazy(() => import('./portal/training/admissibility/AdmissibilityLessonPage'));
const AdmissibilityScenarioPage = lazy(() => import('./portal/training/admissibility/AdmissibilityScenarioPage'));
const AdmissibilityQuizPage = lazy(() => import('./portal/training/admissibility/AdmissibilityQuizPage'));
const AdmissibilityCertificatePage = lazy(() => import('./portal/training/admissibility/AdmissibilityCertificatePage'));
const AdmissibilityResourcesPage = lazy(() => import('./portal/training/admissibility/AdmissibilityResourcesPage'));

// Admin pages — includes heavy libs (xlsx, jspdf, pdf-lib) only when visited
const AdminDashboard = lazy(() => import('./portal/admin/AdminDashboard'));
const ExpertList = lazy(() => import('./portal/admin/ExpertList'));
const ExpertDetail = lazy(() => import('./portal/admin/ExpertDetail'));
const InviteExpert = lazy(() => import('./portal/admin/InviteExpert'));
const CaseList = lazy(() => import('./portal/admin/CaseList'));
const CaseCreate = lazy(() => import('./portal/admin/CaseCreate'));
const CaseDetail = lazy(() => import('./portal/admin/CaseDetail'));
const AdminMessages = lazy(() => import('./portal/admin/AdminMessages'));
const AdminProfile = lazy(() => import('./portal/admin/AdminProfile'));
const TrainingReport = lazy(() => import('./portal/admin/TrainingReport'));

function RouteErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h2 style={{ marginBottom: '12px' }}>
        {is404 ? 'Page Not Found' : 'Something went wrong'}
      </h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {is404
          ? "The page you're looking for doesn't exist."
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 24px',
          background: '#1a365d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Go Home
      </button>
    </div>
  );
}

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
    errorElement: <RouteErrorPage />,
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

      // Training module (expert, admin, staff)
      { path: '/training', element: <ProtectedRoute><PortalLayout><TrainingHome /></PortalLayout></ProtectedRoute> },
      { path: '/training/foundations', element: <ProtectedRoute><TrainingLayout><TrainingDashboard /></TrainingLayout></ProtectedRoute> },
      { path: '/training/lesson/:lessonId', element: <ProtectedRoute><TrainingLayout><LessonPage /></TrainingLayout></ProtectedRoute> },
      { path: '/training/quiz/:unitId', element: <ProtectedRoute><TrainingLayout><QuizPage /></TrainingLayout></ProtectedRoute> },
      { path: '/training/scenario/:scenarioId', element: <ProtectedRoute><TrainingLayout><ScenarioPage /></TrainingLayout></ProtectedRoute> },
      { path: '/training/assessment', element: <ProtectedRoute><TrainingLayout><AssessmentPage /></TrainingLayout></ProtectedRoute> },
      { path: '/training/certificate', element: <ProtectedRoute><TrainingLayout><CertificatePage /></TrainingLayout></ProtectedRoute> },
      { path: '/training/resources', element: <ProtectedRoute><PortalLayout><ResourcesPage /></PortalLayout></ProtectedRoute> },

      // Training module — Standards of Admissibility (expert, admin, staff)
      { path: '/training/admissibility', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityDashboard /></AdmissibilityLayout></ProtectedRoute> },
      { path: '/training/admissibility/lesson/:lessonId', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityLessonPage /></AdmissibilityLayout></ProtectedRoute> },
      { path: '/training/admissibility/scenario', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityScenarioPage /></AdmissibilityLayout></ProtectedRoute> },
      { path: '/training/admissibility/quiz', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityQuizPage /></AdmissibilityLayout></ProtectedRoute> },
      { path: '/training/admissibility/certificate', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityCertificatePage /></AdmissibilityLayout></ProtectedRoute> },
      { path: '/training/admissibility/resources', element: <ProtectedRoute><AdmissibilityLayout><AdmissibilityResourcesPage /></AdmissibilityLayout></ProtectedRoute> },

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
      { path: '/admin/training', element: <ProtectedRoute requiredRole="admin"><AdminLayout><TrainingReport /></AdminLayout></ProtectedRoute> },
      { path: '/admin/change-password', element: <ProtectedRoute requiredRole="admin"><AdminLayout><ChangePassword /></AdminLayout></ProtectedRoute> },
    ],
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
