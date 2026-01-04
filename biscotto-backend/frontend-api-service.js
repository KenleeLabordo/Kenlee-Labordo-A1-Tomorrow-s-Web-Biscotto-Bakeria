/**
 * API Service
 * 
 * Centralized service for making API calls to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Helper function for file uploads
const apiUpload = async (endpoint, formData) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
};

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  signup: async (email, name, password) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password })
    });
  },

  verifyEmail: async (userId, code) => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ userId, code })
    });
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (userId, code, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, code, newPassword })
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  updateProfile: async (name, email) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email })
    });
  }
};

// ============================================
// PRODUCT APIs
// ============================================

export const productAPI = {
  getAll: async () => {
    return apiRequest('/products', {
      method: 'GET'
    });
  },

  getById: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'GET'
    });
  },

  create: async (productData, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description);
      
      return apiUpload('/products', formData);
    } else {
      return apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    }
  },

  update: async (id, productData, imageFile) => {
    const token = getAuthToken();
    
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description);
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }
      return data;
    } else {
      return apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    }
  },

  delete: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  getByCategory: async (category) => {
    return apiRequest(`/products/category/${category}`, {
      method: 'GET'
    });
  }
};

// ============================================
// SETTINGS APIs
// ============================================

export const settingsAPI = {
  getHome: async () => {
    return apiRequest('/settings/home', {
      method: 'GET'
    });
  },

  updateHome: async (settings) => {
    return apiRequest('/settings/home', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  getAbout: async () => {
    return apiRequest('/settings/about', {
      method: 'GET'
    });
  },

  updateAbout: async (settings) => {
    return apiRequest('/settings/about', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
};
