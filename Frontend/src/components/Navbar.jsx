import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png.png";
import VehicleHoverButton from "./VehicleHoverButton";
import { useAuth } from "../context/AuthContext";

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
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_4px_30px_rgba(11,31,58,0.025)] transition-all duration-300">
      <div className="wg-container">
        <div className="flex h-[76px] items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="WheelGenie Home"
          >
            <img
              src={logo}
              alt="WheelGenie"
              className="h-[180px] w-[180px] object-contain -mt-[40px] -mb-[64px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            {navigation.map((item) => {
              const active = activePage === item.key;

              return (
                <Link
                  key={item.key}
                  to={item.href}
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
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-full bg-wg-blue text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col text-left pr-1">
                    <span className="text-xs font-semibold text-wg-navy leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize leading-tight">
                      {user.role || "Customer"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <VehicleHoverButton
                  href="/login"
                  variant="login"
                  className="rounded-lg border border-slate-200/90 bg-white/70 px-7 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-white hover:border-slate-300 hover:text-wg-navy hover:shadow-[0_4px_16px_rgba(11,31,58,0.06)] backdrop-blur-sm inline-block text-center"
                >
                  Log In
                </VehicleHoverButton>

                <VehicleHoverButton
                  href="/signup"
                  variant="signup"
                  className="rounded-lg bg-wg-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,128,237,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_12px_28px_rgba(47,128,237,0.36)] inline-block text-center"
                >
                  Sign Up
                </VehicleHoverButton>
              </>
            )}
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
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-slate-100 py-4 text-sm font-medium ${
                    activePage === item.key
                      ? "text-wg-blue"
                      : "text-slate-700 hover:text-wg-navy"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-4 pt-2">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-3 pb-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="w-9 h-9 rounded-full bg-wg-blue text-white flex items-center justify-center text-xs font-bold">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-wg-navy">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-lg border border-red-200 bg-red-50/50 py-3 text-center text-sm font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 pb-3">
                    <VehicleHoverButton
                      href="/login"
                      variant="login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-lg border border-slate-200 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 block"
                    >
                      Log In
                    </VehicleHoverButton>

                    <VehicleHoverButton
                      href="/signup"
                      variant="signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-lg bg-wg-blue py-3 text-center text-sm font-semibold text-white hover:bg-blue-600 block"
                    >
                      Sign Up
                    </VehicleHoverButton>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
