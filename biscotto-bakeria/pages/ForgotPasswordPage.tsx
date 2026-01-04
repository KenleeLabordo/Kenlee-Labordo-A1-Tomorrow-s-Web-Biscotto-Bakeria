import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ForgotPasswordPageProps {
  setCurrentPage: (page: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setCurrentPage }) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const result = requestPasswordReset(email);
    if (result.success) {
        setIsSubmitted(true);
    } else {
        setError(result.message || 'An error occurred.');
    }
  };

  if(isSubmitted) {
    return (
        <section className="py-20 md:py-28 text-center">
            <div className="w-full max-w-lg mx-auto bg-white/10 p-10 rounded-xl">
                <h1 className="font-playwrite text-3xl mb-4">Check Your Email</h1>
                <p>If an account exists for {email}, you will receive a password reset code.</p>
            </div>
        </section>
    )
  }

  return (
    <section id="forgot-password" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-gray-800">
          <h1 className="font-playwrite text-3xl text-center mb-4">
            Forgot Password
          </h1>
          <p className="text-center mb-6">Enter your email address and we'll send you a code to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-100 text-gray-800 p-4 text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange transition"
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-orange-600"
            >
              Send Recovery Code
            </button>
          </form>
           <div className="text-center mt-6">
            <button onClick={() => setCurrentPage('signin')} className="text-gray-600 hover:text-brand-orange transition">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;