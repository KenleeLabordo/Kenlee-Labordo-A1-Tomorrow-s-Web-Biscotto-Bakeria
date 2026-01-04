import React, { useState, useRef } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import type { ShopProduct } from '../types';
import ProductModal from '../components/admin/ProductModal';

type AdminTab = 'inventory' | 'home-assets' | 'about-assets';

const AdminPage: React.FC = () => {
    const { products, deleteProduct, homeSettings, updateHomeSettings, aboutSettings, updateAboutSettings } = useProducts();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<ShopProduct | null>(null);
    
    // File input refs for various assets
    const fileRefs = {
        hero: useRef<HTMLInputElement>(null),
        founder: useRef<HTMLInputElement>(null),
        flagship: useRef<HTMLInputElement>(null),
        homeCollage: Array.from({ length: 9 }, () => useRef<HTMLInputElement>(null)),
        aboutCollage: Array.from({ length: 4 }, () => useRef<HTMLInputElement>(null)),
    };

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>, 
        callback: (base64: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: ShopProduct) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const toggleFeaturedProduct = (id: number) => {
        const current = homeSettings.featuredProductIds;
        const next = current.includes(id) 
            ? current.filter(fid => fid !== id)
            : [...current, id];
        updateHomeSettings({ featuredProductIds: next });
    };

    const updateHomeCollage = (index: number, base64: string) => {
        const newCollage = [...homeSettings.collageImages];
        newCollage[index] = base64;
        updateHomeSettings({ collageImages: newCollage });
    };

    const updateAboutCollage = (index: number, base64: string) => {
        const newCollage = [...aboutSettings.collageImages];
        newCollage[index] = base64;
        updateAboutSettings({ collageImages: newCollage });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold text-brand-orange whitespace-nowrap">Bakery Admin</h1>
                        <nav className="flex flex-wrap gap-2">
                            {(['inventory', 'home-assets', 'about-assets'] as const).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg font-medium transition text-sm capitalize ${activeTab === tab ? 'bg-orange-50 text-brand-orange' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {tab.replace('-', ' ')}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <button onClick={logout} className="text-gray-500 hover:text-red-500 font-medium transition text-sm">Logout</button>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {activeTab === 'inventory' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-playwrite">Product Catalog</h2>
                            <button onClick={handleAddProduct} className="bg-brand-orange text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition">
                                Add New Product
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-600">Product</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Category</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Price</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Stock</th>
                                        <th className="p-4 text-right font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={product.image || 'https://via.placeholder.com/150'} 
                                                        className="w-20 h-20 object-cover rounded-lg border shadow-sm" 
                                                        alt={product.name}
                                                    />
                                                    <span className="font-bold text-black">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-black">{product.category}</td>
                                            <td className="p-4 font-medium text-black">${product.price.toFixed(2)}</td>
                                            <td className="p-4 text-black">{product.stock}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleEditProduct(product)} className="text-brand-orange hover:underline mr-4">Edit</button>
                                                <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'home-assets' && (
                    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                        <h2 className="text-3xl font-playwrite">Home Page Assets</h2>
                        
                        {/* Hero & Texts */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b">Hero Section</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                                        <input type="text" value={homeSettings.heroTitle} onChange={e => updateHomeSettings({ heroTitle: e.target.value })} className="w-full p-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Subtitle</label>
                                        <textarea rows={3} value={homeSettings.heroSubtitle} onChange={e => updateHomeSettings({ heroSubtitle: e.target.value })} className="w-full p-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Hero Image</label>
                                    <img src={homeSettings.heroImage} className="w-full h-40 object-cover rounded-xl border mb-3" />
                                    <button onClick={() => fileRefs.hero.current?.click()} className="w-full bg-brand-orange text-white py-2 rounded-lg font-bold">Upload Hero Image</button>
                                    <input type="file" ref={fileRefs.hero} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, base64 => updateHomeSettings({ heroImage: base64 }))} />
                                </div>
                            </div>
                        </section>

                        {/* Featured Carousel */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Carousel Items (Featured)</h3>
                            <p className="text-gray-500 mb-6 text-sm">Select products to show in the 3D rotating carousel.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {products.map(p => {
                                    const isFeatured = homeSettings.featuredProductIds.includes(p.id);
                                    return (
                                        <button key={p.id} onClick={() => toggleFeaturedProduct(p.id)} className={`p-2 rounded-lg border-2 transition ${isFeatured ? 'border-brand-orange bg-orange-50' : 'border-gray-100'}`}>
                                            <img src={p.image} className="w-full h-16 object-cover rounded mb-1" />
                                            <p className="text-[10px] font-bold truncate">{p.name}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Home Collage */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Home Page Collage (9 Images)</h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                {homeSettings.collageImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} className="w-full h-24 object-cover rounded-lg border" />
                                        <button 
                                            onClick={() => fileRefs.homeCollage[idx].current?.click()}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition rounded-lg"
                                        >
                                            REPLACE
                                        </button>
                                        <input type="file" ref={fileRefs.homeCollage[idx]} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, base64 => updateHomeCollage(idx, base64))} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'about-assets' && (
                    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                        <h2 className="text-3xl font-playwrite">About Page Assets</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Founder Section */}
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Founder Spotlight</h3>
                                <div className="space-y-4">
                                    <img src={aboutSettings.founderImage} className="w-40 h-52 object-cover rounded-xl border mx-auto" />
                                    <button onClick={() => fileRefs.founder.current?.click()} className="w-full bg-brand-orange text-white py-2 rounded-lg font-bold">Replace Profile Photo</button>
                                    <input type="file" ref={fileRefs.founder} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, base64 => updateAboutSettings({ founderImage: base64 }))} />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Founder Quote</label>
                                        <textarea rows={2} value={aboutSettings.founderQuote} onChange={e => updateAboutSettings({ founderQuote: e.target.value })} className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                    </div>
                                </div>
                            </section>

                            {/* Flagship Location */}
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Flagship Location</h3>
                                <div className="space-y-4">
                                    <img src={aboutSettings.flagshipImage} className="w-full h-52 object-cover rounded-xl border" />
                                    <button onClick={() => fileRefs.flagship.current?.click()} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Upload Flagship Image</button>
                                    <input type="file" ref={fileRefs.flagship} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, base64 => updateAboutSettings({ flagshipImage: base64 }))} />
                                </div>
                            </section>
                        </div>

                        {/* About Collage */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">About Gallery (4 Images)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {aboutSettings.collageImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} className="w-full h-32 object-cover rounded-lg border" />
                                        <button 
                                            onClick={() => fileRefs.aboutCollage[idx].current?.click()}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition rounded-lg"
                                        >
                                            REPLACE
                                        </button>
                                        <input type="file" ref={fileRefs.aboutCollage[idx]} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, base64 => updateAboutCollage(idx, base64))} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
            {isModalOpen && <ProductModal product={productToEdit} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AdminPage;