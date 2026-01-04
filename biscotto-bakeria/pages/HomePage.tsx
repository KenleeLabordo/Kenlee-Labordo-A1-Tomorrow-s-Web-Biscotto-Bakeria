/**
 * Home Page
 * 
 * The landing page of the application, assembling key components like the Hero section,
 * Featured Products carousel, About/Collage section, Testimonials, and FAQ.
 */

import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';
import HomeAboutSection from '../components/HomeAboutSection';
import FAQSection from '../components/FAQSection';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <>
      <Hero setCurrentPage={setCurrentPage} />
      
      {/* Product Carousel */}
      <FeaturedProducts />

      {/* New About Section with Collage */}
      <HomeAboutSection onLearnMore={() => setCurrentPage('about')} />
      
      {/* Customer Reviews */}
      <Testimonials />
      
      {/* Delivery FAQs */}
      <FAQSection onAskUs={() => setCurrentPage('contact')} />
    </>
  );
};

export default HomePage;