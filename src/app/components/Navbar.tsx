import { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    
    // Function to perform the scroll
    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return true;
      }
      return false;
    };

    // If we're on the home page, try to scroll immediately
    if (location.pathname === '/') {
      if (!performScroll()) {
        // If element not found, wait a bit and try again
        setTimeout(performScroll, 500);
      }
    } else {
      // Navigate to home and then scroll after navigation completes
      navigate('/');
      // Wait for navigation and page render
      setTimeout(() => {
        performScroll();
      }, 300);
    }
  };

  const handleOrderNow = () => {
    navigate('/auth');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  // Add this effect to handle hash links when page loads
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                V
              </span>
            </div>
            <div>
              <h1 className="text-base md:text-lg text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Vikas Medical
              </h1>
              <p className="text-[10px] md:text-xs text-[#1E8449]" style={{ fontFamily: 'Inter, sans-serif' }}>
                & Provision Store
              </p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#2C3E50] hover:text-[#2ECC71] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-[#2C3E50] hover:text-[#2ECC71] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#2C3E50] hover:text-[#2ECC71] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#2C3E50] hover:text-[#2ECC71] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Contact
            </button>
            <Button
              onClick={handleOrderNow}
              className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27ae60] hover:to-[#196f3d] text-white px-6 py-2 rounded-full shadow-lg"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Order Now
            </Button>
            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] px-6 py-2 rounded-full"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#2C3E50] hover:text-[#2ECC71]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-2 text-[#2C3E50] hover:bg-[#EAFAF1] rounded-lg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="block w-full text-left px-4 py-2 text-[#2C3E50] hover:bg-[#EAFAF1] rounded-lg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-2 text-[#2C3E50] hover:bg-[#EAFAF1] rounded-lg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-2 text-[#2C3E50] hover:bg-[#EAFAF1] rounded-lg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                Contact
              </button>
              <Button
                onClick={handleOrderNow}
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27ae60] hover:to-[#196f3d] text-white py-3 rounded-full shadow-lg"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Order Now
              </Button>
              <Button
                onClick={handleAdminLogin}
                variant="outline"
                className="w-full border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] py-3 rounded-full"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}