
/**
 * FAQ Section Component
 * 
 * Renders an accordion-style list of Frequently Asked Questions
 * regarding delivery and service.
 */

import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';

interface FAQSectionProps {
  onAskUs: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onAskUs }) => {
  // Track which FAQ item is currently open (null = all closed)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 text-white">
      <div className="container mx-auto px-6 sm:px-12 max-w-4xl">
        <h1 className="font-playwrite text-4xl md:text-6xl text-center mb-12">
          FAQ
        </h1>

        <div className="space-y-4 mb-16">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="bg-white/10 rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-sm">
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-white/5 transition"
                aria-expanded={openIndex === index}
              >
                <span className="text-xl font-bold font-quicksand">{item.question}</span>
                <span className={`text-2xl font-bold transition-transform duration-300 ${openIndex === index ? 'rotate-45' : 'rotate-0'}`}>
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-white/90 text-lg border-t border-white/10 mt-2">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Ask Us Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mt-12 group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://picsum.photos/id/251/1200/400" 
                    alt="Background pattern" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* White Overlay at 90% */}
            <div className="absolute inset-0 bg-white/90 z-10 transition-opacity duration-500 group-hover:bg-white/95" />

            {/* Content */}
            <div className="relative z-20 py-16 px-8 text-center flex flex-col items-center justify-center">
                <p className="text-gray-800 text-3xl md:text-4xl font-bold mb-8">Still have questions?</p>
                <button 
                    onClick={onAskUs}
                    className="bg-brand-orange text-white font-bold py-4 px-12 rounded-full text-2xl transition-transform duration-300 hover:scale-105 hover:bg-orange-600 shadow-lg"
                >
                    Ask Us
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
