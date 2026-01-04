
/**
 * About Page
 * 
 * Detailed information about the company history, values, and the founder.
 */

import React from 'react';
import { useProducts } from '../contexts/ProductContext';

const AboutPage: React.FC = () => {
  const { aboutSettings } = useProducts();

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-12">
        
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="font-playwrite text-4xl md:text-6xl mb-8 text-white">
            Our Journey
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-6">
             It all began with a simple craving for the perfect croissant. In the heart of 2022, what started as a weekend experiment in a small home kitchen quickly evolved into a culinary movement. Biscotto Bakeria isn't just a bakery; it's a testament to the power of passion, flour, and butter.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
            <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 bg-brand-cream transform translate-x-4 translate-y-4 rounded-2xl -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                <img 
                    src={aboutSettings.founderImage} 
                    alt="Kenlee Labordo, Founder" 
                    className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
            </div>
            <div className="w-full md:w-1/2 text-white">
                <h2 className="font-playwrite text-4xl md:text-5xl mb-3">Meet Kenlee</h2>
                <p className="text-brand-cream font-bold text-xl mb-8 uppercase tracking-widest border-b border-white/20 pb-4 inline-block">
                    Founder & Head Baker
                </p>
                <div className="space-y-6 text-lg leading-relaxed opacity-95 font-quicksand">
                    <p>
                        <strong>Kenlee Labordo</strong> never intended to become a viral sensation. In 2022, seeking a creative outlet from the daily grind, Kenlee began filming the meditative process of laminating dough.
                    </p>
                    <p className="italic text-xl border-l-4 border-brand-cream pl-4 my-6 font-playwrite">
                        "{aboutSettings.founderQuote}"
                    </p>
                    <p>
                        From those humble beginnings, Kenlee transitioned to our current flagship location. Despite the growth, Kenlee can still be found in the back every morning at 4:00 AM, ensuring every batch meets the "Biscotto Standard."
                    </p>
                </div>
            </div>
        </div>

        <div className="mb-32">
            <h2 className="font-playwrite text-4xl text-center mb-12 text-white">Behind the Scenes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-[1.02]">
                    <img src={aboutSettings.collageImages[0]} alt="Action shot" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-[1.02]">
                     <img src={aboutSettings.collageImages[1]} alt="Ingredients" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-2 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-[1.02]">
                     <img src={aboutSettings.collageImages[2]} alt="Oven bake" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-[1.02]">
                     <img src={aboutSettings.collageImages[3]} alt="Final product" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800 mb-32">
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl mb-6">🍞</div>
            <h3 className="font-bold text-2xl mb-4 text-brand-orange">Artisan Quality</h3>
            <p className="text-lg text-gray-600">Every dough is rested, folded, and baked to the exact second for that perfect crunch.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl mb-6">❤️</div>
            <h3 className="font-bold text-2xl mb-4 text-brand-orange">Family Roots</h3>
            <p className="text-lg text-gray-600">We treat every customer like extended family. You're not just buying bread.</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl mb-6">🌱</div>
            <h3 className="font-bold text-2xl mb-4 text-brand-orange">Locally Sourced</h3>
            <p className="text-lg text-gray-600">Our flour, eggs, and dairy come from within 50 miles of our kitchen.</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-20">
            <div className="bg-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img 
                        src={aboutSettings.flagshipImage} 
                        alt="Biscotto Bakeria Location" 
                        className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-brand-orange/20 mix-blend-multiply"></div>
                </div>
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-white">
                    <h3 className="font-playwrite text-4xl mb-6">Visit Our Flagship</h3>
                    <div className="space-y-6 text-lg">
                        <div className="flex items-start gap-4">
                            <span className="text-2xl">📍</span>
                            <address className="not-italic">
                                123 Baker's Street<br/>
                                Downtown District<br/>
                                Cityville, ST 90210
                            </address>
                        </div>
                         <div className="flex items-start gap-4">
                            <span className="text-2xl">⏰</span>
                            <div>
                                <p>Mon - Fri: 6:00 AM - 8:00 PM</p>
                                <p>Sat - Sun: 7:00 AM - 9:00 PM</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-8 self-start border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-brand-orange transition-colors">
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
