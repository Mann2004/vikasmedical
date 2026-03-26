import { motion } from 'motion/react';
import { Pill, Droplet, Sparkles, Activity, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const products = [
  {
    title: 'Tablets & Capsules',
    description: 'Wide range of prescription and OTC medicines',
    image: 'https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHRhYmxldHMlMjBwaWxsc3xlbnwxfHx8fDE3NzM4MzUxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Pill,
    color: 'from-[#2ECC71] to-[#1E8449]',
  },
  {
    title: 'Syrups & Liquids',
    description: 'Effective liquid medications for all ages',
    image: 'https://images.unsplash.com/photo-1755960331481-55a49eb3ee14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3lydXAlMjBib3R0bGVzfGVufDF8fHx8MTc3MzgzNTEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Droplet,
    color: 'from-[#1E8449] to-[#27ae60]',
  },
  {
    title: 'Personal Care',
    description: 'Health & wellness personal care products',
    image: 'https://images.unsplash.com/photo-1754821480096-61d29809d19f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBoZWFsdGhjYXJlJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzczODM1MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Sparkles,
    color: 'from-[#27ae60] to-[#2ECC71]',
  },
  {
    title: 'Health Devices',
    description: 'Medical equipment & monitoring devices',
    image: 'https://images.unsplash.com/photo-1613796424665-07c3ac9180c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtZWRpY2FsJTIwZGV2aWNlcyUyMHN0ZXRob3Njb3BlfGVufDF8fHx8MTc3MzgzNTEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Activity,
    color: 'from-[#2ECC71] to-[#16a085]',
  },
];

export function ProductsSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="py-20 md:py-24 bg-gradient-to-b from-white to-[#EAFAF1]/30">
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
            Our Products
          </h2>
          <p
            className="text-base md:text-lg text-[#2C3E50]/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore our wide range of genuine medical products and healthcare essentials.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group h-full"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[#EAFAF1] h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    className="text-xl md:text-2xl text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  >
                    {product.title}
                  </h3>
                  <p
                    className="text-sm md:text-base text-[#2C3E50]/70 mb-4 flex-grow"
                    style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
                  >
                    {product.description}
                  </p>

                  {/* CTA Button */}
                  <Button
                    onClick={scrollToContact}
                    variant="ghost"
                    className="w-full text-[#2ECC71] hover:text-[#1E8449] hover:bg-[#EAFAF1] rounded-xl group/btn"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  >
                    Order Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#2ECC71]/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="inline-block px-6 py-4 bg-white rounded-2xl shadow-lg border border-[#EAFAF1]">
            <p
              className="text-[#2C3E50]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Can't find what you're looking for? 
              <button
                onClick={scrollToContact}
                className="ml-2 text-[#2ECC71] font-semibold hover:text-[#1E8449] transition-colors"
              >
                Contact us →
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}