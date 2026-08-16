import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png.png";
import VehicleHoverButton from "./VehicleHoverButton";

const navigation = [
  { name: "Buy", href: "/buy", key: "buy" },
  { name: "Sell", href: "/sell", key: "sell" },
  { name: "AI Calculator", href: "/calculator", key: "calculator" },
  { name: "About Us", href: "/", key: "about" },
  { name: "How It Works", href: "/how-it-works", key: "how" },
  { name: "Contact", href: "/contact", key: "contact" },
];

export default function Navbar({ activePage = "about" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="wg-container">
        <div className="flex h-[76px] items-center justify-between">
          
          {/* Logo */}
          <a
            href="/"
            className="flex shrink-0 items-center"
            aria-label="WheelGenie Home"
          >
            <img
              src={logo}
              alt="WheelGenie"
              className="h-[180px] w-[180px] object-contain -mt-[40px] -mb-[64px]"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            {navigation.map((item) => {
              const active = activePage === item.key;

              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={`group relative py-7 text-[15px] font-medium transition-colors duration-200 ${
                    active ? "text-wg-blue" : "text-slate-600 hover:text-wg-navy"
                  }`}
                >
                  {item.name}

                  <span
                    className={`absolute bottom-[8px] left-1/2 h-[2px] -translate-x-1/2 bg-wg-blue transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <VehicleHoverButton
              href="/login"
              variant="login"
              className="rounded-lg border border-slate-200 px-7 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-wg-navy"
            >
              Log In
            </VehicleHoverButton>

            <VehicleHoverButton
              href="/signup"
              variant="signup"
              className="rounded-lg bg-wg-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,128,237,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Sign Up
            </VehicleHoverButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-100 lg:hidden bg-white/95 backdrop-blur-md"
          >
            <nav className="wg-container flex flex-col py-4">
              {navigation.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-slate-100 py-4 text-sm font-medium ${
                    activePage === item.key
                      ? "text-wg-blue"
                      : "text-slate-700 hover:text-wg-navy"
                  }`}
                >
                  {item.name}
                </a>
              ))}

              <div className="mt-4 flex gap-3 pb-3">
                <VehicleHoverButton
                  href="/login"
                  variant="login"
                  className="flex-1 rounded-lg border border-slate-200 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </VehicleHoverButton>

                <VehicleHoverButton
                  href="/signup"
                  variant="signup"
                  className="flex-1 rounded-lg bg-wg-blue py-3 text-center text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Sign Up
                </VehicleHoverButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}