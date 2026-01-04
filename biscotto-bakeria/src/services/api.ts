/**
 * API Service
 * 
 * Centralized service for making API calls to the backend
 */

// Use relative URL for production (Vercel), localhost for development
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 
  (import.meta as any).env.MODE === 'production' 
    ? '/api'  // Vercel deployment - relative URL
    : 'http://localhost:5000/api';  // Local development

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: any = {}) => {
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
const apiUpload = async (endpoint: string, formData: FormData) => {
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
  signup: async (email: string, name: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password })
    });
  },

  verifyEmail: async (userId: string, code: string) => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ userId, code })
    });
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (userId: string, code: string, newPassword: string) => {
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

  updateProfile: async (name: string, email: string) => {
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

  getById: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'GET'
    });
  },

  create: async (productData: any, imageFile?: File) => {
    // Clean and validate data
    const cleanData = {
      name: productData.name || '',
      price: Number(productData.price) || 0,
      category: productData.category || '',
      stock: Number(productData.stock) || 0,
      description: productData.description || '',
      image: productData.image || ''
    };

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', cleanData.name);
      formData.append('price', cleanData.price.toString());
      formData.append('category', cleanData.category);
      formData.append('stock', cleanData.stock.toString());
      formData.append('description', cleanData.description);
      
      return apiUpload('/products', formData);
    } else {
      return apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(cleanData)
      });
    }
  },

  update: async (id: string, productData: any, imageFile?: File) => {
    const token = getAuthToken();
    
    // Clean and validate data
    const cleanData = {
      name: productData.name || '',
      price: Number(productData.price) || 0,
      category: productData.category || '',
      stock: Number(productData.stock) || 0,
      description: productData.description || '',
      image: productData.image || ''
    };
    
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', cleanData.name);
      formData.append('price', cleanData.price.toString());
      formData.append('category', cleanData.category);
      formData.append('stock', cleanData.stock.toString());
      formData.append('description', cleanData.description);
      
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
        body: JSON.stringify(cleanData)
      });
    }
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  getByCategory: async (category: string) => {
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

  updateHome: async (settings: any) => {
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

  updateAbout: async (settings: any) => {
    return apiRequest('/settings/about', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
};
