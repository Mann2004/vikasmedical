import { motion } from 'motion/react';
import { Phone, MessageCircle, Shield, Clock, Star, Award } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

const heroImage = 'src/assets/heroimg.png';

export function HeroSection() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-[#EAFAF1]/30 to-white">

      {/* Trusted Since 28 Years — Full-width Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full bg-gradient-to-r from-[#1E8449] via-[#2ECC71] to-[#1E8449] py-4 px-4"
      >
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-white/90 flex-shrink-0" />
            <p
              className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wide"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, letterSpacing: '0.02em' }}
            >
              Trusted Since
              <span className="mx-2 text-yellow-300">28 Years</span>
            </p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/40"></div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span
              className="text-white/90 text-sm ml-1"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Serving Umreth with Pride
            </span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 bg-[#EAFAF1] rounded-full"
            >
              <span className="text-[#1E8449] text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                🏥 Vikas Medical & Provision Store, Umreth
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C3E50] mb-4 md:mb-6"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, lineHeight: '1.2' }}
            >
              Your Trusted
              <span className="block text-[#2ECC71]">Medical Store</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-[#2C3E50]/80 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Genuine medicines, expert care, and professional service at Vikas Medical & Provision Store, Umreth — your health partner for 28 years.
            </motion.p>

            {/* Owner Names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EAFAF1] to-[#d5f4e6] rounded-xl border border-[#2ECC71]/30 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center text-white text-xs font-bold">VG</div>
                <div>
                  <p className="text-[#1E8449] text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Vikas Gandhi</p>
                  <p className="text-[#2C3E50]/60 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Registered Pharmacist</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EAFAF1] to-[#d5f4e6] rounded-xl border border-[#2ECC71]/30 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1E8449] to-[#2ECC71] rounded-full flex items-center justify-center text-white text-xs font-bold">TG</div>
                <div>
                  <p className="text-[#1E8449] text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Tejas Gandhi</p>
                  <p className="text-[#2C3E50]/60 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Co-Owner</p>
                </div>
              </div>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-[#EAFAF1]">
                <Shield className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-sm text-[#2C3E50]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Genuine Medicines
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-[#EAFAF1]">
                <Clock className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-sm text-[#2C3E50]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  8:45 AM – 10:30 PM
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-[#EAFAF1]">
                <Award className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-sm text-[#2C3E50]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Licensed & Certified
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27ae60] hover:to-[#196f3d] text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Order Now
              </Button>
              <Button
                onClick={() => {
                  window.open('https://wa.me/919824419469', '_blank');
                }}
                variant="outline"
                className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Vikas Medical Store - Our Team"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-20 h-20 bg-[#2ECC71] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute bottom-6 left-6 w-32 h-32 bg-[#1E8449] rounded-full opacity-20 blur-2xl"></div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 border border-[#EAFAF1]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#2C3E50]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Trusted by
                  </p>
                  <p className="text-lg text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                    100k+ Customers
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Years Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute -top-4 -right-4 md:-right-6 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-2xl shadow-xl p-4 text-white text-center"
            >
              <p className="text-3xl font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>28</p>
              <p className="text-xs font-semibold leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Years of<br />Trust</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2ECC71] rounded-full opacity-5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E8449] rounded-full opacity-5 blur-3xl -z-10"></div>
    </section>
  );
}
