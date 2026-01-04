
/**
 * Featured Products Carousel
 * 
 * A 3D-style rotating carousel component to showcase specific items on the home page.
 * Displays products selected in the Admin panel.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import type { ShopProduct } from '../types';

interface CarouselItemProps {
  product: ShopProduct;
  offset: number;
  totalItems: number;
  spacing: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ product, offset, totalItems, spacing }) => {
  const absOffset = Math.abs(offset);
  const zIndex = totalItems - absOffset;
  
  const itemStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: `rotateY(${-10 * offset}deg) translateX(${-spacing * offset}px) scale(${1 - absOffset * 0.2})`,
    zIndex: Math.round(zIndex * 10),
    filter: `blur(${absOffset * 2}px) brightness(${1 - absOffset * 0.3})`,
    opacity: absOffset > 2 ? 0 : absOffset > 1 ? 0.4 : 1,
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    pointerEvents: absOffset !== 0 ? 'none' : 'auto',
  };

  return (
    <div style={itemStyle} className="group">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full overflow-hidden flex flex-col border border-white/20">
        <div className="h-[70%] sm:h-[75%] overflow-hidden relative">
          <img 
            src={product.image || 'https://via.placeholder.com/320x420'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {absOffset === 0 && (
            <div className="absolute top-4 right-4 bg-brand-orange text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              CHEF'S PICK
            </div>
          )}
        </div>
        <div className="h-[30%] sm:h-[25%] flex flex-col items-center justify-center p-3 sm:p-4 bg-white">
          <span className="text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
            {product.category}
          </span>
          <h2 className="name font-playwrite font-bold text-lg sm:text-xl text-center text-gray-800 truncate w-full px-2">
            {product.name}
          </h2>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts: React.FC = () => {
const { products, homeSettings } = useProducts();  const [position, setPosition] = useState(0); 
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const featuredProducts = useMemo(() => {
    return homeSettings.featuredProductIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as ShopProduct[];
  }, [products, homeSettings.featuredProductIds]);

  const totalItems = featuredProducts.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSpacing = () => {
    if (windowWidth < 480) return 130;
    if (windowWidth < 640) return 180;
    if (windowWidth < 768) return 220;
    if (windowWidth < 1024) return 280;
    return 340;
  };

  const spacing = getSpacing();

  const handlePrev = useCallback(() => {
    setPosition((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setPosition((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);
  
  if (totalItems === 0) return null;

  return (
    <section id="featured" className="py-20 md:py-32 overflow-hidden bg-brand-orange/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="font-playwrite text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Chef's Favorites
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg px-4">
            Curated selection of our finest artisanal goods. Freshly chosen for you.
          </p>
        </div>
        
        <div className="relative h-[400px] sm:h-[500px] flex items-center justify-center">
          <div 
            className="relative h-[320px] w-[240px] sm:h-[420px] sm:w-[320px]" 
            style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
          >
            {featuredProducts.map((product, index) => (
              <CarouselItem 
                key={product.id}
                product={product}
                offset={index - position}
                totalItems={totalItems}
                spacing={spacing}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10">
            <button onClick={handlePrev} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl transition-all hover:bg-white hover:text-brand-orange shadow-xl">
                ❮
            </button>
            <div className="flex gap-3">
              {featuredProducts.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setPosition(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${idx === position ? 'w-10 bg-white' : 'w-2.5 bg-white/30'}`}
                />
              ))}
            </div>
            <button onClick={handleNext} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl transition-all hover:bg-white hover:text-brand-orange shadow-xl">
                ❯
            </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
