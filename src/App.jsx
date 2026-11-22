import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import SkipLink from './components/common/SkipLink';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AccessibilityDrawer from './components/layout/AccessibilityDrawer';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import RightsAndSchemesPage from './pages/RightsAndSchemesPage';
import AboutPage from './pages/AboutPage';
import SimulationPage from './pages/SimulationPage';
import ToolsHubPage from './pages/ToolsHubPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// 404 Page
function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-[var(--bg-surface)]">
        <h1 className="text-4xl font-extrabold mb-3">404 - Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The page or topic you requested could not be located.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base touch-target shadow-md focus-visible:outline-none"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors selection:bg-blue-200 selection:text-blue-900">
            <SkipLink targetId="main-content" />
            <Navbar />
            
            <main id="main-content" className="flex-1 focus:outline-none">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/rights-and-schemes" element={<RightsAndSchemesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/simulations" element={<SimulationPage />} />
                <Route path="/simulations/:categorySlug" element={<SimulationPage />} />
                <Route path="/tools" element={<ToolsHubPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
            <AccessibilityDrawer />
          </div>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
