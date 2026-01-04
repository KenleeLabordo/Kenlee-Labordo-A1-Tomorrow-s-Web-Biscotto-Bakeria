# Quick Setup Guide

## 🚀 5-Minute Setup

### 1. Get MongoDB URI
- Go to: https://cloud.mongodb.com/
- Create free cluster
- Click "Connect" → "Connect your application"
- Copy connection string

### 2. Get Cloudinary Credentials
- Go to: https://cloudinary.com/console
- Copy: Cloud Name, API Key, API Secret

### 3. Setup Backend

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
# OR use any text editor
```

### 4. Start Backend

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Default admin user created: admin@biscotto.com / admin123
🚀 Server running on port 5000
```

### 5. Test API

Open browser: http://localhost:5000/api/health

Should see:
```json
{
  "status": "OK",
  "message": "Biscotto Bakeria API is running"
}
```

---

## 🔑 Credentials Template

Copy this and fill in your values:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.XXXXX.mongodb.net/biscotto-bakeria?retryWrites=true&w=majority

# JWT Secret (generate random string)
JWT_SECRET=use-a-random-string-here-min-32-characters

# Server
PORT=5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected successfully
- [ ] Admin user created
- [ ] Health check endpoint works
- [ ] Ready to integrate frontend!

---

## 🆘 Quick Troubleshooting

**MongoDB connection fails:**
```bash
# Check if IP is whitelisted in MongoDB Atlas
# Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
```

**Port 5000 in use:**
```env
# Change PORT in .env to 5001
PORT=5001
```

**Cloudinary errors:**
```bash
# Verify credentials are correct
# No spaces in .env values
# No quotes needed around values
```

---

## 📚 Next Steps

1. ✅ Backend running
2. 📱 See `FRONTEND_INTEGRATION.md` to connect your React app
3. 🧪 Test with admin login: admin@biscotto.com / admin123

---

## 🎯 Project Structure

```
biscotto-backend/
├── server/
│   ├── config/         # Database & Cloudinary config
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── middleware/     # Auth middleware
│   └── routes/         # API routes
├── server.js           # Main entry point
├── package.json
├── .env               # Your secrets (create this)
└── .env.example       # Template
```
