import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import type { ShopProduct } from '../types';

interface ShopPageProps {
  onProductSelect: (product: ShopProduct) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onProductSelect }) => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Shop</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Category Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Categories
              </h2>
              
              <div className="space-y-2">
                {categories.map(category => {
                  const count = category === 'All' 
                    ? products.length 
                    : products.filter(p => p.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-between group ${
                        selectedCategory === category
                          ? 'bg-white text-brand-orange shadow-lg scale-105'
                          : 'bg-white/5 hover:bg-white/10 hover:scale-102'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedCategory === category && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {category}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category
                          ? 'bg-brand-orange text-white'
                          : 'bg-white/20'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Summary */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/70">
                  Showing <span className="font-bold text-white">{filteredProducts.length}</span> of <span className="font-bold text-white">{products.length}</span> products
                </p>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filter Badge */}
            {selectedCategory !== 'All' && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-lg">Filtered by:</span>
                <div className="bg-white text-brand-orange px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:bg-brand-orange hover:text-white rounded-full p-1 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => onProductSelect(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl">
                <svg className="w-20 h-20 mx-auto mb-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-2xl font-bold mb-4">No products found</p>
                <p className="text-white/70 mb-6">Try selecting a different category</p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="bg-white text-brand-orange font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;