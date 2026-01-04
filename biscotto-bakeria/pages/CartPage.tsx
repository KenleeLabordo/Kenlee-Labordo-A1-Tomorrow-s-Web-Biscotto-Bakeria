import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import ConfirmationModal from '../components/ConfirmationModal';

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ setCurrentPage }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveClick = (productId: number) => {
    setItemToRemove(productId);
    setShowModal(true);
  };

  const confirmRemove = () => {
    if (itemToRemove !== null) {
      removeFromCart(itemToRemove);
    }
    setShowModal(false);
    setItemToRemove(null);
  };

  if (cart.length === 0) {
    return (
        <section className="py-20 md:py-28 text-center">
            <h1 className="font-playwrite text-4xl mb-4">Your Basket is Empty</h1>
            <button onClick={() => setCurrentPage('shop')} className="bg-white text-brand-orange font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105">
                Continue Shopping
            </button>
        </section>
    )
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12">
        <h1 className="font-playwrite text-4xl md:text-5xl text-center mb-12">
          Your Shopping Basket
        </h1>
        <div className="bg-white/10 p-8 rounded-2xl">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 border-b border-white/20">
                <div className="flex items-center gap-6 flex-1">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
                  <div>
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-lg">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 text-2xl font-bold bg-white/20 rounded-full">-</button>
                  <span className="text-xl w-10 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 text-2xl font-bold bg-white/20 rounded-full">+</button>
                </div>
                <p className="text-xl font-bold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemoveClick(item.id)} className="text-red-400 hover:text-red-300 font-bold">Remove</button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-8 text-right">
            <h2 className="text-3xl font-bold">Subtotal: ${subtotal.toFixed(2)}</h2>
            <p className="text-white/80 mt-2">Taxes and shipping calculated at checkout.</p>
            <button
                onClick={() => setCurrentPage('checkout')}
                className="mt-6 bg-white text-brand-orange font-bold py-3 px-12 rounded-lg text-xl transition-transform duration-300 hover:scale-105"
            >
                Checkout
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmRemove}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
      />
    </section>
  );
};

export default CartPage;