import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Shield, Key, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

export function AdminLogin() {
  const navigate = useNavigate();
  const [mpin, setMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get MPIN from environment variable
  const ADMIN_MPIN = import.meta.env.VITE_ADMIN_MPIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mpin) {
      toast.error('Please enter MPIN');
      return;
    }
    
    if (mpin.length !== 6) {
      toast.error('MPIN must be 6 digits');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (mpin === ADMIN_MPIN) {
        localStorage.setItem('adminLoggedIn', 'true');
        toast.success('Admin login successful!');
        navigate('/admin-panel');
      } else {
        toast.error('Invalid MPIN. Access denied.');
        setMpin('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAFAF1]/30 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl text-[#2C3E50] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
          >
            Admin Access
          </h1>
          <p className="text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
            Enter 6-digit MPIN to continue
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#EAFAF1]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2ECC71]" />
                MPIN (6 digits)
              </Label>
              <Input
                type="password"
                placeholder="Enter 6-digit MPIN"
                value={mpin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setMpin(value);
                }}
                maxLength={6}
                className="text-center text-2xl tracking-wider font-mono"
                autoFocus
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit MPIN provided by the store owner
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || mpin.length !== 6}
              className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27AE60] hover:to-[#196f3d] text-white py-3"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Key className="mr-2" />
              )}
              {isLoading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full mt-4"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}