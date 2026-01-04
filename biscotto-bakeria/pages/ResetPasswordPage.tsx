import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, pendingUserEmail, pendingResetCode } = useAuth();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const result = resetPassword(code, newPassword);
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.message || 'Failed to reset password.');
    }
  };
  
  if (isSuccess) {
    return (
      <section className="py-20 md:py-28 text-center">
        <div className="w-full max-w-lg mx-auto bg-white/10 p-10 rounded-xl">
          <h1 className="font-playwrite text-3xl mb-4">Password Reset!</h1>
          <p>Your password has been successfully updated. You can now sign in with your new password.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reset-password" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-gray-800">
          <h1 className="font-playwrite text-3xl text-center mb-4">
            Reset Your Password
          </h1>
          <p className="text-center mb-6">A recovery code was sent to {pendingUserEmail}. For this demo, the code is <strong className="text-brand-orange">{pendingResetCode}</strong>.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Recovery Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full bg-gray-100 p-4 text-lg border rounded-lg focus:ring-brand-orange"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-gray-100 p-4 text-lg border rounded-lg focus:ring-brand-orange"
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider"
            >
              Set New Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;