# Biscotto Bakeria

## Overview
A React + TypeScript bakery e-commerce application built with Vite. Features a full product catalog, shopping cart, user authentication, admin dashboard, and an AI image service integration.

## Recent Fixes (Session Dec 28, 2025)
- Fixed Vite configuration: Changed port from 3000 to 5000, enabled allowedHosts for Replit iframe support
- Fixed ProductContext.tsx: Removed broken/duplicate code at end of file that referenced undefined state
- Cleaned up package.json: Removed unnecessary backend dependencies (express, mongoose, nodemailer, cors, etc.) - frontend only
- Created replit.md for documentation

## Project Structure
```
biscotto-bakeria/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── icons/          # Icon components
│   └── ...other components
├── contexts/           # React context for state management
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ProductContext.tsx
├── pages/              # Page components
├── services/           # Service functions
├── App.tsx             # Main app routing
├── index.tsx           # Entry point
├── types.ts            # TypeScript definitions
├── constants.ts        # Static data
└── vite.config.ts      # Vite configuration
```

## Key Features
- User authentication with email verification
- Product catalog with categories
- Shopping cart
- Admin dashboard
- Responsive design with Tailwind CSS

## Dependencies
- React 19.2
- React DOM 19.2
- Vite 6.2 (dev)
- TypeScript (dev)
