// api/index.js
// This file connects your existing backend to Vercel serverless

// Import your existing backend
// Change 'server' to match your actual file name (server.js, app.js, index.js, etc.)
const app = require('../biscotto-backend/server');

// That's it! Just export it for Vercel
module.exports = app;
