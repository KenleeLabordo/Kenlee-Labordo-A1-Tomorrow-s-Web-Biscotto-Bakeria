
/**
 * Home About Section
 * 
 * Displays a brief history of the bakery founded by Kenlee Labordo
 * and features a visual collage of the bakery's atmosphere.
 */

import React from 'react';
import { useProducts } from '../contexts/ProductContext';

interface HomeAboutSectionProps {
  onLearnMore: () => void;
}

const HomeAboutSection: React.FC<HomeAboutSectionProps> = ({ onLearnMore }) => {
const { homeSettings } = useProducts();
  const imgs = homeSettings.collageImages;

  return (
    <section className="py-20 md:py-32 text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center gap-16">
          
          <div className="w-full max-w-4xl text-center">
            <h2 className="font-playwrite text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
              Our Story
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl leading-relaxed text-brand-cream/90">
                Biscotto Bakeria was formed in 2022 by <strong>Kenlee Labordo</strong> with a simple mission: to bring the warmth of a family kitchen to the world. What started as a small, family-owned business in a modest downtown kitchen quickly turned into a web sensation, capturing the hearts (and stomachs) of foodies everywhere.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-brand-cream/90 font-light">
                We believe that baking is an art form that connects people. Every loaf of bread and every pastry is crafted with love, tradition, and a sprinkle of modern innovation.
              </p>
            </div>
            <button 
              onClick={onLearnMore}
              className="mt-10 bg-white text-brand-orange font-bold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-brand-cream shadow-2xl uppercase tracking-widest text-sm"
            >
              Discover Kenlee's Story
            </button>
          </div>

          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-3 auto-rows-[100px] sm:auto-rows-[140px] md:auto-rows-[180px] lg:auto-rows-[220px] gap-2 sm:gap-4">
              
              {/* Image 0 - Left Top Tall */}
              <div className="col-start-1 row-start-1 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[0]} alt="Artisanal texture" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Image 1 - Left Middle Short */}
              <div className="col-start-1 row-start-3 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[1]} alt="Bakery basket" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 2 - Left Bottom Tall */}
              <div className="col-start-1 row-start-4 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[2]} alt="Raw ingredients" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 3 - Center Top Short */}
              <div className="col-start-2 row-start-1 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg">
                <img src={imgs[3]} alt="Fresh cake" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 4 - Center Middle Centerpiece */}
              <div className="col-start-2 row-start-2 row-span-3 relative rounded-2xl overflow-hidden group shadow-xl z-10">
                 <img src={imgs[4]} alt="Tea and bread" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none" />
              </div>

              {/* Image 5 - Center Bottom Short */}
              <div className="col-start-2 row-start-5 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[5]} alt="Sweet treats" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 6 - Right Top Tall */}
              <div className="col-start-3 row-start-1 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[6]} alt="Shop interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 7 - Right Middle Short */}
              <div className="col-start-3 row-start-3 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg">
                <img src={imgs[7]} alt="Morning spread" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Image 8 - Right Bottom Tall */}
              <div className="col-start-3 row-start-4 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
                 <img src={imgs[8]} alt="Crusty loaf" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutSection;
