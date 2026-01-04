import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser({ name });
    setIsEditing(false);
  };
  
  if (!user) {
    return null; // Should be redirected by App.tsx logic
  }

  return (
    <section id="profile" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12">
        <h1 className="font-playwrite text-4xl md:text-5xl text-center mb-16">
          My Profile
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Panel: Navigation */}
          <div className="md:col-span-1">
             <div className="bg-white/10 p-6 rounded-xl">
               <h2 className="font-bold text-2xl mb-4 text-white">Account</h2>
                <ul>
                  <li><button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition">Settings</button></li>
                  <li><button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition">Privacy Policy</button></li>
                </ul>
             </div>
          </div>

          {/* Right Panel: Content */}
          <div className="md:col-span-2 bg-white text-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="font-playwrite text-3xl mb-6">User Details</h2>
            {!isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-500 font-bold mb-1">Name</label>
                  <p className="text-xl">{user.name}</p>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-500 font-bold mb-1">Email</label>
                  <p className="text-xl">{user.email}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="bg-brand-orange text-white font-bold py-2 px-6 rounded-lg transition hover:bg-orange-600">
                  Edit Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-gray-500 font-bold mb-1" htmlFor="name">Name</label>
                   <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-100 text-gray-800 p-3 text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange transition"
                  />
                </div>
                 <div className="mb-6">
                  <label className="block text-gray-500 font-bold mb-1">Email</label>
                  <p className="text-xl text-gray-500">{user.email} (cannot be changed)</p>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-green-700">
                    Save
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setName(user.name); }} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
