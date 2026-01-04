/**
 * Contact Page
 * 
 * A form that collects user messages and submits them to a Google Sheet,
 * plus location and hours information.
 */

import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ Name: '', Email: '', Message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this with your Google Apps Script Web App URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycby6tOSN4B5UXo_sHoSu3efiyDHYUoBlaDwZ7K0Ia2bZvhixsOa3IrdhSnj-5LdriwhB-Q/exec';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    } else if (formData.Name.trim().length < 2) {
      newErrors.Name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.Message.trim()) {
      newErrors.Message = 'Message is required';
    } else if (formData.Message.trim().length < 10) {
      newErrors.Message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    
    console.log('📤 Submitting to:', scriptURL);
    console.log('📝 Form data:', formData);
    
    fetch(scriptURL, { 
      method: 'POST', 
      body: new FormData(form)
    })
      .then(response => {
        console.log('📥 Response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('📄 Response text:', text);
        
        try {
          const data = JSON.parse(text);
          console.log('📊 Parsed data:', data);
          
          if (data.result === 'success') {
            console.log('✅ Success! Row:', data.row);
            setIsSubmitted(true);
            setFormData({ Name: '', Email: '', Message: '' });
            setTimeout(() => setIsSubmitted(false), 10000);
          } else {
            throw new Error(data.error || 'Submission failed');
          }
        } catch (parseError) {
          // Google redirects might return HTML
          if (text.includes('html') || text.includes('OK')) {
            console.log('✅ Got redirect/HTML - assuming success');
            setIsSubmitted(true);
            setFormData({ Name: '', Email: '', Message: '' });
            setTimeout(() => setIsSubmitted(false), 10000);
          } else {
            console.error('❌ Parse error:', parseError);
            throw new Error('Failed to process response');
          }
        }
      })
      .catch(error => {
        console.error('❌ Submission error:', error);
        setError('There was an error submitting your message. Please check the console for details or contact us directly.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ Name: '', Email: '', Message: '' });
    setErrors({});
    setError(null);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-6 sm:px-12">
        <h1 className="font-playwrite text-4xl md:text-5xl text-center mb-12 text-white">
          Get In Touch
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Form */}
          <div className="w-full lg:w-1/2 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 text-gray-800">
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-playwrite text-3xl mb-4 text-green-600">Thank You!</h2>
                <p className="text-lg mb-8">Your message has been sent successfully. We'll get back to you shortly.</p>
                <button
                  onClick={handleReset}
                  className="bg-brand-orange text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form name="submit-to-google-sheet" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                
                {/* General Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    placeholder="John Doe"
                    value={formData.Name}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                      errors.Name
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.Name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.Name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    placeholder="john@example.com"
                    value={formData.Email}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition ${
                      errors.Email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.Email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.Email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="Message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.Message}
                    onChange={handleChange}
                    className={`w-full bg-gray-100 text-gray-800 p-4 text-lg border rounded-lg outline-none transition resize-none ${
                      errors.Message
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-orange'
                    }`}
                  ></textarea>
                  {errors.Message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.Message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum 10 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-orange text-white font-bold text-xl py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-1/2 text-white flex flex-col justify-center gap-8">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-playwrite text-2xl mb-4">Visit Our Bakery</h3>
                  <p className="text-lg mb-2">123 Baker's Street</p>
                  <p className="text-lg mb-2">Downtown District</p>
                  <p className="text-lg">Cityville, ST 90210</p>
                </div>
              </div>
            </div>
             
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-playwrite text-2xl mb-4">Opening Hours</h3>
                  <div className="flex justify-between text-lg mb-2 border-b border-white/20 pb-2">
                    <span>Mon - Fri</span>
                    <span className="font-semibold">6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between text-lg mb-2 border-b border-white/20 pb-2">
                    <span>Saturday</span>
                    <span className="font-semibold">7:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Sunday</span>
                    <span className="font-semibold">7:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
             
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-playwrite text-2xl mb-4">Call Us</h3>
                  <p className="text-3xl font-bold mb-2">(555) 123-4567</p>
                  <p className="text-sm opacity-80">For catering and custom orders, please call 48 hours in advance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;