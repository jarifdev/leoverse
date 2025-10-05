'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { FaUser, FaLock } from 'react-icons/fa';
import VideoTransition from '@/components/VideoTransition';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAuthToken, isAuthenticated, selectedCountry } = useStore();
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/country');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (selectedCountry) {
        router.push('/mission');
      } else {
        router.push('/country');
      }
    }
  }, [isAuthenticated, selectedCountry, router]);
  
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.login || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.login({
        login: formData.login,
        password: formData.password
      });
      
      // Save auth data
      setUser(response.data.user);
      setAuthToken(response.data.token);
      
      // Determine redirect path based on user progress
      const nextPath = response.data.user.country_code ? '/mission' : '/country';
      setRedirectPath(nextPath);
      
      // Show video transition
      setShowVideoTransition(true);
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    // After video completes, redirect to appropriate page
    router.push(redirectPath);
  };

  // Show video transition if login was successful
  if (showVideoTransition) {
    return <VideoTransition videoSrc="/animations/1.mp4" onComplete={handleVideoComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/animations/img.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4
        }}
      />
      
      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 bg-black/70" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block text-6xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to continue your space missions</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username or Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="username or email"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
