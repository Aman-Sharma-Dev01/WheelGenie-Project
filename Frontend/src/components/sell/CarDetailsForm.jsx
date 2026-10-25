import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Loader2, Check, AlertCircle } from "lucide-react";
import CarCondition from "./CarCondition";
import { ALL_CITIES } from "../../context/LocationContext";

const inputClass =
  "h-11 w-full rounded-xl border border-white/85 bg-white/75 px-3.5 text-sm font-medium text-[#1D1435] outline-none transition-all placeholder:text-slate-400 focus:bg-white/95 focus:border-[#7F68A9] focus:ring-4 focus:ring-[#7F68A9]/20 shadow-sm backdrop-blur-md";

/**
 * Enhanced Searchable Select Field for Make, Model, Variant
 * Matches the exact inputClass design while offering live search, loading, empty, and error states.
 */
const SearchableSelectField = ({
  label,
  required = true,
  placeholder,
  value, // { id, name } or null
  options = [], // Array of { id, name, logo? }
  onChange,
  onSearch,
  loading = false,
  error = null,
  disabled = false,
  formError = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Filter options locally if no external onSearch is running
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(q));
  }, [options, query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!isOpen) setIsOpen(true);
    if (onSearch) onSearch(val);
  };

  const handleSelectOption = (opt) => {
    onChange?.(opt);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-2 block text-xs font-bold text-[#1D1435]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={isOpen ? query : value?.name || ""}
          placeholder={loading ? "Loading..." : placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
              setQuery("");
            }
          }}
          className={`${inputClass} pr-10 cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${formError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-[#7F68A9]" />
          ) : (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#7F68A9]" : ""}`}
            />
          )}
        </div>
      </div>

      {formError && (
        <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {formError}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-white/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs font-semibold text-slate-500">
              <Loader2 size={15} className="animate-spin text-[#7F68A9]" />
              <span>Loading catalogue...</span>
            </div>
          ) : error ? (
            <div className="p-3 text-center">
              <p className="text-xs font-medium text-amber-700">{error}</p>
              <button
                type="button"
                onClick={() => onSearch?.(query)}
                className="mt-1.5 text-xs font-bold text-[#7F68A9] hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs font-medium text-slate-400">
              {query ? `No results for "${query}"` : "No options available"}
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = value?.name === opt.name || value?.id === opt.id;
              return (
                <button
                  key={opt.id || opt.name}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-[#7F68A9]/20 text-[#1D1435]"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-[#1D1435]"
                  }`}
                >
                  <span className="truncate">{opt.name}</span>
                  {isSelected && <Check size={14} className="text-[#7F68A9]" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Standard Native Select Field with exact styling for static/dynamic lists
 */
const SelectField = ({
  label,
  required = true,
  placeholder,
  value = "",
  onChange,
  options = [],
  disabled = false,
  formError = null,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#1D1435]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${inputClass} appearance-none pr-10 cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${formError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option} className="text-slate-800 bg-white">
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {formError && (
        <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {formError}
        </p>
      )}
    </div>
  );
};

/**
 * Text Input Field matching inputClass with suffix
 */
const TextField = ({
  label,
  placeholder,
  suffix,
  value = "",
  onChange,
  formError = null,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#1D1435]">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} ${suffix ? "pr-12" : ""} ${
            formError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""
          }`}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {formError && (
        <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {formError}
        </p>
      )}
    </div>
  );
};

const CarDetailsForm = ({
  formData,
  formErrors = {},
  makes = [],
  loadingMakes = false,
  makesError = null,
  models = [],
  loadingModels = false,
  modelsError = null,
  variants = [],
  loadingVariants = false,
  variantsError = null,
  saveStatus = null,
  setMake,
  setModel,
  setVariant,
  updateField,
  searchMakes,
  searchModels,
  onSaveContinue,
  onSaveExit,
}) => {
  // Dynamically generated years backwards from current year (2026 down to 2000)
  const currentYear = new Date().getFullYear();
  const purchaseYearOptions = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String(currentYear - i));
  }, [currentYear]);

  // Registration Year options: cannot be earlier than purchase year if selected
  const purchaseYear = formData?.yearOfPurchase;
  const registrationYearOptions = useMemo(() => {
    const minYear = purchaseYear ? parseInt(purchaseYear, 10) : 2000;
    const startYear = isNaN(minYear) ? 2000 : minYear;
    const count = Math.max(1, currentYear - startYear + 1);
    return Array.from({ length: count }, (_, i) => String(currentYear - i));
  }, [currentYear, purchaseYear]);

  // Fuel Types: supported values
  const fuelOptions = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

  // Transmission Types: supported values
  const transmissionOptions = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

  // Registration Cities: from automotive hubs
  const cityOptions = useMemo(() => {
    return ALL_CITIES.map((c) => c.name).sort();
  }, []);

  return (
    <div className="relative">
      {/* Ambient gradient glow orbs visible through frosted glass */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-80 w-80 rounded-full bg-[#7F68A9]/35 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 h-96 w-96 rounded-full bg-[#7F68A9]/30 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-purple-300/25 blur-[80px]"
      />

      {/* Frosted Glassmorphism Card */}
      <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/75 bg-gradient-to-br from-white/80 via-[#7F68A9]/15 to-[#7F68A9]/25 p-6 shadow-[0_20px_50px_rgba(127,104,169,0.22)] backdrop-blur-2xl sm:p-8 lg:p-9">
        {/* Soft white/cream specular diagonal reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 via-white/15 to-transparent" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/85 bg-white/75 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7F68A9] shadow-sm backdrop-blur-md">
            Step 1 of 5
          </span>

          <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-extrabold tracking-tight text-[#1D1435] sm:text-3xl">
            Enter Your Car Details
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-600">
            Provide accurate information to get the best response.
          </p>
        </div>

        {/* Global Save Feedback Banner */}
        {saveStatus && (
          <div
            className={`relative z-10 mt-5 flex items-center gap-2.5 rounded-xl p-3.5 text-xs font-semibold ${
              saveStatus.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {saveStatus.type === "success" ? (
              <Check size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        <div className="relative z-10 mt-7 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          {/* 1. Make Dropdown (Searchable, Dynamic) */}
          <SearchableSelectField
            label="Make"
            placeholder="Select or Search Make"
            value={formData?.make}
            options={makes}
            onChange={setMake}
            onSearch={searchMakes}
            loading={loadingMakes}
            error={makesError}
            formError={formErrors?.make}
          />

          {/* 2. Model Dropdown (Dependent on Make, Searchable, Dynamic) */}
          <SearchableSelectField
            label="Model"
            placeholder={formData?.make ? "Select or Search Model" : "Select Make First"}
            value={formData?.model}
            options={models}
            onChange={setModel}
            onSearch={searchModels}
            loading={loadingModels}
            error={modelsError}
            disabled={!formData?.make}
            formError={formErrors?.model}
          />

          {/* 3. Variant Dropdown (Dependent on Make + Model, Dynamic) */}
          <SearchableSelectField
            label="Variant"
            placeholder={
              formData?.model
                ? "Select Variant"
                : formData?.make
                ? "Select Model First"
                : "Select Make First"
            }
            value={formData?.variant}
            options={variants}
            onChange={setVariant}
            loading={loadingVariants}
            error={variantsError}
            disabled={!formData?.model}
            formError={formErrors?.variant}
          />

          {/* 4. Year of Purchase */}
          <SelectField
            label="Year of Purchase"
            placeholder="Select Year"
            value={formData?.yearOfPurchase || ""}
            onChange={(val) => updateField?.("yearOfPurchase", val)}
            options={purchaseYearOptions}
            formError={formErrors?.yearOfPurchase}
          />

          {/* 5. Fuel Type */}
          <SelectField
            label="Fuel Type"
            placeholder="Select Fuel Type"
            value={formData?.fuelType || ""}
            onChange={(val) => updateField?.("fuelType", val)}
            options={fuelOptions}
            formError={formErrors?.fuelType}
          />

          {/* 6. Transmission */}
          <SelectField
            label="Transmission"
            placeholder="Select Transmission"
            value={formData?.transmission || ""}
            onChange={(val) => updateField?.("transmission", val)}
            options={transmissionOptions}
            formError={formErrors?.transmission}
          />

          {/* 7. Kilometers Driven (Numeric validation) */}
          <TextField
            label="Kilometers Driven"
            placeholder="Enter kilometers"
            suffix="km"
            value={
              formData?.kilometersDriven !== undefined && formData?.kilometersDriven !== ""
                ? Number(formData.kilometersDriven).toLocaleString("en-IN")
                : ""
            }
            onChange={(val) => updateField?.("kilometersDriven", val)}
            formError={formErrors?.kilometersDriven}
          />

          {/* 8. Registration City */}
          <SelectField
            label="Registration City"
            placeholder="Select City"
            value={formData?.registrationCity || ""}
            onChange={(val) => updateField?.("registrationCity", val)}
            options={cityOptions}
            formError={formErrors?.registrationCity}
          />

          {/* 9. Registration Year */}
          <SelectField
            label="Registration Year"
            placeholder="Select Year"
            value={formData?.registrationYear || ""}
            onChange={(val) => updateField?.("registrationYear", val)}
            options={registrationYearOptions}
            formError={formErrors?.registrationYear}
          />
        </div>

        {/* 10. Car Condition (4 Cards) */}
        <div className="relative z-10">
          <CarCondition
            value={formData?.condition || "Excellent"}
            onChange={(val) => updateField?.("condition", val)}
          />
          {formErrors?.condition && (
            <p className="mt-2 text-xs font-semibold text-red-500">
              {formErrors.condition}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/60 pt-6">
          <button
            type="button"
            onClick={onSaveExit}
            className="h-11 rounded-xl border border-white/80 bg-white/75 px-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white cursor-pointer"
          >
            Save & Exit
          </button>

          <button
            type="button"
            onClick={onSaveContinue}
            className="h-11 rounded-xl bg-gradient-to-r from-[#7F68A9] to-[#67518e] px-6 text-sm font-bold text-white shadow-lg shadow-[#7F68A9]/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#725c99] hover:to-[#5c4680] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Save & Continue</span>
            <span>?</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsForm;
