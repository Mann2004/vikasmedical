import { motion } from 'motion/react';
import { CheckCircle2, MapPin, Award, Users, Clock, Phone, Star } from 'lucide-react';
import storeSignImage from '../../assets/9aeef03831ca540572245c15ba8037065afe43bb.png';

const highlights = [
  {
    icon: Award,
    text: 'Licensed & Certified – Registered Pharmacist on premises',
  },
  {
    icon: Users,
    text: 'Owned by Vikas Gandhi (Reg. Pharmacist) & Tejas Gandhi',
  },
  {
    icon: CheckCircle2,
    text: 'Wide range of medicines, surgical & healthcare products',
  },
  {
    icon: MapPin,
    text: 'Court Road, Near Old Police Station, Umreth, Gujarat',
  },
  {
    icon: Clock,
    text: 'Store Timings: 8:45 AM – 10:30 PM, All Days',
  },
  {
    icon: Phone,
    text: 'Contact: +91 98244 19469 | +91 83477 23201',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-24 bg-white">
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
            About Us
          </h2>
          <p
            className="text-base md:text-lg text-[#2C3E50]/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your trusted healthcare partner in Umreth for over 28 years, committed to quality medicines and exceptional service.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 md:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={storeSignImage}
                alt="Vikas Medical & Provision Store — વિકાસ મેડિકલ & પ્રોવીઝન સ્ટોર — Store Sign Board, Court Road, Umreth"
                className="w-full h-[400px] md:h-[550px] object-cover object-center"
              />
              {/* Store info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E8449]/95 to-transparent p-6">
                <p
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  વિકાસ મેડિકલ & પ્રોવીઝન સ્ટોર
                </p>
                <p className="text-white text-base font-semibold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Vikas Medical & Provision Store
                </p>
                <p className="text-white/85 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Court Road, Near Old Police Station, Umreth, Gujarat
                </p>
                <p className="text-white/85 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Reg. Pharmacist: Vikas Gandhi | Ph: +91 98244 19469
                </p>
              </div>
              {/* Decorative Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2ECC71]/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Trusted Since Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 md:-right-8 bg-white rounded-2xl shadow-2xl p-5 border border-[#EAFAF1] text-center"
            >
              <div className="flex items-center gap-1 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p
                className="text-3xl md:text-4xl text-[#2ECC71]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}
              >
                28+
              </p>
              <p
                className="text-xs text-[#2C3E50]/70 mt-1 leading-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Years of<br />Trusted Service
              </p>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2ECC71] rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-[#1E8449] rounded-full opacity-20 blur-3xl"></div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[#2C3E50]/80 mb-6 md:mb-8 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.8' }}
            >
              At <strong>Vikas Medical & Provision Store</strong>, we have been serving the community of Umreth for over <strong>28 years</strong> with dedication and care. Conveniently located on <strong>Court Road, Near Old Police Station, Umreth, Gujarat</strong>, our store is your one-stop destination for all healthcare needs.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-[#2C3E50]/80 mb-8 md:mb-10 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.8' }}
            >
              Led by <strong>Vikas Gandhi</strong> (Registered Pharmacist) and <strong>Tejas Gandhi</strong>, we ensure genuine medicines, expert advice, and personalized care. We carry medicines, surgical products, healthcare items, and provision goods — all under one roof.
            </motion.p>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p
                    className="text-sm md:text-base text-[#2C3E50] pt-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Badge Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-[#EAFAF1] to-[#d5f4e6] rounded-3xl border-2 border-[#2ECC71]/30 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p
                className="text-base text-[#1E8449]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
              >
                Licensed & Certified
              </p>
              <p className="text-sm text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Approved by health authorities
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-[#EAFAF1] to-[#d5f4e6] rounded-3xl border-2 border-[#2ECC71]/30 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p
                className="text-base text-[#1E8449]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
              >
                8:45 AM – 10:30 PM
              </p>
              <p className="text-sm text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Open all days
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}