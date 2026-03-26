import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { api } from '../lib/api';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase
      await api.sendContact(formData);
    } catch (err) {
      console.log('Contact save warning (non-blocking):', err);
    }

    // Open WhatsApp directly with the message
    const whatsappMsg = `🏥 *Vikas Medical & Provision Store*\n\n*New Inquiry from Website*\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n\n💬 *Message:*\n${formData.message}`;
    const whatsappUrl = `https://wa.me/919824419469?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('Message sent to WhatsApp!');
    setFormData({ name: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 md:py-24 bg-gradient-to-b from-[#EAFAF1]/30 to-white">
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
            Get In Touch
          </h2>
          <p
            className="text-base md:text-lg text-[#2C3E50]/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Have questions or need assistance? Send us a message and we'll reply on WhatsApp instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EAFAF1]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  >
                    Our Location
                  </h3>
                  <p
                    className="text-[#2C3E50]/80 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Court Road, Near Old Police Station,
                    <br />
                    Umreth, Gujarat, India
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EAFAF1]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  >
                    Phone Numbers
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="tel:+919824419469"
                      className="block text-[#2ECC71] hover:text-[#1E8449] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    >
                      +91 98244 19469
                    </a>
                    <a
                      href="tel:+918347723201"
                      className="block text-[#2ECC71] hover:text-[#1E8449] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    >
                      +91 83477 23201
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EAFAF1]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  >
                    Opening Hours
                  </h3>
                  <p
                    className="text-[#2C3E50]/80"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Monday - Sunday
                    <br />
                    <span className="text-[#2ECC71] font-semibold">8:45 AM – 10:30 PM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => window.open('https://wa.me/919824419469', '_blank')}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e7a6b] text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp Directly
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EAFAF1]">
              <div className="mb-6">
                <h3
                  className="text-2xl text-[#2C3E50] mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  Send us a Message
                </h3>
                <p className="text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Fill out the form — your message will open directly in WhatsApp to the store owner.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Your Name *
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-[#EAFAF1] rounded-xl focus:border-[#2ECC71] focus:ring-0 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Phone Number *
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-[#EAFAF1] rounded-xl focus:border-[#2ECC71] focus:ring-0 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[#2C3E50] mb-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Message *
                  </label>
                  <Textarea
                    id="contact-message"
                    placeholder="How can we help you?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-[#EAFAF1] rounded-xl focus:border-[#2ECC71] focus:ring-0 transition-colors resize-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e7a6b] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
                </Button>
              </form>

              <div className="flex items-center gap-2 mt-4 p-3 bg-[#EAFAF1] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                <p
                  className="text-xs text-[#2C3E50]/70"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Your message will open in WhatsApp and be sent directly to the store owner.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
