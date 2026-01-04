/**
 * Product Context - Updated to use Backend API
 * 
 * Manages products and global page settings (Home & About) with MongoDB backend.
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ShopProduct, HomeSettings, AboutSettings } from '../types';
import { productAPI, settingsAPI } from "../src/services/api";

interface ProductContextType {
  products: ShopProduct[];
  homeSettings: HomeSettings;
  aboutSettings: AboutSettings;
  loading: boolean;
  addProduct: (product: Omit<ShopProduct, 'id'>, imageFile?: File) => Promise<void>;
  updateProduct: (updatedProduct: ShopProduct, imageFile?: File) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  updateHomeSettings: (settings: Partial<HomeSettings>) => Promise<void>;
  updateAboutSettings: (settings: Partial<AboutSettings>) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const DEFAULT_HOME_SETTINGS: HomeSettings = {
  heroImage: "https://picsum.photos/id/326/800/600",
  heroTitle: "Simple, Yet Delectable",
  heroSubtitle: "Discover and indulge in our irresistible aroma of freshly baked croissants. Golden, flaky, and crafted to perfection every morning.",
  featuredProductIds: [],
  collageImages: []
};

const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  founderImage: "https://picsum.photos/id/338/800/1000",
  founderQuote: "Baking is about patience. In a world that moves so fast, bread forces you to slow down. You can't rush the rise.",
  collageImages: [],
  flagshipImage: "https://picsum.photos/id/122/800/600"
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(DEFAULT_HOME_SETTINGS);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        try {
          const productsResponse = await productAPI.getAll();
          const productsData = productsResponse.products.map((p: any) => ({
            id: parseInt(p._id, 36) % 1000000,
            name: p.name,
            price: p.price,
            category: p.category,
            stock: p.stock,
            image: p.image,
            description: p.description,
            _id: p._id
          }));
          setProducts(productsData);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }

        // Fetch home settings
        try {
          const homeResponse = await settingsAPI.getHome();
          if (homeResponse?.settings) {
            setHomeSettings({
              heroImage: homeResponse.settings.heroImage || DEFAULT_HOME_SETTINGS.heroImage,
              heroTitle: homeResponse.settings.heroTitle || DEFAULT_HOME_SETTINGS.heroTitle,
              heroSubtitle: homeResponse.settings.heroSubtitle || DEFAULT_HOME_SETTINGS.heroSubtitle,
              featuredProductIds: homeResponse.settings.featuredProductIds || [],
              collageImages: homeResponse.settings.collageImages || []
            });
          }
        } catch (error) {
          console.warn('Using default home settings:', error);
        }

        // Fetch about settings  
        try {
          const aboutResponse = await settingsAPI.getAbout();
          if (aboutResponse?.settings) {
            setAboutSettings({
              founderImage: aboutResponse.settings.founderImage || DEFAULT_ABOUT_SETTINGS.founderImage,
              founderQuote: aboutResponse.settings.founderQuote || DEFAULT_ABOUT_SETTINGS.founderQuote,
              collageImages: aboutResponse.settings.collageImages || [],
              flagshipImage: aboutResponse.settings.flagshipImage || DEFAULT_ABOUT_SETTINGS.flagshipImage
            });
          }
        } catch (error) {
          console.warn('Using default about settings:', error);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshProducts = async () => {
    try {
      const response = await productAPI.getAll();
      const productsData = response.products.map((p: any) => ({
        id: parseInt(p._id, 36) % 1000000,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.stock,
        image: p.image,
        description: p.description,
        _id: p._id
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to refresh products:', error);
    }
  };

  const addProduct = async (productData: Omit<ShopProduct, 'id'>, imageFile?: File) => {
    try {
      await productAPI.create(productData, imageFile);
      await refreshProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: ShopProduct, imageFile?: File) => {
    try {
      const mongoId = (updatedProduct as any)._id;
      if (!mongoId) {
        throw new Error('Product ID not found');
      }

      await productAPI.update(mongoId, updatedProduct, imageFile);
      await refreshProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const product = products.find(p => p.id === productId);
      const mongoId = (product as any)?._id;
      
      if (!mongoId) {
        throw new Error('Product not found');
      }

      await productAPI.delete(mongoId);
      await refreshProducts();
      
      // Also remove from featured products if present
      if (homeSettings.featuredProductIds.includes(productId)) {
        try {
          await updateHomeSettings({
            featuredProductIds: homeSettings.featuredProductIds.filter(id => id !== productId)
          });
        } catch (error) {
          console.error('Failed to update home settings after delete:', error);
        }
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const updateHomeSettings = async (newSettings: Partial<HomeSettings>) => {
    try {
      const updatedSettings = { ...homeSettings, ...newSettings };
      const response = await settingsAPI.updateHome(updatedSettings);
      if (response.settings) {
        setHomeSettings(response.settings);
      } else {
        setHomeSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Failed to update home settings:', error);
      throw error;
    }
  };

  const updateAboutSettings = async (newSettings: Partial<AboutSettings>) => {
    try {
      const updatedSettings = { ...aboutSettings, ...newSettings };
      const response = await settingsAPI.updateAbout(updatedSettings);
      if (response.settings) {
        setAboutSettings(response.settings);
      } else {
        setAboutSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Failed to update about settings:', error);
      throw error;
    }
  };

  const value = { 
    products, 
    homeSettings, 
    aboutSettings,
    loading,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateHomeSettings,
    updateAboutSettings,
    refreshProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};