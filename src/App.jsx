import { useState } from 'react';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import QRCodePage from './pages/QRCodePage';
import AdminLogin from './pages/AdminLogin';
import AdminCallbacks from './pages/AdminCallbacks';
import './styles/globals.css';

/**
 * Main App Component
 * Manages routing and overall application state
 */
function App() {
  // Allow deep-linking via URL hash (e.g. #calculator or #qrcode)
  const rawInitial = (typeof window !== 'undefined' && window.location.hash)
    ? window.location.hash.replace('#', '')
    : 'home';

  // If user attempts to open the admin page without a stored token, redirect to login
  const hasAdminToken = typeof window !== 'undefined' && !!localStorage.getItem('adminToken');
  const initialPage = (rawInitial === 'admin' && !hasAdminToken) ? 'admin-login' : rawInitial;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Listen for hash changes and enforce admin guard on navigation
  useState(() => {
    if (typeof window === 'undefined') return;
    const onHashChange = () => {
      const next = window.location.hash ? window.location.hash.replace('#', '') : 'home';
      const hasToken = !!localStorage.getItem('adminToken');
      if (next === 'admin' && !hasToken) {
        window.location.hash = 'admin-login';
        setCurrentPage('admin-login');
        return;
      }
      setCurrentPage(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  });

  // Handle navigation
  const navigateToHome = () => { window.location.hash = 'home'; setCurrentPage('home'); };
  const navigateToCalculator = () => { window.location.hash = 'calculator'; setCurrentPage('calculator'); };
  const navigateToQRCode = () => { window.location.hash = 'qrcode'; setCurrentPage('qrcode'); };

  return (
    <div className="bg-neutral-light min-h-screen">
      {currentPage === 'home' ? (
        <HomePage onNavigateToCalculator={navigateToCalculator} onNavigateToQRCode={navigateToQRCode} />
      ) : currentPage === 'calculator' ? (
        <CalculatorPage onBackHome={navigateToHome} />
      ) : currentPage === 'admin-login' ? (
        <AdminLogin />
      ) : currentPage === 'admin' ? (
        <AdminCallbacks />
      ) : (
        <QRCodePage onNavigateToHome={navigateToHome} />
      )}
    </div>
  );
}

export default App;
