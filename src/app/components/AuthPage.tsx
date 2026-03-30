import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { LogIn, UserPlus, Calendar, Phone, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import app from '../../firebase'; // Import your firebase app

// Initialize Firestore
const db = getFirestore(app);

export function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', dob: '' });

  // 🔹 REGISTER USER FUNCTION
  const registerUser = async (userData: any) => {
    try {
      // Check if user already exists with this mobile number
      const q = query(collection(db, 'users'), where('mobile', '==', userData.mobile));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('User already exists with this mobile number');
      }

      // Add user to Firestore
      const docRef = await addDoc(collection(db, 'users'), {
        name: userData.name,
        mobile: userData.mobile,
        dob: userData.dob,
        createdAt: userData.createdAt,
        updatedAt: new Date()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  // 🔹 LOGIN USER BY MOBILE ONLY
  const loginUserByMobile = async (mobile: string) => {
    try {
      const q = query(collection(db, 'users'), where('mobile', '==', mobile));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // 🔹 HANDLE REGISTER
  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.dob) {
      toast.error('Please fill all fields');
      return;
    }

    // Mobile number validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
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
      
      // Clear form and switch to login
      setIsLogin(true);
      setFormData({ name: '', mobile: '', dob: '' });

    } catch (err: any) {
      console.log(err);
      if (err.message === 'User already exists with this mobile number') {
        toast.error('Mobile number already registered. Please login.');
      } else {
        toast.error('Registration failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 HANDLE LOGIN - Mobile number only
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!formData.mobile) {
      toast.error('Please enter mobile number');
      return;
    }

    // Mobile number validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      // Login using mobile number only
      const user = await loginUserByMobile(formData.mobile);

      if (!user) {
        toast.error('User not found. Please register first.');
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
            {isLogin ? 'Login with your mobile number' : 'Create your account'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#EAFAF1]">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-[#EAFAF1] rounded-xl">
            <button
              onClick={() => { setIsLogin(true); setFormData({ name: '', mobile: '', dob: '' }); }}
              className={`flex-1 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                isLogin
                  ? 'bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white shadow-lg'
                  : 'text-[#2C3E50] hover:bg-white'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Login
            </button>

            <button
              onClick={() => { setIsLogin(false); setFormData({ name: '', mobile: '', dob: '' }); }}
              className={`flex-1 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white shadow-lg'
                  : 'text-[#2C3E50] hover:bg-white'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Register
            </button>
          </div>

          {/* LOGIN FORM - Mobile number only */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-[#2ECC71]" />
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => {
                    // Allow only numbers and limit to 10 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile: value });
                  }}
                  maxLength={10}
                  className="text-base sm:text-lg py-2 sm:py-3"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter 10-digit mobile number
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27AE60] hover:to-[#1E8449] py-2 sm:py-3 text-sm sm:text-base">
                {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <LogIn className="mr-2 w-4 h-4" />}
                {isLoading ? 'Logging in...' : 'Login with Mobile'}
              </Button>

            </form>
          ) : (

            // REGISTER FORM - Full details
            <form onSubmit={handleRegister} className="space-y-6">

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <User className="w-4 h-4 text-[#2ECC71]" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-base sm:text-lg py-2 sm:py-3"
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-[#2ECC71]" />
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => {
                    // Allow only numbers and limit to 10 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile: value });
                  }}
                  maxLength={10}
                  className="text-base sm:text-lg py-2 sm:py-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  10-digit mobile number (login ID)
                </p>
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 text-[#2ECC71]" />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  placeholder="Date of birth"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="cursor-pointer text-base sm:text-lg py-2 sm:py-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select your date of birth
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27AE60] hover:to-[#1E8449] py-2 sm:py-3 text-sm sm:text-base">
                {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <UserPlus className="mr-2 w-4 h-4" />}
                {isLoading ? 'Registering...' : 'Register'}
              </Button>

            </form>
          )}

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full mt-4 text-sm sm:text-base py-2 sm:py-3"
          >
            ← Back to Home
          </Button>

        </div>
      </motion.div>
    </div>
  );
}