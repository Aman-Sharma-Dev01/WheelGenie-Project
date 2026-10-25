import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Check, X, AlertTriangle } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { COUNTRIES, getCitiesForCountry } from '../../utils/locationConfig';

export default function LocationModal({ isOpen, onClose, forceSelect = false }) {
  const {
    country,
    city,
    setCity,
    detectLocation,
    isLocating,
    error,
  } = useLocationContext();

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedCity, setSelectedCity] = useState(city);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationNotice, setLocationNotice] = useState('');

  // Sync internal state during render when opened
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedCountry(country);
      setSelectedCity(city);
      setLocationNotice('');
      setSearchQuery('');
    }
  }

  // When selected country changes in the modal, adjust city choices
  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    const countryCities = getCitiesForCountry(newCountry);
    setSelectedCity(countryCities[0]?.name || '');
    setLocationNotice('');
  };

  // Get cities filtered by search query
  const cities = getCitiesForCountry(selectedCountry).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Handle GPS detection
  const handleDetectLocation = async () => {
    setLocationNotice('Detecting your location...');
    const result = await detectLocation();
    if (result?.success) {
      setSelectedCountry(result.country);
      setSelectedCity(result.city);
      setLocationNotice(`Detected: ${result.city}, ${result.country}`);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setLocationNotice('');
    }
  };

  // Confirm manual selection
  const handleConfirm = () => {
    if (selectedCountry && selectedCity) {
      setCity(selectedCity, selectedCountry);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => {
            if (!forceSelect) onClose();
          }}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-wg-blue flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h2 className="text-xl font-bold text-wg-navy">Choose Your Location</h2>
              </div>
              <p className="text-xs text-slate-500">
                Find cars available in your country and city with accurate local currency.
              </p>
            </div>

            {!forceSelect && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="p-6 overflow-y-auto space-y-5">
            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Marketplace Country
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(COUNTRIES).map((c) => {
                  const isSelected = selectedCountry === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleCountryChange(c.name)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-wg-blue bg-blue-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className={`text-sm font-semibold ${isSelected ? 'text-wg-blue' : 'text-slate-800'}`}>
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Currency: <span className="font-semibold">{c.currency} ({c.currencySymbol})</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-wg-blue shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geolocation Button */}
            <div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all disabled:opacity-60 cursor-pointer shadow-xs"
              >
                <Navigation size={14} className={isLocating ? 'animate-spin text-wg-blue' : 'text-wg-blue'} />
                <span>{isLocating ? 'Detecting Your Location...' : 'Use My Current Location'}</span>
              </button>
            </div>

            {/* Notification / Error / Unsupported notice */}
            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {locationNotice && !error && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
                <Check size={14} className="text-blue-600" />
                <span>{locationNotice}</span>
              </div>
            )}

            {/* City Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select City in {selectedCountry}
                </label>
                <span className="text-[11px] text-slate-400">
                  {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                </span>
              </div>

              {/* City Search Bar */}
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search cities in ${selectedCountry}...`}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-wg-blue bg-white"
                />
              </div>

              {/* Cities Grid */}
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {cities.map((c) => {
                  const isCitySelected = selectedCity.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => setSelectedCity(c.name)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all truncate ${
                        isCitySelected
                          ? 'border-wg-blue bg-blue-50 text-wg-blue font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                      title={c.name}
                    >
                      {c.name}
                    </button>
                  );
                })}
                {cities.length === 0 && (
                  <div className="col-span-3 py-4 text-center text-xs text-slate-400">
                    No cities matching "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            {!forceSelect && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedCity}
              className="px-6 py-2.5 rounded-xl bg-wg-blue text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              Explore {selectedCity}, {selectedCountry}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
