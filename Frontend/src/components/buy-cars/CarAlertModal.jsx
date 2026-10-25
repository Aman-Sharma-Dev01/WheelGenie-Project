import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { getMakesForCountry, getModelsForMake, COUNTRIES } from '../../utils/locationConfig';
import { createCarAlert } from '../../services/alertService';

export default function CarAlertModal({
  isOpen,
  onClose,
  initialFilters = {},
}) {
  const { country, city, currency } = useLocationContext();
  const { user } = useAuth();
  const countryConfig = COUNTRIES[country] || COUNTRIES.India;

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [formData, setFormData] = useState({
    country: country,
    city: city,
    brand: initialFilters.brand || '',
    model: initialFilters.model || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    year: initialFilters.minYear || '',
    fuel: initialFilters.fuel || '',
    email: user?.email || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prepopulate from filters during render when modal opens
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData({
        country: country,
        city: city,
        brand: initialFilters.brand || '',
        model: initialFilters.model || '',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        year: initialFilters.minYear || '',
        fuel: initialFilters.fuel ? initialFilters.fuel.split(',')[0] : '',
        email: user?.email || '',
      });
      setSuccessMessage('');
      setErrorMessage('');
    }
  }

  const availableMakes = getMakesForCountry(formData.country || country);
  const availableModels = formData.brand
    ? getModelsForMake(formData.country || country, formData.brand)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { model: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await createCarAlert(formData);
      if (res?.success) {
        setSuccessMessage(res.message || 'Vehicle alert created successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res?.message || 'Failed to create alert');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 overflow-y-auto">
        {/* Ambient Royal Violet Atmosphere Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0c0624]/85 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Glowing Ambient Light Orbs matching WheelGenie theme */}
          <div className="absolute top-1/4 left-1/3 w-[460px] h-[460px] bg-[#6c42f5]/30 rounded-full blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#3b1fb5]/40 rounded-full blur-[140px] pointer-events-none translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-[110px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {/* Premium Royal Violet Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden z-10 border border-purple-400/25 shadow-[0_30px_80px_-15px_rgba(10,5,40,0.85),0_0_0_1px_rgba(255,255,255,0.08)_inset] bg-gradient-to-br from-[#160d45]/96 via-[#221063]/94 to-[#0e072b]/98 backdrop-blur-2xl text-white my-8"
        >
          {/* Subtle Specular Sheen Reflections */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/25 to-indigo-600/35 border border-purple-400/35 text-[#c4b5fd] flex items-center justify-center shadow-[0_0_20px_rgba(124,85,247,0.3)] shrink-0">
                <Bell size={20} className="text-[#c4b5fd]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Set Vehicle Alert</h2>
                <p className="text-xs text-purple-200/75 mt-0.5">
                  Get notified instantly when your ideal car is listed.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-purple-200/60 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
            {successMessage && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-400/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Country & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] text-purple-200/60 border border-white/10 rounded-xl text-xs cursor-not-allowed outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-purple-200/40 border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all"
                />
              </div>
            </div>

            {/* Make & Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Make
                </label>
                <div className="relative">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#180e46] text-white">Any Make</option>
                    {availableMakes.map((m) => (
                      <option key={m} value={m} className="bg-[#180e46] text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Model
                </label>
                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    disabled={!formData.brand}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <option value="" className="bg-[#180e46] text-white">Any Model</option>
                    {availableModels.map((m) => (
                      <option key={m} value={m} className="bg-[#180e46] text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Min Price & Max Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Min Price ({currency})
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  placeholder="e.g. 200000"
                  className="w-full px-3.5 py-2.5 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-purple-200/40 border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Max Price ({currency})
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1500000"
                  className="w-full px-3.5 py-2.5 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-purple-200/40 border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all"
                />
              </div>
            </div>

            {/* Min Year & Fuel Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Min Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                  className="w-full px-3.5 py-2.5 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-purple-200/40 border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Fuel Type
                </label>
                <div className="relative">
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#180e46] text-white">Any Fuel</option>
                    {countryConfig.fuelTypes?.map((f) => (
                      <option key={f} value={f} className="bg-[#180e46] text-white">
                        {f}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Notification Email */}
            <div>
              <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                Notification Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-3.5 py-2.5 bg-white/[0.07] hover:bg-white/[0.09] focus:bg-white/[0.12] text-white placeholder-purple-200/40 border border-white/15 focus:border-[#7c55f7] rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-[#7c55f7]/30 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-purple-200/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="wg-purple-btn px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg shadow-purple-600/35 hover:shadow-purple-600/50 flex items-center gap-2 disabled:opacity-60 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Alert...</span>
                  </>
                ) : (
                  <>
                    <Bell size={13} />
                    <span>Create Vehicle Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
