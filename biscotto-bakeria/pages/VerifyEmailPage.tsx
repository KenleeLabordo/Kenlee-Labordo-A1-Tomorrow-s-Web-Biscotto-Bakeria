
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface VerifyEmailPageProps {
  setCurrentPage: (page: string) => void;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ setCurrentPage }) => {
  const { verifyEmail, pendingUserEmail, pendingVerificationCode } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const result = verifyEmail(code);
    if (!result.success) {
      setError(result.message || 'Verification failed.');
    } else {
      setCurrentPage('shop');
    }
  };

  return (
    <section id="verify-email" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-gray-800 text-center">
          <h1 className="font-playwrite text-3xl mb-4">
            Verify Your Email
          </h1>
          <p className="mb-6">A verification code has been sent to {pendingUserEmail}. For this demo, the code is <strong className="text-brand-orange">{pendingVerificationCode}</strong>.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                name="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full bg-gray-100 text-gray-800 p-4 text-lg text-center tracking-[0.5em] border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange transition"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-orange-600"
            >
              Verify & Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailPage;