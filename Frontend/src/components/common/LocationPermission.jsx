import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Search,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useUserLocation } from "../../context/LocationContext";

/**
 * LocationPermission Component
 *
 * Prompts the user to grant location permissions via browser GPS or select their city manually.
 * Supports modal, card, and banner variants.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=true] - Controls visibility in modal mode
 * @param {Function} [props.onClose] - Callback when closed or dismissed
 * @param {Function} [props.onLocationGranted] - Callback when location is detected or selected
 * @param {'modal' | 'card' | 'banner'} [props.variant='modal'] - Presentation style
 * @param {string} [props.title] - Custom title
 * @param {string} [props.description] - Custom description
 */
export default function LocationPermission({
  isOpen = true,
  onClose,
  onLocationGranted,
  variant = "modal",
  title,
  description,
}) {
  const {
    city,
    isLocating,
    error: locationError,
    detectLocation,
    setCity,
    popularCities,
    availableCities,
  } = useUserLocation();

  const [mode, setMode] = useState("prompt"); // 'prompt' | 'manual'
  const [searchQuery, setSearchQuery] = useState("");
  const [localError, setLocalError] = useState(null);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return availableCities;
    const q = searchQuery.toLowerCase();
    return availableCities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [searchQuery, availableCities]);

  // Handle GPS detection
  const handleAllowLocation = async () => {
    setLocalError(null);
    const result = await detectLocation();
    if (result && result.success) {
      if (onLocationGranted) onLocationGranted(result.details);
      if (onClose) onClose();
    } else {
      // Switch to manual mode if permission denied or unavailable
      setMode("manual");
      setLocalError(
        result?.error ||
          "Could not detect location. Please select your city from the list below."
      );
    }
  };

  // Handle manual city selection
  const handleSelectCity = (cityName) => {
    setCity(cityName);
    if (onLocationGranted) onLocationGranted({ city: cityName });
    if (onClose) onClose();
  };

  // Content for the Permission Prompt view
  const renderPromptContent = () => (
    <div className="flex flex-col items-center text-center">
      {/* Icon with radar pulse */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-blue-100"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1.5], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          className="absolute inset-2 rounded-full bg-blue-200"
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#247CF0] to-[#1a5bb8] text-white shadow-lg shadow-blue-500/30">
          <MapPin className="h-7 w-7" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-[#0B1F3A] sm:text-2xl">
        {title || "Enable Location Access"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
        {description ||
          "WheelGenie personalizes car availability, on-road prices, and local inspection slots based on your city."}
      </p>

      {/* Feature perks */}
      <div className="my-5 w-full rounded-2xl bg-slate-50 p-4 text-left border border-slate-100 space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
          <span>Accurate RTO registration & on-road prices</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
          <Check className="h-4 w-4 text-[#247CF0] shrink-0" />
          <span>Cars available in and around your vicinity</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
          <Navigation className="h-4 w-4 text-purple-500 shrink-0" />
          <span>Doorstep test drives and instant car inspection</span>
        </div>
      </div>

      {/* Error alert if any */}
      {(localError || locationError) && (
        <div className="mb-4 flex w-full items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-left border border-amber-200 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{localError || locationError}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex w-full flex-col gap-2.5">
        <button
          type="button"
          onClick={handleAllowLocation}
          disabled={isLocating}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#247CF0] font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-600 active:scale-[0.99] disabled:opacity-60 cursor-pointer text-sm"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              <span>Allow Location Access</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer text-xs"
        >
          Select City Manually
        </button>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
        >
          I'll do this later
        </button>
      )}
    </div>
  );

  // Content for the Manual City Selection view
  const renderManualContent = () => (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Choose Your City</h3>
          <p className="text-xs text-slate-500">Pick from our supported automotive hubs</p>
        </div>
        <button
          type="button"
          onClick={() => setMode("prompt")}
          className="text-xs font-semibold text-[#247CF0] hover:underline cursor-pointer"
        >
          ← Back to GPS
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mt-3.5">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search city or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          autoFocus
        />
      </div>

      {/* Popular Cities Pills */}
      {!searchQuery && (
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Popular Cities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {popularCities.map((item) => {
              const isSelected = city === item.name;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCity(item.name)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-[#247CF0] text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All Cities Scrollable List */}
      <div className="mt-3 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
        {filteredCities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No cities found matching "{searchQuery}"
          </div>
        ) : (
          filteredCities.map((c) => {
            const isSelected = city === c.name;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCity(c.name)}
                className={`flex w-full items-center justify-between py-2.5 px-2.5 text-left rounded-xl text-xs transition cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-[#247CF0] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div>
                  <span className="font-semibold">{c.name}</span>
                  <span className="ml-1.5 text-slate-400 font-normal">({c.state})</span>
                </div>
                {isSelected ? (
                  <Check size={15} className="text-[#247CF0]" />
                ) : (
                  <ChevronRight size={14} className="text-slate-300" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // Variant: Card (embedded directly inside a page)
  if (variant === "card") {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {mode === "prompt" ? renderPromptContent() : renderManualContent()}
      </div>
    );
  }

  // Variant: Banner (horizontal notification strip)
  if (variant === "banner") {
    if (!isOpen) return null;
    return (
      <div className="w-full border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-xs text-slate-700">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#247CF0] text-white shrink-0">
              <MapPin size={14} />
            </div>
            <div>
              <span className="font-bold text-slate-900">
                Current Location: {city || "Not Set"}
              </span>{" "}
              <span className="text-slate-500 hidden sm:inline">
                — Enable GPS to find cars and calculate local valuations near you.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAllowLocation}
              disabled={isLocating}
              className="rounded-lg bg-[#247CF0] px-3 py-1.5 font-bold text-white shadow-sm hover:bg-blue-600 cursor-pointer"
            >
              {isLocating ? "Locating..." : "Enable GPS"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variant: Modal (Default overlay)
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-7"
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}

            {mode === "prompt" ? renderPromptContent() : renderManualContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
