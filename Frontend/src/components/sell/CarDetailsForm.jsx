import { useState } from "react";
import CarCondition from "./CarCondition";

const inputClass =
  "h-11 w-full rounded-xl border border-white/85 bg-white/75 px-3.5 text-sm font-medium text-[#1D1435] outline-none transition-all placeholder:text-slate-400 focus:bg-white/95 focus:border-[#7F68A9] focus:ring-4 focus:ring-[#7F68A9]/20 shadow-sm backdrop-blur-md";

const SelectField = ({ label, required = true, placeholder, options = [] }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#1D1435]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select className={inputClass} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextField = ({ label, placeholder, suffix }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#1D1435]">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={`${inputClass} ${suffix ? "pr-12" : ""}`}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

const CarDetailsForm = ({ onContinue }) => {
  const [condition, setCondition] = useState("Excellent");

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

        <div className="relative z-10 mt-7 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Make"
            placeholder="Select Make"
            options={["Hyundai", "Maruti Suzuki", "Tata", "Honda", "Toyota", "BMW"]}
          />

          <SelectField
            label="Model"
            placeholder="Select Model"
            options={["i20", "Creta", "Swift", "City", "Nexon", "X1"]}
          />

          <SelectField
            label="Variant"
            placeholder="Select Variant"
            options={["Base", "Mid", "Sport", "Asta", "Top"]}
          />

          <SelectField
            label="Year of Purchase"
            placeholder="Select Year"
            options={["2026", "2025", "2024", "2023", "2022", "2021", "2020"]}
          />

          <SelectField
            label="Fuel Type"
            placeholder="Select Fuel Type"
            options={["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]}
          />

          <SelectField
            label="Transmission"
            placeholder="Select Transmission"
            options={["Manual", "Automatic", "AMT", "CVT", "DCT"]}
          />

          <TextField
            label="Kilometers Driven"
            placeholder="Enter kilometers"
            suffix="km"
          />

          <SelectField
            label="Registration City"
            placeholder="Select City"
            options={["Faridabad", "Delhi", "Gurugram", "Noida", "Ghaziabad"]}
          />

          <SelectField
            label="Registration Year"
            placeholder="Select Year"
            options={["2026", "2025", "2024", "2023", "2022", "2021", "2020"]}
          />
        </div>

        <div className="relative z-10">
          <CarCondition
            value={condition}
            onChange={setCondition}
          />
        </div>

        <div className="relative z-10 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/60 pt-6">
          <button
            type="button"
            className="h-11 rounded-xl border border-white/80 bg-white/75 px-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white cursor-pointer"
          >
            Save & Exit
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="h-11 rounded-xl bg-gradient-to-r from-[#7F68A9] to-[#67518e] px-6 text-sm font-bold text-white shadow-lg shadow-[#7F68A9]/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#725c99] hover:to-[#5c4680] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Save & Continue</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsForm;