# Biscotto Bakeria - MongoDB Backend Setup Guide

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB Atlas Account** (Free) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
3. **Cloudinary Account** (Free) - [Sign up](https://cloudinary.com/users/register/free)

---

## 🚀 Quick Start

### Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/biscotto-bakeria` after `.net/` and before `?`

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/biscotto-bakeria?retryWrites=true&w=majority
```

### Step 2: Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy these three values:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Backend Installation

1. **Navigate to backend folder:**
```bash
cd biscotto-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

4. **Edit `.env` file** with your credentials:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/biscotto-bakeria?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-here
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

5. **Start the backend server:**
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Default admin user created: admin@biscotto.com / admin123
🚀 Server running on port 5000
```

---

## 🔐 Default Admin Account

Once the server starts, you can login with:
- **Email:** admin@biscotto.com
- **Password:** admin123

⚠️ **Important:** Change this password in production!

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update profile (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Settings
- `GET /api/settings/home` - Get home page settings
- `PUT /api/settings/home` - Update home settings (admin only)
- `GET /api/settings/about` - Get about page settings
- `PUT /api/settings/about` - Update about settings (admin only)

---

## 🧪 Testing the API

Use [Postman](https://www.postman.com/downloads/) or Thunder Client (VS Code extension)

### Example: Login Request
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@biscotto.com",
  "password": "admin123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@biscotto.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## 📁 Project Structure

```
biscotto-backend/
├── server/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── cloudinary.js     # Image upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── settingsController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Settings.js
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       └── settingsRoutes.js
├── server.js                 # Main entry point
├── package.json
└── .env                      # Your environment variables
```

---

## 🔄 Next Steps

1. ✅ Backend is running
2. 📱 Update frontend to use API (see `FRONTEND_INTEGRATION.md`)
3. 🖼️ Test image uploads
4. 👤 Create admin accounts
5. 🛍️ Add products via admin panel

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Verify connection string is correct
- Check network/firewall settings

### "Cloudinary upload failed"
- Verify Cloudinary credentials in `.env`
- Check image file size (max 5MB)
- Ensure proper file format (jpg, png, gif, webp)

### "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another available port
- Kill the process using port 5000

---

## 📝 Notes

- The backend runs on `http://localhost:5000`
- Frontend should run on `http://localhost:5173`
- JWT tokens expire after 7 days
- Verification codes are logged to console (in production, send via email)
- Images are stored in Cloudinary, not MongoDB
