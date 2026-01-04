import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Protected admin routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

export default router;
