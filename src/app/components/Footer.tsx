import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#2C3E50] to-[#1a252f] text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  V
                </span>
              </div>
              <div>
                <h3 className="text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  Vikas Medical
                </h3>
              </div>
            </div>
            <p
              className="text-white/70 text-sm mb-4 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Your trusted healthcare partner in Umreth, providing genuine medicines and quality service since years.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your Health, Our Priority
              </span>
            </div>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3
              className="text-lg text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('products')}
                  className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Contact
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Column 3 - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3
              className="text-lg text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Court Road, Near Old Police Station, Umreth
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+919824419469"
                    className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    +91 98244 19469
                  </a>
                  <a
                    href="tel:+918347723201"
                    className="text-white/70 hover:text-[#2ECC71] transition-colors text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    +91 83477 23201
                  </a>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Column 4 - Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3
              className="text-lg text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Follow Us
            </h3>
            <p
              className="text-white/70 text-sm mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Stay connected with us on social media
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-[#2ECC71] rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white/70 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-[#2ECC71] rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white/70 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-[#2ECC71] rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white/70 group-hover:text-white" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-white/60 text-sm text-center md:text-left"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              © {currentYear} Vikas Medical & Provision Store. All rights reserved.
            </p>
            <p
              className="text-white/60 text-sm text-center md:text-right"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Made with{' '}
              <Heart className="w-4 h-4 inline text-[#2ECC71] fill-[#2ECC71]" /> for better healthcare
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
