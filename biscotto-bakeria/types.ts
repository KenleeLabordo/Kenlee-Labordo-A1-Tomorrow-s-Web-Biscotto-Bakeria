
/**
 * TypeScript Type Definitions
 */

import type React from 'react';

export interface NavLink {
  href: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Testimonial {
  id: number;
  rating: number;
  text: string;
  author: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface HomeSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredProductIds: number[];
  collageImages: string[]; // Expects 9 images for the home collage
}

export interface AboutSettings {
  founderImage: string;
  founderQuote: string;
  collageImages: string[]; // Expects 4 images for the about collage
  flagshipImage: string;
}

export interface ShopProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
}

export interface CartItem extends ShopProduct {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  password?: string;
  isVerified?: boolean;
  role?: 'admin' | 'customer';
}
