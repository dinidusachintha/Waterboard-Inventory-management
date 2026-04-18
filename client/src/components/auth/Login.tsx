import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, verifyOTP } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      setStep('otp');
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      onSuccess?.();
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Waterboard Inventory System</h1>
          <p className="mt-2 text-gray-600">Login to access your dashboard</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@waterboard.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                OTP sent to {email}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full mt-3 text-sm text-blue-600 hover:underline"
            >
              Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;