# Frontend Integration Guide

## 📦 Files to Update in Your React Project

### Step 1: Add Environment Variable

Create a `.env` file in your **frontend root** directory (same level as package.json):

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Copy API Service

1. Create a new folder: `src/services/`
2. Copy `frontend-api-service.js` to `src/services/api.ts`

### Step 3: Update Contexts

Replace your existing context files with the updated versions:

1. **AuthContext.tsx** - Replace with `updated-AuthContext.tsx`
   - Location: `src/contexts/AuthContext.tsx`

2. **ProductContext.tsx** - Replace with `updated-ProductContext.tsx`
   - Location: `src/contexts/ProductContext.tsx`

### Step 4: Update ProductModal

Replace your existing ProductModal:
- Location: `components/admin/ProductModal.tsx`
- Replace with: `updated-ProductModal.tsx`

---

## 🔄 What Changed?

### AuthContext Changes:
- ✅ Now uses backend API instead of localStorage
- ✅ JWT tokens for authentication
- ✅ Real email verification (codes logged to console)
- ✅ Secure password reset flow
- ✅ Async operations with loading states

### ProductContext Changes:
- ✅ Products stored in MongoDB
- ✅ Real-time sync with backend
- ✅ Image uploads to Cloudinary
- ✅ Settings stored in database
- ✅ Loading states for better UX

### ProductModal Changes:
- ✅ File upload support
- ✅ Image preview before upload
- ✅ Support for both file upload and URL
- ✅ Loading states during save
- ✅ Error handling

---

## 🚀 Migration Steps

### Step-by-Step Integration:

#### 1. **Backup Your Current Code**
```bash
# In your project root
git add .
git commit -m "Backup before MongoDB integration"
```

#### 2. **Install New Dependencies** (if needed)
Your current `package.json` already has what you need, but verify:
```bash
npm install
```

#### 3. **Copy Files to Your Project**

```bash
# From biscotto-backend folder, copy to your frontend:

# API Service
cp frontend-api-service.js ../biscotto-bakeria/src/services/api.ts

# Updated Contexts
cp updated-AuthContext.tsx ../biscotto-bakeria/src/contexts/AuthContext.tsx
cp updated-ProductContext.tsx ../biscotto-bakeria/src/contexts/ProductContext.tsx

# Updated Modal
cp updated-ProductModal.tsx ../biscotto-bakeria/components/admin/ProductModal.tsx
```

#### 4. **Create .env File**
In your frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 5. **Test the Integration**

Start both servers:

**Terminal 1 - Backend:**
```bash
cd biscotto-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd biscotto-bakeria
npm run dev
```

---

## 🧪 Testing Checklist

### Authentication Tests:
- [ ] Sign up new user
- [ ] Verify email with code
- [ ] Login with credentials
- [ ] Logout
- [ ] Forgot password flow
- [ ] Reset password with code
- [ ] Admin login (admin@biscotto.com / admin123)

### Product Management Tests:
- [ ] View all products
- [ ] Add new product with file upload
- [ ] Add product with image URL
- [ ] Edit product
- [ ] Delete product
- [ ] Products persist after page refresh

### Admin Panel Tests:
- [ ] Access admin page as admin
- [ ] Can't access admin as regular user
- [ ] Update home settings
- [ ] Update about settings
- [ ] Settings persist after refresh

---

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or "Failed to fetch"

**Solution:**
- Make sure backend is running on port 5000
- Check CORS settings in backend (should allow localhost:5173)
- Verify `.env` file has correct API URL

### Issue: "Unauthorized" or "Token expired"

**Solution:**
- Logout and login again
- Check if JWT_SECRET is set in backend `.env`
- Clear localStorage: `localStorage.clear()` in browser console

### Issue: Image upload fails

**Solution:**
- Verify Cloudinary credentials in backend `.env`
- Check file size (max 5MB)
- Check file format (jpg, png, gif, webp only)
- Look at backend console for error messages

### Issue: Products not showing after refresh

**Solution:**
- Check MongoDB connection
- Verify products exist in database
- Check browser console for errors
- Check backend logs

---

## 📊 Data Migration (Optional)

If you want to migrate your existing localStorage products to MongoDB:

### Option 1: Manual Migration
1. Login as admin
2. Manually add products through admin panel

### Option 2: Bulk Import Script

Create `scripts/migrate-products.js` in backend:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './server/models/Product.js';

dotenv.config();

const PRODUCTS = [
  // Copy your SHOP_PRODUCTS from constants.ts here
];

const migrate = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  for (const product of PRODUCTS) {
    await Product.create({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || `https://picsum.photos/seed/${product.id}/400/300`,
      description: product.description
    });
  }
  
  console.log('Migration complete!');
  process.exit(0);
};

migrate();
```

Run with: `node scripts/migrate-products.js`

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Remove verification/reset codes from API responses
- [ ] Set up email service for real verification emails
- [ ] Enable MongoDB IP whitelist
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for frontend and backend
- [ ] Set secure cookie options
- [ ] Add rate limiting to API
- [ ] Set up backup strategy for MongoDB

---

## 📈 Next Steps

After successful integration:

1. **Email Integration**: Set up SendGrid or similar for real email verification
2. **File Storage**: Configure Cloudinary transformations for optimized images
3. **Caching**: Add Redis for better performance
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)
5. **Deployment**: Deploy to Vercel (frontend) + Railway/Render (backend)

---

## 💡 Pro Tips

1. **Development Workflow:**
   - Keep both terminals visible
   - Use browser DevTools Network tab to debug API calls
   - Check backend console for detailed error messages

2. **Debugging API Calls:**
```javascript
// Add this to see all API requests in console
const apiRequest = async (endpoint, options = {}) => {
  console.log('API Request:', endpoint, options);
  // ... rest of code
};
```

3. **Quick Database Reset:**
```javascript
// In MongoDB Compass or Atlas
db.products.deleteMany({})
db.users.deleteMany({ email: { $ne: 'admin@biscotto.com' } })
db.settings.deleteMany({})
```

---

## 📚 Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 🆘 Need Help?

If you encounter issues:

1. Check backend console logs
2. Check browser console (DevTools)
3. Verify all environment variables are set
4. Make sure MongoDB and Cloudinary credentials are correct
5. Test API endpoints directly with Postman
6. Check network requests in DevTools

Common log locations:
- Backend: Terminal where `npm run dev` is running
- Frontend: Browser DevTools Console
- MongoDB: Atlas Dashboard → Metrics
