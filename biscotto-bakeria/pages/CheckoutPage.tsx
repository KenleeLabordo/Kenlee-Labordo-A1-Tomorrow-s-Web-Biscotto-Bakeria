import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface CheckoutPageProps {
  setCurrentPage: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentPage }) => {
  const { cart, clearCart } = useCart();
  
  // State for form fields to support controlled inputs and programmatic updates
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    card: ''
  });
  
  // State for location fetching status messages
  const [locationStatus, setLocationStatus] = useState('');

  if (cart.length === 0) {
    return (
        <section className="py-20 md:py-28 text-center">
            <h1 className="font-playwrite text-4xl mb-4">You have no items in your basket</h1>
            <button onClick={() => setCurrentPage('shop')} className="bg-white text-brand-orange font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105">
                Continue Shopping
            </button>
        </section>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + taxes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Logic to fetch user location and reverse geocode it to an address
  const handleGetLocation = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setLocationStatus('Requesting location permission...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocationStatus('Fetching address details...');

        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            const addressObj = data.address;

            if (addressObj) {
                // Construct a readable string from the API response
                const street = addressObj.road || '';
                const city = addressObj.city || addressObj.town || addressObj.village || '';
                const state = addressObj.state || '';
                const zip = addressObj.postcode || '';
                const country = addressObj.country || '';

                // Join available parts with comma
                const fullAddress = [street, city, state, zip, country].filter(Boolean).join(', ');
                
                setFormData(prev => ({ ...prev, address: fullAddress }));
                setLocationStatus('Location confirmed!');
            } else {
                setLocationStatus('Could not determine address from coordinates.');
            }
        } catch (error) {
            console.error(error);
            setLocationStatus('Error fetching address details.');
        }
      },
      (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setLocationStatus("Permission denied by user.");
                break;
            case error.POSITION_UNAVAILABLE:
                setLocationStatus("Location info unavailable.");
                break;
            case error.TIMEOUT:
                setLocationStatus("Location request timed out.");
                break;
            default:
                setLocationStatus("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Thank you for your order, ${formData.name}! (This is a demo)`);
    clearCart();
    setCurrentPage('home');
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12">
        <h1 className="font-playwrite text-4xl md:text-5xl text-center mb-12">
          Checkout
        </h1>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Order Summary */}
          <div className="w-full lg:w-1/2 bg-white/10 p-8 rounded-2xl h-fit">
            <h2 className="text-3xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <p>{item.name} x {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="my-6 border-white/20" />
            <div className="space-y-2">
              <div className="flex justify-between"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
              <div className="flex justify-between"><p>Taxes (8%)</p><p>${taxes.toFixed(2)}</p></div>
              <div className="flex justify-between text-2xl font-bold"><p>Total</p><p>${total.toFixed(2)}</p></div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="w-full lg:w-1/2 bg-white text-gray-800 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Shipping & Payment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        required 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange" 
                    />
                </div>
                
                <div className="mb-4">
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange" 
                    />
                </div>

                <div className="mb-1">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            name="address"
                            placeholder="Shipping Address" 
                            required 
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange" 
                        />
                        <button 
                            type="button" 
                            onClick={handleGetLocation}
                            className="bg-blue-600 text-white p-3 rounded-md font-bold whitespace-nowrap hover:bg-blue-700 transition"
                            title="Use my current location"
                        >
                            📍 Locate Me
                        </button>
                    </div>
                </div>
                
                {/* Location Status Message */}
                <div className="mb-4 min-h-[20px]">
                    {locationStatus && (
                        <p className={`text-sm italic ${locationStatus.includes('Error') || locationStatus.includes('denied') ? 'text-red-500' : 'text-blue-600'}`}>
                            {locationStatus}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <input 
                        type="text" 
                        name="card"
                        placeholder="Credit Card Number" 
                        required 
                        value={formData.card}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange" 
                    />
                </div>

                <button type="submit" className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-orange-600 shadow-lg hover:shadow-xl">
                    Place Order
                </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;