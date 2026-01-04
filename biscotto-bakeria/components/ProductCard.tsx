import React from 'react';
import type { ShopProduct } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: ShopProduct;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const isAvailable = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick when adding to cart
    addToCart(product);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {/* Stock Badge */}
        {!isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Out of Stock
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-bold">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-white truncate">
          {product.name}
        </h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-white/60">
              {isAvailable ? `${product.stock} in stock` : 'Unavailable'}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="bg-white text-brand-orange font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-brand-orange hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600"
          >
            {isAvailable ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;