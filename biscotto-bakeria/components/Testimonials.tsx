
import React from 'react';
import { TESTIMONIALS } from '../constants';
import { StarIcon, StarHalfIcon } from './icons/StarIcons';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalfIcon key="half" className="w-5 h-5 text-yellow-400" />);
  }

  return <div className="flex justify-center mb-3">{stars}</div>;
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-12">
        <h1 className="font-playwrite text-4xl md:text-5xl text-center mb-16">
          Testimonials
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white text-gray-800 rounded-xl p-8 text-center shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
            >
              <StarRating rating={testimonial.rating} />
              <h2 className="font-playwrite text-xl font-medium mb-2">
                "{testimonial.text}"
              </h2>
              <p className="text-gray-500 italic">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
