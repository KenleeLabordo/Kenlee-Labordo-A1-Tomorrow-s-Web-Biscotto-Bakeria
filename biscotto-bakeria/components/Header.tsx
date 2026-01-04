/**
 * Header Component
 * 
 * Displays the top navigation bar, including brand logo, navigation links,
 * cart icon with badge, and user profile menu. Handles responsive mobile menu state.
 */

import React, { useState, useRef, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { MenuIcon, XMarkIcon } from './icons/MenuIcons';
import { useAuth } from '../contexts/AuthContext';
import { ProfileIcon } from './icons/ProfileIcon';
import { CartIcon } from './icons/CartIcon';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  
  // Calculate total items for the cart badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false); // Close mobile menu on selection
  };
  
  const handleLogout = () => {
    logout();
    handleNavClick('home'); // Go home after logout
  };

  // Redirect to login if guest tries to view cart
  const handleCartClick = () => {
    if (isAuthenticated) {
      handleNavClick(totalItems > 0 ? 'cart' : 'checkout');
    } else {
      handleNavClick('signin');
    }
  };

  const profileAction = () => {
    handleNavClick(isAuthenticated ? 'profile' : 'signin');
  };

  // Toggle dropdown on desktop
  const handleDesktopProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileMenuOpen(prev => !prev);
    } else {
      handleNavClick('signin');
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="relative z-50">
      <nav className="flex justify-between items-center px-6 sm:px-12 md:px-20 lg:px-32 py-12 md:py-20">
        <div className="brand cursor-pointer" onClick={() => handleNavClick('home')}>
          <h1 className="font-playwrite font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Biscotto Bakeria
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={`bg-transparent border-none text-xl relative after:content-[''] after:absolute after:bg-white after:h-[3px] after:w-0 after:left-0 after:-bottom-2 after:transition-all after:duration-300 ${
                    currentPage === link.href ? 'after:w-full' : 'hover:after:w-full'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
             <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Shopping Basket"
            >
              <CartIcon className="h-8 w-8 text-white" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button
                id="user-menu-button"
                onClick={handleDesktopProfileClick}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isAuthenticated ? "Open user menu" : "Sign In"}
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <ProfileIcon className="h-8 w-8 text-white" />
              </button>
              {/* Dropdown Menu */}
              {isAuthenticated && isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <button
                    onClick={() => {
                      handleNavClick('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    My Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
                      role="menuitem"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Right side actions */}
        <div className="flex items-center gap-2 lg:hidden">
             <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Shopping Basket"
            >
              <CartIcon className="h-8 w-8 text-white" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={profileAction}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={isAuthenticated ? "User Profile" : "Sign In"}
            >
              <ProfileIcon className="h-8 w-8 text-white" />
            </button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-8 w-8 text-white" />
            </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white text-brand-orange shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-6 mt-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-2xl font-bold bg-transparent border-none"
              >
                {link.label}
              </button>
            </li>
          ))}
          {isAdmin && (
            <li>
              <button
                onClick={() => handleNavClick('admin')}
                className="text-2xl font-bold bg-transparent border-none text-brand-orange"
              >
                Admin Panel
              </button>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="text-lg font-bold bg-brand-orange text-white py-2 px-6 rounded-lg mt-4"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;