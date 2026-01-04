import React from 'react';
import { useProducts } from '../contexts/ProductContext';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { homeSettings } = useProducts(); // Get homeSettings from context instead of static file

  return (
    <section id="home" className="px-6 sm:px-12 md:px-20 lg:px-32 py-12 md:py-20 lg:py-28 min-h-[85vh] md:min-h-[75vh] flex items-center overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          <div className="text-content w-full lg:w-1/2 text-center lg:text-left animate-fade-in order-2 lg:order-1">
            <h1 className="font-playwrite font-normal text-4xl sm:text-5xl md:text-6xl xl:text-7xl !leading-[1.15] text-white mb-6 md:mb-8">
              {homeSettings.heroTitle.split(',').map((part, i) => (
                i === 1 ? <span key={i} className="italic text-brand-cream decoration-brand-cream/30 underline underline-offset-8">{part}</span> : part
              ))}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl lg:max-w-lg mx-auto lg:mx-0 mb-8 md:mb-12 text-white/90 font-light leading-relaxed">
              {homeSettings.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setCurrentPage('shop')}
                className="w-full sm:w-auto bg-white text-brand-orange font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:bg-brand-cream shadow-2xl active:scale-95"
              >
                Browse Shop
              </button>
              <button 
                onClick={() => {
                   const section = document.getElementById('featured');
                   section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-transparent border-2 border-white/40 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:bg-white/10 hover:border-white active:scale-95"
              >
                Our Favorites
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-6 border border-white/10 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={homeSettings.heroImage} 
                  alt="Golden flaky croissant"
                  className="w-full max-w-[340px] sm:max-w-md lg:max-w-xl h-[450px] object-cover transform transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-brand-cream p-5 rounded-2xl shadow-2xl z-20 rotate-[-8deg] border-2 border-white">
                <p className="text-brand-orange font-bold text-center">
                  <span className="block text-3xl sm:text-4xl leading-none">100%</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black">Artisan Daily</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;