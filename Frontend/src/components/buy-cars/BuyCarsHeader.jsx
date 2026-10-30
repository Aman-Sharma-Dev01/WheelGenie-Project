import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { COUNTRIES } from '../../utils/locationConfig';

export default function BuyCarsHeader({
  searchTerm,
  onSearchChange,
  onToggleMobileFilters,
  onOpenLocationModal,
}) {
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  const [localInput, setLocalInput] = useState(searchTerm);
  const { city, country } = useLocationContext();
  const countryConfig = COUNTRIES[country] || COUNTRIES.India;

  // Sync state during render when external search term changes
  if (prevSearchTerm !== searchTerm) {
    setPrevSearchTerm(searchTerm);
    setLocalInput(searchTerm);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localInput !== searchTerm) {
        onSearchChange(localInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localInput, searchTerm, onSearchChange]);

  const handleClear = () => {
    setLocalInput('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      {/* Left: Heading and Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Buy Cars
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Find your perfect car from thousands of verified listings.
        </p>
      </div>

      {/* Right: Location Pill & Search Bar */}
      <div className="flex items-center gap-2.5 w-full md:w-auto">
        {/* Location Selector Pill */}
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/15 hover:border-[#2F80ED] hover:bg-white/15 rounded-lg text-xs font-semibold text-white shadow-sm transition backdrop-blur-md cursor-pointer shrink-0"
          title="Change Country or City"
          aria-label="Change location"
        >
          <MapPin size={13} className="text-[#38BDF8]" />
          <span>{city ? `${city}, ${country}` : country}</span>
          <span className="text-sm">{countryConfig.flag}</span>
          <ChevronDown size={13} className="text-slate-300" />
        </button>

        {/* Search Input Box */}
        <div className="relative flex-1 md:w-[320px] lg:w-[380px] flex items-center bg-white/95 border border-white/80 rounded-lg shadow-md backdrop-blur-xl focus-within:border-[#2F80ED] focus-within:ring-2 focus-within:ring-[#2F80ED]/30 transition">
          <Search size={16} className="text-[#2F80ED] ml-3 shrink-0" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search by make, model, or city"
            aria-label="Search listings"
            className="w-full py-2 pl-2 pr-8 text-xs text-[#092340] font-medium placeholder-slate-400 bg-transparent outline-hidden"
          />

          {localInput && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 mr-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Filter button for mobile/tablet drawer */}
          <button
            type="button"
            onClick={onToggleMobileFilters}
            className="p-1.5 mr-1.5 text-slate-500 hover:text-[#2F80ED] hover:bg-slate-100 rounded transition cursor-pointer border-l border-slate-200"
            aria-label="Open filters"
            title="Open Filters"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
