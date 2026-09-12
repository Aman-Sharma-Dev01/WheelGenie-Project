import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/authApi';
import { AppleIcon, MicrosoftIcon } from '../components/common/SocialIcons';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import car1 from '../assets/car1.png';
import car from '../assets/car.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email.trim(), formData.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wg-auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient Animated Light Orbs for Mirror Reflection */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="w-[480px] h-[480px] bg-[#6c42f5]/35 rounded-full blur-[130px] pointer-events-none absolute -top-20 -left-20"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -35, 0],
          y: [0, 35, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="w-[520px] h-[520px] bg-[#3b1fb5]/45 rounded-full blur-[140px] pointer-events-none absolute -bottom-20 -right-20"
      />
      <div className="w-80 h-80 bg-fuchsia-600/15 rounded-full blur-[110px] pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2" />

      {/* Main Mirror-Like Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="wg-mirror-card w-full max-w-4xl rounded-[32px] overflow-hidden grid lg:grid-cols-12 relative z-10 shadow-[0_30px_70px_-15px_rgba(10,5,40,0.65)]"
      >
        {/* Specular Diagonal Sheen Reflection across the card */}
        <div className="wg-mirror-sheen" />

        {/* Left Form Column (Frosted Glass Mirror) */}
        <div className="lg:col-span-7 bg-white/75 backdrop-blur-2xl p-6 sm:p-9 flex flex-col justify-between relative z-20">
          
          <div>
            {/* Top In-Card Header: ONLY Back Option (Logo removed) */}
            <div className="flex items-center justify-start mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6c42f5] transition-all py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 shadow-sm backdrop-blur-md group"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </Link>
            </div>

            {/* Buyer / Seller Segmented Switcher */}
            <div className="flex bg-slate-200/50 backdrop-blur-md p-1 rounded-xl mb-6 relative border border-white/60 shadow-inner">
              <button
                type="button"
                onClick={() => handleRoleChange('buyer')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 cursor-pointer ${
                  role === 'buyer' ? 'text-white drop-shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buyer Login
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('seller')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 cursor-pointer ${
                  role === 'seller' ? 'text-white drop-shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Seller Login
              </button>

              {/* Animated Sliding Pill */}
              <motion.div
                className="absolute inset-y-1 rounded-lg bg-gradient-to-r from-[#5932ea] to-[#7146f6] shadow-md z-0"
                initial={false}
                animate={{
                  left: role === 'buyer' ? '4px' : '50%',
                  right: role === 'buyer' ? '50%' : '4px',
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            </div>

            {/* Title & Subtitle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-6"
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  <span className="text-[#6c42f5] capitalize">{role}</span> Login
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {role === 'buyer'
                    ? 'Welcome back! Find your next car today.'
                    : 'Welcome back! Manage and grow your listings.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 rounded-xl bg-red-50/90 border border-red-200/80 backdrop-blur-md flex items-center gap-2 text-red-600 text-xs font-medium"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
              {/* Hidden dummy inputs to prevent aggressive browser autofill */}
              <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              {/* Email Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  autoComplete="off"
                  className="wg-mirror-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  autoComplete="new-password"
                  className="wg-mirror-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff size={16} className="text-slate-500" /> : <Eye size={16} className="text-slate-500" />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your registered email.')}
                  className="text-xs font-semibold text-[#6c42f5] hover:text-[#5527e0] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="wg-purple-btn w-full py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-65 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-5">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-slate-200/80 w-full" />
                <span className="bg-white/70 backdrop-blur-md px-3 text-[11px] text-slate-400 font-medium whitespace-nowrap rounded-full">
                  or continue with
                </span>
                <div className="border-t border-slate-200/80 w-full" />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <GoogleSignInButton
                  onSuccess={() => navigate(redirectPath, { replace: true })}
                  onError={(msg) => setError(msg)}
                />
                <button
                  type="button"
                  className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer text-slate-800"
                  title="Continue with Apple"
                >
                  <AppleIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer"
                  title="Continue with Microsoft"
                >
                  <MicrosoftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Switcher */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to={role === 'seller' ? '/signup?role=seller' : '/signup?role=buyer'}
              state={location.state}
              className="font-semibold text-[#6c42f5] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Feature Panel (Deep Violet Translucent Mirror Glass) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#150d45]/92 via-[#26136e]/88 to-[#4a20c9]/92 backdrop-blur-2xl text-white p-9 flex-col justify-between relative overflow-hidden z-20 border-l border-white/20">
          {/* Subtle Ambient Reflections */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Typography */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 pt-4"
            >
              {role === 'buyer' ? (
                <>
                  <h2 className="text-3xl font-extrabold tracking-tight leading-snug font-['Poppins',sans-serif]">
                    Find.<br />
                    Compare.<br />
                    Drive.
                  </h2>
                  <p className="text-purple-200/80 text-xs mt-3 leading-relaxed">
                    Your next car is just a login away.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold tracking-tight leading-snug font-['Poppins',sans-serif]">
                    List.<br />
                    Reach.<br />
                    Sell Faster.
                  </h2>
                  <p className="text-purple-200/80 text-xs mt-3 leading-relaxed">
                    Turn your car into opportunity.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Floating Vehicle Artwork with Ambient Shadow */}
          <div className="relative my-auto py-6 z-10 flex flex-col items-center">
            <motion.img
              key={role}
              src={role === 'buyer' ? car1 : car}
              alt="WheelGenie Car"
              className="w-full max-w-[280px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)] object-contain select-none pointer-events-none"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: [0, -7, 0], opacity: 1 }}
              transition={{
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.4 },
              }}
            />
            {/* Diffused Shadow Glow under Car */}
            <div className="w-44 h-6 bg-black/45 blur-lg rounded-full mt-1" />
          </div>

          {/* Script Branding Tagline */}
          <div className="relative z-10 text-right pt-2 border-t border-white/15">
            <span className="text-purple-200/60 text-xs italic tracking-wider font-serif">
              Smarter Cars, Brighter Journeys
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
