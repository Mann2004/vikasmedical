import { motion } from 'motion/react';
import { Pill, Shield, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

const features = [
  {
    icon: Pill,
    title: 'Add Medicine',
    description: 'Easily add and manage your medicines. Keep track of your prescriptions and medications.',
    color: 'from-[#2ECC71] to-[#1E8449]',
    clickable: true,
  },
  {
    icon: Shield,
    title: 'Genuine Medicines',
    description: '100% authentic medicines from trusted brands. We never compromise on quality and safety.',
    color: 'from-[#1E8449] to-[#27ae60]',
    clickable: false,
  },
  {
    icon: Clock,
    title: 'Store Hours',
    description: 'Open every day from 8:45 AM to 10:30 PM. Visit us for all your medical and healthcare needs.',
    color: 'from-[#27ae60] to-[#2ECC71]',
    clickable: false,
  },
  {
    icon: Heart,
    title: 'Trusted Store',
    description: 'Serving Umreth community for 28+ years with dedication, care, and professional healthcare service.',
    color: 'from-[#2ECC71] to-[#16a085]',
    clickable: false,
  },
];

export function FeaturesSection() {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.clickable) {
      navigate('/auth');
    }
  };

  return (
    <section id="features" className="py-20 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#2C3E50] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
          >
            Why Choose Us?
          </h2>
          <p
            className="text-base md:text-lg text-[#2C3E50]/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Experience the best healthcare service with our commitment to quality, trust, and customer satisfaction.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => handleFeatureClick(feature)}
              className={`group ${feature.clickable ? 'cursor-pointer' : ''}`}
            >
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-[#EAFAF1] h-full">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                  ></div>
                </div>

                {/* Content */}
                <h3
                  className="text-xl md:text-2xl text-[#2C3E50] mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm md:text-base text-[#2C3E50]/70 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#2ECC71]/10 to-transparent rounded-bl-full rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#EAFAF1] rounded-full">
            <Heart className="w-5 h-5 text-[#2ECC71]" />
            <span
              className="text-[#1E8449]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Your Health, Our Priority
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}