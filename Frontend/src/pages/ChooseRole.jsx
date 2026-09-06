import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Tag, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.png.png';

export default function ChooseRole() {
  return (
    <div className="wg-auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient Animated Glow Spheres */}
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

      {/* Main Mirror-Like Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="wg-mirror-card w-full max-w-4xl rounded-[32px] overflow-hidden grid lg:grid-cols-12 relative z-10 shadow-[0_30px_70px_-15px_rgba(10,5,40,0.65)]"
      >
        {/* Specular Diagonal Sheen */}
        <div className="wg-mirror-sheen" />

        {/* Left Welcome Panel (Deep Purple/Navy Gradient) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#150d45]/92 via-[#26136e]/88 to-[#4a20c9]/92 backdrop-blur-2xl text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden z-20">
          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/">
                <img src={logo} alt="WheelGenie" className="h-8 w-auto object-contain brightness-0 invert" />
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Poppins',sans-serif] leading-tight mb-2">
              Welcome to <br />Wheel Genie
            </h1>
            <p className="text-sm font-semibold text-purple-200 mb-1">
              Buy, Sell and value your car with AI.
            </p>
            <p className="text-xs text-purple-200/70 mb-8">
              Please select how you want to continue
            </p>

            {/* 3 Value Badges */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={18} className="text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI-Powered Valuation</h4>
                  <p className="text-[11px] text-purple-200/70">Get the best value for your car</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={18} className="text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Trusted & Secure</h4>
                  <p className="text-[11px] text-purple-200/70">Verified buyers and sellers</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={18} className="text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hassle-Free Experience</h4>
                  <p className="text-[11px] text-purple-200/70">Buy or sell with confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Script Branding */}
          <div className="relative z-10 pt-8 border-t border-white/15">
            <span className="text-purple-200/60 text-xs italic tracking-wider font-serif">
              Smarter Cars, Brighter Journeys
            </span>
          </div>
        </div>

        {/* Right Role Cards Panel (Frosted Mirror Glass) */}
        <div className="lg:col-span-6 bg-white/75 backdrop-blur-2xl p-8 sm:p-10 flex flex-col justify-between z-20 border-l border-white/40">
          <div>
            <div className="flex items-center justify-start mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6c42f5] transition-all py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 shadow-sm backdrop-blur-md group"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Home</span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Choose Your Role
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select how you want to continue
              </p>
            </div>

            {/* Role Card 1: Buyer */}
            <div className="space-y-4">
              <Link
                to="/signup?role=buyer"
                className="group block p-4 rounded-2xl border border-white/80 bg-white/60 hover:bg-white/90 hover:border-[#6c42f5]/50 hover:shadow-lg hover:shadow-purple-500/15 backdrop-blur-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50/90 text-[#6c42f5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                      <Car size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#6c42f5] transition-colors">
                        I'm a Buyer
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Find your perfect car with AI-powered recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-[#6c42f5] text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>

              {/* Role Card 2: Seller */}
              <Link
                to="/signup?role=seller"
                className="group block p-4 rounded-2xl border border-white/80 bg-white/60 hover:bg-white/90 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/15 backdrop-blur-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                      <Tag size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        I'm a Seller
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        List your car and reach thousands of verified buyers.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-emerald-600 text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-slate-500 pt-4 border-t border-slate-200/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#6c42f5] hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
