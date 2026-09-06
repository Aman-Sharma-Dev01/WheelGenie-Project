import { useState } from "react";
import CarCondition from "./CarCondition";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#243B5A] outline-none transition-all placeholder:text-slate-400 focus:border-[#247CF0] focus:ring-4 focus:ring-blue-50";

const SelectField = ({ label, required = true, placeholder, options = [] }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#0B1F3A]">
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
      <label className="mb-2 block text-xs font-bold text-[#0B1F3A]">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={`${inputClass} ${suffix ? "pr-12" : ""}`}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
      <div>
        <p className="text-sm font-bold text-[#247CF0]">Step 1 of 5</p>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
          Enter Your Car Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide accurate information to get the best response.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
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

      <CarCondition
        value={condition}
        onChange={setCondition}
      />

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Save & Exit
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="h-11 rounded-lg bg-[#247CF0] px-6 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1769D2]"
        >
          Save & Continue
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default CarDetailsForm;