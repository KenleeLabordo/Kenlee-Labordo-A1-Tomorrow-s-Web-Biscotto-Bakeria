/**
 * Main Application Component
 * 
 * Handles the primary layout structure and client-side routing logic.
 * It determines which page to render based on current state and user authentication.
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './contexts/AuthContext';
import type { ShopProduct } from './types';

function App() {
  // Access auth state to protect routes and customize UI
  const { authStep, isAuthenticated, isAdmin } = useAuth();
  
  // Simple state-based routing instead of a full router library
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  // The main navigator function - handles page switching and basic route protection
  const navigate = (page: string, product?: ShopProduct) => {
    // Define pages that require login
    const isProtected = ['shop', 'profile', 'cart', 'checkout', 'product-detail', 'admin'].includes(page);
    
    // If we're viewing a specific product, save it to state
    if (product) {
      setSelectedProduct(product);
    }

    // Kick 'em to sign in if they try to access protected pages without a badge
    if (isProtected && !isAuthenticated) {
      setCurrentPage('signin');
    } else {
      // Double check admin privileges
      if (page === 'admin' && !isAdmin) {
        setCurrentPage('home'); // Nice try, but no
      } else {
        setCurrentPage(page);
      }
    }
  };

  // Scroll to top whenever the page changes so it feels like a fresh load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, authStep]);

  // This switch statement decides what gets painted on the screen
  const renderContent = () => {
    // Priority 1: Handle authentication flows (verification, password reset)
    switch (authStep) {
      case 'awaiting-verification':
        return <VerifyEmailPage setCurrentPage={navigate} />;
      case 'awaiting-password-reset':
        return <ResetPasswordPage />;
    }
    
    // Priority 2: Standard page navigation
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={navigate} />;
      case 'shop':
        return <ShopPage onProductSelect={(product) => navigate('product-detail', product)} />;
      case 'product-detail':
        // Show the detail page if we have a product, otherwise fallback to shop
        return selectedProduct ? <ProductDetailPage product={selectedProduct} /> : <ShopPage onProductSelect={(product) => navigate('product-detail', product)} />;
      case 'cart':
        return <CartPage setCurrentPage={navigate} />;
      case 'checkout':
        return <CheckoutPage setCurrentPage={navigate} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'signin':
        return <SignInPage setCurrentPage={navigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage setCurrentPage={navigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage setCurrentPage={navigate} />;
      default:
        return <HomePage setCurrentPage={navigate} />;
    }
  };

  return (
    <div className="bg-brand-orange text-white min-h-screen font-quicksand overflow-x-hidden relative isolate">
      {/* Cool background effect using CSS gradients */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.22)_0%,_transparent_70%)] pointer-events-none" 
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hide header/footer on admin page for a cleaner dashboard look */}
        {currentPage !== 'admin' && <Header currentPage={currentPage} setCurrentPage={navigate} />}
        <main className="flex-grow">
          {renderContent()}
        </main>
        {currentPage !== 'admin' && <Footer setCurrentPage={navigate} />}
      </div>
    </div>
  );
}

export default App;