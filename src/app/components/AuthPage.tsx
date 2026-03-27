import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { LogIn, UserPlus, Calendar, Phone, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

// ✅ Firebase functions
import { registerUser, loginUser } from '../../services/firestore';

export function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', dob: '' });

  // 🔹 HANDLE REGISTER
  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.dob) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      const userId = await registerUser({
        name: formData.name,
        mobile: formData.mobile,
        dob: formData.dob,
        createdAt: new Date()
      });

      toast.success('Registration successful! Please login.');

      setIsLogin(true);
      setFormData({ name: '', mobile: '', dob: '' });

    } catch (err) {
      console.log(err);
      toast.error('Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 HANDLE LOGIN
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!formData.name || !formData.dob) {
      toast.error('Please enter name and date of birth');
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginUser(formData.name, formData.dob);

      if (!user) {
        toast.error('User not found');
        return;
      }

      // ✅ Save user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast.success('Login successful!');
      navigate('/dashboard');

    } catch (err) {
      console.log(err);
      toast.error('Login failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to YYYY-MM-DD for input value
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAFAF1]/30 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              V
            </span>
          </div>
          <h1
            className="text-3xl text-[#2C3E50] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
          >
            Vikas Medical
          </h1>
          <p className="text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#EAFAF1]">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-[#EAFAF1] rounded-xl">
            <button
              onClick={() => { setIsLogin(true); setFormData({ name: '', mobile: '', dob: '' }); }}
              className={`flex-1 py-3 rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white shadow-lg'
                  : 'text-[#2C3E50] hover:bg-white'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>

            <button
              onClick={() => { setIsLogin(false); setFormData({ name: '', mobile: '', dob: '' }); }}
              className={`flex-1 py-3 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white shadow-lg'
                  : 'text-[#2C3E50] hover:bg-white'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2ECC71]" />
                  Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2ECC71]" />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  placeholder="DD/MM/YYYY"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="cursor-pointer"
                  onKeyDown={(e) => {
                    // Allow manual entry of numbers, slash, backspace, delete, etc.
                    const allowedKeys = /[\d/Backspace/Delete/ArrowLeft/ArrowRight/Tab]/;
                    if (!allowedKeys.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && 
                        e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can select from calendar or type manually (DD/MM/YYYY)
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="mr-2" />}
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

            </form>
          ) : (

            // REGISTER FORM
            <form onSubmit={handleRegister} className="space-y-6">

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2ECC71]" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2ECC71]" />
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2ECC71]" />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  placeholder="DD/MM/YYYY"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="cursor-pointer"
                  onKeyDown={(e) => {
                    // Allow manual entry of numbers, slash, backspace, delete, etc.
                    const allowedKeys = /[\d/Backspace/Delete/ArrowLeft/ArrowRight/Tab]/;
                    if (!allowedKeys.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && 
                        e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can select from calendar or type manually (DD/MM/YYYY)
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2" />}
                {isLoading ? 'Registering...' : 'Register'}
              </Button>

            </form>
          )}

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full mt-4"
          >
            ← Back to Home
          </Button>

        </div>
      </motion.div>
    </div>
  );
}