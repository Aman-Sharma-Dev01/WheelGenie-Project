import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  CheckCircle2,
  Calendar,
  Fuel,
  Gauge,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { toggleWishlist } from '../../services/wishlistService';

export default function CarDetailModal({
  car,
  isOpen,
  onClose,
  isWishlisted = false,
  onWishlistToggle,
  onRequireLogin,
}) {
  const { country, currency } = useLocationContext();
  const { isAuthenticated } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !car) return null;

  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    try {
      const result = await toggleWishlist(car._id, isWishlisted);
      if (onWishlistToggle) {
        onWishlistToggle(car._id, result.isSaved);
      }
    } catch {
      // Ignored
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBookTestDrive = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 2000);
  };

  const formattedPrice = formatCurrency(car.price, car.country || country, car.currency || currency);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[92vh] flex flex-col"
        >
          {/* Top Banner Image with Overlay */}
          <div className="relative h-64 sm:h-76 w-full bg-slate-900 shrink-0 overflow-hidden">
            <img
              src={car.image || car.fallbackImage}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Quick Actions (Close, Wishlist, Share) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-700 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                title="Share link"
              >
                <Share2 size={16} />
              </button>

              <button
                type="button"
                onClick={handleHeartClick}
                className="w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={16}
                  className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}
                />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-700 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {copiedLink && (
              <div className="absolute top-16 right-4 px-3 py-1 bg-white text-xs font-semibold rounded-lg shadow-md text-emerald-600">
                Link copied to clipboard!
              </div>
            )}

            {/* In-Image Title and Price */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {car.isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-wg-blue text-white text-[10px] font-bold tracking-wider">
                      FEATURED
                    </span>
                  )}
                  {car.isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>WheelGenie 200-Pt Verified</span>
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {car.brand} {car.model}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200">
                  {car.variant || 'Standard Edition'} • {car.bodyType || 'SUV'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                  {formattedPrice}
                </span>
                <span className="text-xs text-slate-300">Marketplace Price</span>
              </div>
            </div>
          </div>

          {/* Scrollable Details Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {bookingSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <strong>Test Drive Requested!</strong>
                  <p className="text-xs text-emerald-700">The verified seller will contact you shortly to confirm the appointment.</p>
                </div>
              </div>
            )}

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Calendar size={14} />
                  <span>Year</span>
                </div>
                <strong className="text-sm text-wg-navy">{car.year}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Fuel size={14} />
                  <span>Fuel</span>
                </div>
                <strong className="text-sm text-wg-navy">{car.fuel}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Gauge size={14} />
                  <span>Kilometers</span>
                </div>
                <strong className="text-sm text-wg-navy">{Number(car.kms).toLocaleString()} km</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <UserCheck size={14} />
                  <span>Ownership</span>
                </div>
                <strong className="text-sm text-wg-navy">{car.ownership}</strong>
              </div>
            </div>

            {/* Location & Specs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex justify-between">
                    <span className="text-slate-400">Transmission</span>
                    <span className="font-semibold">{car.transmission}</span>
                  </li>
                  {car.specs?.engine && (
                    <li className="flex justify-between">
                      <span className="text-slate-400">Engine</span>
                      <span className="font-semibold">{car.specs.engine}</span>
                    </li>
                  )}
                  {car.specs?.power && (
                    <li className="flex justify-between">
                      <span className="text-slate-400">Power</span>
                      <span className="font-semibold">{car.specs.power}</span>
                    </li>
                  )}
                  {car.specs?.mileage && (
                    <li className="flex justify-between">
                      <span className="text-slate-400">Efficiency / Mileage</span>
                      <span className="font-semibold">{car.specs.mileage}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Location & Registration
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex justify-between">
                    <span className="text-slate-400">City</span>
                    <span className="font-semibold">{car.city}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Country</span>
                    <span className="font-semibold">{car.country || country}</span>
                  </li>
                  {car.specs?.rto && (
                    <li className="flex justify-between">
                      <span className="text-slate-400">RTO / Registration</span>
                      <span className="font-semibold">{car.specs.rto}</span>
                    </li>
                  )}
                  {car.specs?.insurance && (
                    <li className="flex justify-between">
                      <span className="text-slate-400">Insurance Status</span>
                      <span className="font-semibold">{car.specs.insurance}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Key Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-wg-blue" />
                  <span>Key Equipment & Features</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs font-medium text-wg-blue"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Contact & Verification */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-wg-blue text-white font-bold flex items-center justify-center text-xs">
                    {car.seller?.name?.[0] || 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{car.seller?.name || 'Verified Dealership'}</h4>
                    <span className="text-[11px] text-slate-300">Certified Marketplace Seller</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {car.seller?.phone && (
                  <a
                    href={`tel:${car.seller.phone}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Seller</span>
                  </a>
                )}
                {car.seller?.email && (
                  <a
                    href={`mailto:${car.seller.email}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Mail size={13} />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <span className="text-xs text-slate-500 block">Total Price:</span>
              <span className="text-lg font-bold text-wg-navy">{formattedPrice}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleBookTestDrive}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-wg-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Book Free Test Drive
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
