import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import {
  getMakesForCountry,
  getModelsForMake,
  COUNTRIES,
} from '../../utils/locationConfig';
import { formatCurrency } from '../../utils/currencyFormatter';

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

export default function CarFilters({
  filters,
  onApplyFilters,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
}) {
  const { country, currency } = useLocationContext();
  const countryConfig = COUNTRIES[country] || COUNTRIES.India;
  const priceConfig = countryConfig.priceRange;

  const filtersKey = `${country}_${filters.brand}_${filters.model}_${filters.minYear}_${filters.maxYear}_${filters.maxPrice}_${filters.fuel}_${filters.transmission}_${filters.ownership}`;
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);

  // Local state for sidebar inputs before applying
  const [selectedMake, setSelectedMake] = useState(filters.brand || '');
  const [selectedModel, setSelectedModel] = useState(filters.model || '');
  const [minYear, setMinYear] = useState(filters.minYear || '');
  const [maxYear, setMaxYear] = useState(filters.maxYear || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || priceConfig.max);
  const [fuels, setFuels] = useState(filters.fuel ? filters.fuel.split(',') : []);
  const [transmissions, setTransmissions] = useState(
    filters.transmission ? filters.transmission.split(',') : []
  );
  const [ownerships, setOwnerships] = useState(
    filters.ownership ? filters.ownership.split(',') : []
  );

  // Available makes & models for current country
  const availableMakes = getMakesForCountry(country);
  const availableModels = selectedMake ? getModelsForMake(country, selectedMake) : [];
  const availableFuels = countryConfig.fuelTypes || ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  // Keep local state in sync during render when parent filters or country changes
  if (prevFiltersKey !== filtersKey) {
    setPrevFiltersKey(filtersKey);
    setSelectedMake(filters.brand || '');
    setSelectedModel(filters.model || '');
    setMinYear(filters.minYear || '');
    setMaxYear(filters.maxYear || '');
    setMaxPrice(filters.maxPrice || priceConfig.max);
    setFuels(filters.fuel ? filters.fuel.split(',') : []);
    setTransmissions(filters.transmission ? filters.transmission.split(',') : []);
    setOwnerships(filters.ownership ? filters.ownership.split(',') : []);
  }

  // Handle Make change -> reset model
  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel('');
  };

  // Toggle Fuel checkbox
  const toggleFuel = (fuelName) => {
    setFuels((prev) =>
      prev.includes(fuelName) ? prev.filter((f) => f !== fuelName) : [...prev, fuelName]
    );
  };

  // Toggle Transmission checkbox
  const toggleTransmission = (trans) => {
    setTransmissions((prev) =>
      prev.includes(trans) ? prev.filter((t) => t !== trans) : [...prev, trans]
    );
  };

  // Toggle Ownership checkbox
  const toggleOwnership = (owner) => {
    setOwnerships((prev) =>
      prev.includes(owner) ? prev.filter((o) => o !== owner) : [...prev, owner]
    );
  };

  // Apply filters
  const handleApply = () => {
    let validMinYear = minYear;
    let validMaxYear = maxYear;
    if (minYear && maxYear && Number(minYear) > Number(maxYear)) {
      validMinYear = maxYear;
      validMaxYear = minYear;
      setMinYear(validMinYear);
      setMaxYear(validMaxYear);
    }

    onApplyFilters({
      brand: selectedMake,
      model: selectedModel,
      minYear: validMinYear,
      maxYear: validMaxYear,
      maxPrice: maxPrice < priceConfig.max ? maxPrice : null,
      fuel: fuels.join(','),
      transmission: transmissions.join(','),
      ownership: ownerships.join(','),
    });

    if (onCloseMobile) onCloseMobile();
  };

  // Reset filters
  const handleReset = () => {
    setSelectedMake('');
    setSelectedModel('');
    setMinYear('');
    setMaxYear('');
    setMaxPrice(priceConfig.max);
    setFuels([]);
    setTransmissions([]);
    setOwnerships([]);
    onResetFilters();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`bg-white rounded-xl border border-slate-200 p-4 shadow-2xs w-full lg:w-[220px] xl:w-[230px] shrink-0 transition-transform duration-300 lg:static lg:block ${
          isOpenMobile
            ? 'fixed top-0 left-0 bottom-0 z-50 w-[280px] overflow-y-auto translate-x-0'
            : 'hidden lg:block'
        }`}
      >
        {/* Top Header: Filters & Reset */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#155DFC] hover:underline cursor-pointer"
            >
              Reset
            </button>
            {isOpenMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 text-slate-400 hover:text-slate-600 lg:hidden"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 1. Price Range */}
        <div className="py-3.5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-800 mb-2">
            Price Range
          </label>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span>{formatCurrency(priceConfig.min, country, currency)}</span>
            <span className="font-semibold text-slate-700">
              {maxPrice >= priceConfig.max
                ? `${formatCurrency(priceConfig.max, country, currency)}+`
                : formatCurrency(maxPrice, country, currency)}
            </span>
          </div>
          <input
            type="range"
            min={priceConfig.min}
            max={priceConfig.max}
            step={priceConfig.step}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Filter maximum price"
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#155DFC]"
          />
        </div>

        {/* 2. Make */}
        <div className="py-3.5 border-b border-slate-100">
          <label htmlFor="filter-make" className="block text-xs font-semibold text-slate-800 mb-1.5">
            Make
          </label>
          <div className="relative">
            <select
              id="filter-make"
              value={selectedMake}
              onChange={handleMakeChange}
              aria-label="Select Make"
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-hidden focus:border-[#155DFC] cursor-pointer"
            >
              <option value="">Select Make</option>
              {availableMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Model */}
        <div className="py-3.5 border-b border-slate-100">
          <label htmlFor="filter-model" className="block text-xs font-semibold text-slate-800 mb-1.5">
            Model
          </label>
          <div className="relative">
            <select
              id="filter-model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              aria-label="Select Model"
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-hidden focus:border-[#155DFC] disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
            >
              <option value="">
                {selectedMake ? 'Select Model' : 'Select Make First'}
              </option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 4. Year Range */}
        <div className="py-3.5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Year
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                aria-label="Minimum Year"
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-hidden focus:border-[#155DFC] cursor-pointer"
              >
                <option value="">Min Year</option>
                {YEARS.map((y) => (
                  <option key={`min-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                aria-label="Maximum Year"
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-hidden focus:border-[#155DFC] cursor-pointer"
              >
                <option value="">Max Year</option>
                {YEARS.map((y) => (
                  <option key={`max-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 5. Fuel Type */}
        <div className="py-3.5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-800 mb-2">
            Fuel Type
          </label>
          <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            {availableFuels.map((fuel) => (
              <label key={fuel} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={fuels.includes(fuel)}
                  onChange={() => toggleFuel(fuel)}
                  className="rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC]"
                />
                <span className="truncate">{fuel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 6. Transmission */}
        <div className="py-3.5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-800 mb-2">
            Transmission
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Manual', 'Automatic'].map((trans) => (
              <label key={trans} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={transmissions.includes(trans)}
                  onChange={() => toggleTransmission(trans)}
                  className="rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC]"
                />
                <span>{trans}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 7. Ownership */}
        <div className="py-3.5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-800 mb-2">
            Ownership
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['First Owner', 'Second Owner'].map((owner) => (
              <label key={owner} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ownerships.includes(owner)}
                  onChange={() => toggleOwnership(owner)}
                  className="rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC]"
                />
                <span className="truncate">{owner}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3.5 space-y-2">
          <button
            type="button"
            onClick={handleApply}
            className="w-full bg-[#155DFC] hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full text-slate-500 hover:text-slate-800 text-xs py-1 text-center transition cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
}
