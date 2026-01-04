import React from 'react';
import type { ShopProduct } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductDetailPageProps {
  product: ShopProduct;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isAvailable = product.stock > 0;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="bg-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="font-playwrite text-4xl md:text-5xl mb-4 text-white">
              {product.name}
            </h1>
            <p className="text-white/80 text-lg mb-6">
              {product.description}
            </p>
            <div className="flex flex-col items-center md:items-start gap-4 mb-8">
               <p className="text-4xl font-bold text-white">
                ${product.price.toFixed(2)}
              </p>
              <p className={`font-bold text-xl px-4 py-1 rounded-full ${isAvailable ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            <button 
              onClick={() => addToCart(product)}
              disabled={!isAvailable}
              className="bg-white text-brand-orange font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
