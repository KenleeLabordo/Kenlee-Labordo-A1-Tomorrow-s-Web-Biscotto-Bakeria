import Product from '../models/Product.js';
import { cloudinary, uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('❌ Error getting all products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('❌ Error getting product by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    console.log('📦 Create product request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, price, category, stock, description, image } = req.body;

    let imageUrl = image;
    let imagePublicId = null;

    // If file was uploaded via multer
    if (req.file) {
      console.log('📤 Uploading to Cloudinary...');
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
      console.log('✅ Upload successful:', imageUrl);
    }

    console.log('💾 Creating product in database...');
    const product = new Product({
      name,
      price,
      category,
      stock,
      image: imageUrl,
      imagePublicId,
      description
    });

    await product.save();
    console.log('✅ Product saved successfully');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    console.log('📝 Update product request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, price, category, stock, description, image } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageUrl = image || product.image;
    let imagePublicId = product.imagePublicId;

    // If new file was uploaded
    if (req.file) {
      console.log('📤 Uploading new image to Cloudinary...');
      // Delete old image from cloudinary if it exists
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
      console.log('✅ Upload successful:', imageUrl);
    }

    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.description = description || product.description;
    product.image = imageUrl;
    product.imagePublicId = imagePublicId;

    await product.save();
    console.log('✅ Product updated successfully');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    console.log('🗑️ Delete product request received for ID:', req.params.id);

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from cloudinary if it exists
    if (product.imagePublicId) {
      console.log('🗑️ Deleting image from Cloudinary...');
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('✅ Product deleted successfully');

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      category: new RegExp(req.params.category, 'i') 
    });
    
    res.json({ products });
  } catch (error) {
    console.error('❌ Error getting products by category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};