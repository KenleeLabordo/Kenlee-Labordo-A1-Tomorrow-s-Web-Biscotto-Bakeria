import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SignInPageProps {
  setCurrentPage: (page: string) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ setCurrentPage }) => {
  const { signup, login } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(
    () => (localStorage.getItem('auth_mode') as 'signin' | 'signup') || 'signin'
  );
  
  const [name, setName] = useState(() => localStorage.getItem('auth_form_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('auth_form_email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('auth_mode', authMode);
    localStorage.setItem('auth_form_email', email);
    if (authMode === 'signup') {
      localStorage.setItem('auth_form_name', name);
    } else {
      localStorage.removeItem('auth_form_name');
    }
  }, [authMode, name, email]);

  // Clear field-specific error when user starts typing
  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setSuccessMessage('');

    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  // Frontend validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Signup-specific validations
    if (authMode === 'signup') {
      // Name validation
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      }

      // Confirm password validation
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (authMode === 'signin') {
        result = await login(email, password);
      } else {
        result = await signup(email, name, password);
      }

      if (!result.success) {
        setErrors({ general: result.message || 'An error occurred. Please try again.' });
      } else {
        // Clear persisted form state on success
        localStorage.removeItem('auth_mode');
        localStorage.removeItem('auth_form_name');
        localStorage.removeItem('auth_form_email');

        if (authMode === 'signin') {
          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => {
            if (result.role === 'admin') {
              setCurrentPage('admin');
            } else {
              setCurrentPage('shop');
            }
          }, 1000);
        } else {
          setSuccessMessage('Account created! Please check for verification code.');
          // App component will handle navigation to verification
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = authMode === 'signin' ? 'signup' : 'signin';
    setAuthMode(newMode);
    setErrors({});
    setSuccessMessage('');
    
    if (newMode === 'signin') {
      setName('');
    }
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <section id="signin" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12 flex justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl">
            <h1 className="font-playwrite text-4xl text-center mb-8 text-gray-800">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Signup only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                      errors.name 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="Email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="Password"
                  placeholder={authMode === 'signup' ? 'Minimum 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                    errors.password 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
                {authMode === 'signup' && !errors.password && (
                  <p className="mt-2 text-xs text-gray-500">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="ConfirmPassword"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot Password (Sign In only) */}
              {authMode === 'signin' && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="flex items-center cursor-pointer hover:text-gray-800 transition">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange cursor-pointer" 
                    />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage('forgot-password')} 
                    className="font-medium hover:text-brand-orange transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  authMode === 'signin' ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            {/* Password Requirements Info (Signup only) */}
            {authMode === 'signup' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-6">
                  <li className="flex items-center gap-2">
                    <span className={password.length >= 6 ? 'text-green-600' : ''}>
                      {password.length >= 6 ? '✓' : '•'} At least 6 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={confirmPassword && password === confirmPassword ? 'text-green-600' : ''}>
                      {confirmPassword && password === confirmPassword ? '✓' : '•'} Passwords must match
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <button 
              onClick={toggleMode} 
              className="text-white hover:text-brand-cream transition bg-transparent border-none font-medium"
            >
              {authMode === 'signin' 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;