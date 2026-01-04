
/**
 * Application Constants
 * 
 * Stores static data used across the app, including navigation links,
 * mock product data, testimonials, social links, and FAQs.
 */

import type { NavLink, Product, Testimonial, SocialLink, ShopProduct } from './types';
import { FacebookIcon, InstagramIcon, XIcon, GithubIcon } from './components/icons/SocialIcons';

export const NAV_LINKS: NavLink[] = [
  { href: "home", label: "Home" },
  { href: "shop", label: "Shop" },
  { href: "about", label: "About" },
  { href: "contact", label: "Contact" },
];

export const FEATURED_PRODUCTS: Product[] = [
  { id: 3, name: "Croissants", imageUrl: "https://picsum.photos/seed/croissant/800/600" },
  { id: 12, name: "Cinnamon Roll", imageUrl: "https://picsum.photos/seed/cinnamon/800/600" },
  { id: 1, name: "Spanish Bread", imageUrl: "https://picsum.photos/seed/spanish/800/600" },
  { id: 2, name: "Empanada", imageUrl: "https://picsum.photos/seed/empanada/800/600" },
  { id: 9, name: "Macaron", imageUrl: "https://picsum.photos/seed/macaron/800/600" },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, rating: 4.5, text: "Spectacular!", author: "Michellin" },
  { id: 2, rating: 5, text: "Bakery Of The Year", author: "The New York Times" },
  { id: 3, rating: 4.5, text: "Phenomenal Quality", author: "Gordon Ramsey" },
  { id: 4, rating: 5, text: "Best Croissants in the Game", author: "Guinness World Records" },
  { id: 5, rating: 4.5, text: "Exquisite Atmosphere", author: "Time Magazine" },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { name: 'Facebook', href: '#', icon: FacebookIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'X', href: '#', icon: XIcon },
    { name: 'Github', href: '#', icon: GithubIcon },
];

export const FAQ_ITEMS = [
  {
    question: "Do you offer delivery services?",
    answer: "Yes! We deliver within a 15-mile radius of our bakery. For orders over $50, delivery is free. For smaller orders, a flat $5 fee applies."
  },
  {
    question: "Are your products gluten-free?",
    answer: "We have a specific selection of gluten-free pastries and breads. Please check the 'Gluten-Free' category in our shop."
  }
];

export const SHOP_PRODUCTS: ShopProduct[] = [
    // --- PASTRY ---
    { id: 1, name: "Spanish Bread", price: 2.5, category: "Pastry", stock: 50, image: "", description: "A soft, sweet bread roll with a buttery, sugary filling. A classic Filipino favorite perfect for a snack or breakfast." },
    { id: 2, name: "Empanada", price: 3.5, category: "Pastry", stock: 40, image: "", description: "A savory turnover filled with seasoned meat and vegetables, wrapped in a flaky, golden-brown crust." },
    { id: 3, name: "Cheese Manakeesh", price: 4.5, category: "Pastry", stock: 30, image: "", description: "A popular Levantine flatbread topped with a delicious blend of melted cheeses and herbs." },
    { id: 4, name: "Croissants", price: 3.75, category: "Pastry", stock: 100, image: "", description: "Our signature item: a buttery, flaky, and light pastry known for its distinctive crescent shape." },
    { id: 5, name: "Macaron", price: 3.0, category: "Pastry", stock: 75, image: "", description: "A delicate French confection made with almond flour, with a crisp shell and a chewy, flavorful filling." },
    { id: 6, name: "Sausage Rolls", price: 4.25, category: "Pastry", stock: 45, image: "", description: "Savory sausage meat wrapped in a flaky, buttery puff pastry and baked to golden perfection." },
    { id: 7, name: "Cinnamon Roll", price: 5.0, category: "Pastry", stock: 20, image: "", description: "A sweet roll filled with a cinnamon-sugar mixture and topped with a decadent cream cheese frosting." },
    { id: 8, name: "Pain au Chocolat", price: 4.0, category: "Pastry", stock: 30, image: "", description: "The chocolatey cousin of the croissant. Flaky layers wrapped around rich, dark chocolate batons." },
    { id: 9, name: "Fruit Danish", price: 4.25, category: "Pastry", stock: 25, image: "", description: "A light, puff pastry base topped with vanilla custard and fresh seasonal fruits." },

    // --- BREAD ---
    { id: 10, name: "Buttered Naan", price: 3.5, category: "Bread", stock: 20, image: "", description: "A soft, leavened Indian flatbread, freshly baked in a tandoor and brushed with rich, melted butter." },
    { id: 11, name: "Pandesal", price: 2.25, category: "Bread", stock: 80, image: "", description: "A classic Filipino bread roll that's soft, airy, and slightly sweet, coated with fine breadcrumbs." },
    { id: 12, name: "Baguette", price: 4.5, category: "Bread", stock: 35, image: "", description: "A long, thin loaf of French bread with a cri   sp crust and a soft, chewy interior." },
    { id: 13, name: "Sourdough Loaf", price: 7.5, category: "Bread", stock: 15, image: "", description: "Naturally leavened bread with a thick, crunchy crust and a tangy, open-crumb interior." },
    { id: 14, name: "Focaccia", price: 5.5, category: "Bread", stock: 12, image: "", description: "An Italian flatbread drizzled with olive oil and topped with rosemary and sea salt." },
    { id: 15, name: "Ciabatta", price: 4.5, category: "Bread", stock: 18, image: "", description: "A rustic Italian white bread with a crispy crust and a very porous, chewy texture." },
    { id: 16, name: "Rye Bread", price: 6.5, category: "Bread", stock: 10, image: "", description: "A dense, dark bread made with rye flour, featuring a deep, earthy flavor profile." },
    { id: 17, name: "Multigrain Loaf", price: 6.0, category: "Bread", stock: 20, image: "", description: "Packed with seeds and grains for a healthy, hearty, and nutty tasting bread." },
    { id: 18, name: "Brioche Bun", price: 2.0, category: "Bread", stock: 50, image: "", description: "A highly enriched bread made with plenty of butter and eggs, resulting in a tender, golden crumb." },

    // --- OTHER ---
    { id: 19, name: "Bacon-Egg Bagel", price: 6.5, category: "Sandwiches", stock: 25, image: "", description: "A hearty breakfast sandwich with crispy bacon, a fluffy fried egg, and melted cheese on a toasted bagel." },
    { id: 20, name: "Margarita Pizza", price: 12.0, category: "Pizza", stock: 15, image: "", description: "Freshly baked pizza topped with San Marzano tomatoes, fresh mozzarella, and aromatic basil." },
];
