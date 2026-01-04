// @ts-nocheck

import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../../contexts/ProductContext';


const ProductModal = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    image: '',
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
        description: product.description,
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await updateProduct({ ...product, ...formData }, imageFile);
      } else {
        await addProduct(formData, imageFile);
      }
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 p-2 border rounded-md" 
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 p-2 border rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                step="0.01" 
                className="w-full bg-gray-50 p-2 border rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 p-2 border rounded-md"
                disabled={loading}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-brand-orange text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    Upload File
                  </button>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleImageUrlChange} 
                    placeholder="Or paste URL"
                    className="flex-1 bg-gray-50 p-2 border rounded-md text-sm min-w-[200px]"
                    disabled={loading}
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden"
                    disabled={loading}
                  />
                </div>
                
                {imagePreview && (
                  <div className="relative w-40 h-40">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg border shadow-sm" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/160?text=No+Image';
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData(p => ({...p, image: ''}));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                )}
                {imageFile && (
                  <p className="text-sm text-gray-600">
                    Selected file: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                rows={3} 
                className="w-full bg-gray-50 p-2 border rounded-md"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-600 font-bold px-4 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-brand-orange text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-orange-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (product ? 'Update' : 'Add') + ' Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;