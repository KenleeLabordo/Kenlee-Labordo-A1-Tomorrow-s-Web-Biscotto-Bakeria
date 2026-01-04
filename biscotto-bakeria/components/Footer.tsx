
import React from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../constants';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="text-center py-12 px-6">
      <div className="flex justify-center items-center gap-6 mb-8">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.href}
            aria-label={social.name}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-brand-cream transition-transform duration-300 hover:scale-110"
          >
            <social.icon className="w-8 h-8" />
          </a>
        ))}
      </div>
      <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-8">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <button
              onClick={() => setCurrentPage(link.href)}
              className="text-lg hover:text-brand-cream transition bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-white/70">&copy; 2024 Biscotto Bakeria. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
