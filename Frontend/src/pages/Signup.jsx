import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/authApi';
import { GoogleIcon, AppleIcon, MicrosoftIcon } from '../components/common/SocialIcons';
import car1 from '../assets/car1.png';
import car from '../assets/car.png';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signup } = useAuth();

  const redirectPath = location.state?.from?.pathname || '/';

  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Phone number must contain at least 10 digits.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'customer',
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const buyerChecklist = [
    'AI-powered car recommendations',
    'Verified listings',
    'Compare prices easily',
    'Secure & trusted platform',
  ];

  const sellerChecklist = [
    'Reach thousands of verified buyers',
    'Get AI-based valuation',
    'Manage your listings easily',
    'Sell faster with confidence',
  ];

  return (
    <div className="wg-auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient Animated Light Orbs */}
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
        {/* Specular Diagonal Sheen Reflection */}
        <div className="wg-mirror-sheen" />

        {/* Left Form Column (Frosted Glass Mirror) */}
        <div className="lg:col-span-7 bg-white/75 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between relative z-20">
          
          <div>
            {/* Top In-Card Header: ONLY Back Option (Logo removed) */}
            <div className="flex items-center justify-start mb-5">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6c42f5] transition-all py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 shadow-sm backdrop-blur-md group"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </Link>
            </div>

            {/* Buyer / Seller Segmented Switcher */}
            <div className="flex bg-slate-200/50 backdrop-blur-md p-1 rounded-xl mb-5 relative border border-white/60 shadow-inner">
              <button
                type="button"
                onClick={() => handleRoleChange('buyer')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 cursor-pointer ${
                  role === 'buyer' ? 'text-white drop-shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buyer Sign Up
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('seller')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 cursor-pointer ${
                  role === 'seller' ? 'text-white drop-shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Seller Sign Up
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
                className="text-center mb-5"
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  <span className="text-[#6c42f5] capitalize">{role}</span> Sign Up
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {role === 'buyer'
                    ? 'Create your account and start your car journey.'
                    : 'Create your account and start listing your car today.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3.5 p-3 rounded-xl bg-red-50/90 border border-red-200/80 backdrop-blur-md flex items-center gap-2 text-red-600 text-xs font-medium"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  autoComplete="off"
                  className="wg-mirror-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  autoComplete="off"
                  className="wg-mirror-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  autoComplete="off"
                  className="wg-mirror-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  autoComplete="new-password"
                  className="wg-mirror-input w-full pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-[#6c42f5] focus:ring-[#6c42f5]/20 w-3.5 h-3.5 accent-[#6c42f5]"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="text-[#6c42f5] font-semibold hover:underline">Terms of Service</span> and{' '}
                    <span className="text-[#6c42f5] font-semibold hover:underline">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="wg-purple-btn w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-65 disabled:cursor-not-allowed cursor-pointer mt-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-4">
              <div className="relative flex items-center justify-center mb-3">
                <div className="border-t border-slate-200/80 w-full" />
                <span className="bg-white/70 backdrop-blur-md px-3 text-[11px] text-slate-400 font-medium whitespace-nowrap rounded-full">
                  or sign up with
                </span>
                <div className="border-t border-slate-200/80 w-full" />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer"
                  title="Sign up with Google"
                >
                  <GoogleIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer text-slate-800"
                  title="Sign up with Apple"
                >
                  <AppleIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="wg-mirror-social-btn flex items-center justify-center py-2 px-3 rounded-xl cursor-pointer"
                  title="Sign up with Microsoft"
                >
                  <MicrosoftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Switcher */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to={role === 'seller' ? '/login?role=seller' : '/login?role=buyer'}
              state={location.state}
              className="font-semibold text-[#6c42f5] hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Right Feature Panel (Deep Violet Translucent Mirror Glass) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#150d45]/92 via-[#26136e]/88 to-[#4a20c9]/92 backdrop-blur-2xl text-white p-8 sm:p-9 flex-col justify-between relative overflow-hidden z-20 border-l border-white/20">
          {/* Ambient Reflections */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Heading & Checklist */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 pt-2"
            >
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug font-['Poppins',sans-serif] mb-6">
                {role === 'buyer' ? 'Explore a Smarter Way to Buy' : 'List Your Car in Minutes'}
              </h2>

              <div className="space-y-3.5">
                {(role === 'buyer' ? buyerChecklist : sellerChecklist).map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                    className="flex items-center gap-3 text-xs text-purple-100/90"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 size={13} className="text-purple-300" />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Vehicle Artwork */}
          <div className="relative my-auto pt-6 z-10 flex flex-col items-center">
            <motion.img
              key={role}
              src={role === 'buyer' ? car1 : car}
              alt="WheelGenie Car"
              className="w-full max-w-[270px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)] object-contain select-none pointer-events-none"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: [0, -7, 0], opacity: 1 }}
              transition={{
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.4 },
              }}
            />
            {/* Diffused Shadow Glow under Car */}
            <div className="w-40 h-5 bg-black/45 blur-lg rounded-full mt-1" />
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
