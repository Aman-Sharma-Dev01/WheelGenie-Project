import { useState } from "react";
import { carConditions } from "../../data/sellData";

const CarCondition = ({ value, onChange }) => {
  const [selected, setSelected] = useState(value || "Excellent");

  const handleSelect = (condition) => {
    setSelected(condition);
    onChange?.(condition);
  };

  return (
    <div className="mt-7">
      <div className="mb-3">
        <label className="text-sm font-bold text-[#1D1435]">
          Car Condition <span className="text-red-500">*</span>
        </label>

        <p className="mt-1 text-xs font-medium text-slate-600">
          Select the condition that best describes your car
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {carConditions.map((condition) => {
          const isSelected = selected === condition.title;

          return (
            <button
              type="button"
              key={condition.title}
              onClick={() => handleSelect(condition.title)}
              className={`
                flex min-h-[76px] items-center gap-3 rounded-2xl border
                p-3.5 text-left transition-all duration-200 cursor-pointer backdrop-blur-md
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/25 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                    : "border-white/75 bg-white/65 hover:bg-white/85 hover:border-emerald-200 shadow-sm"
                }
              `}
            >
              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-colors
                  ${
                    isSelected
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-white/80 text-slate-700 border border-white/60"
                  }
                `}
              >
                {isSelected ? "✓" : "🚗"}
              </div>

              <div>
                <p className={`text-xs font-bold transition-colors ${isSelected ? "text-emerald-700" : "text-[#1D1435]"}`}>
                  {condition.title}
                </p>

                <p className={`mt-1 text-[11px] leading-4 transition-colors ${isSelected ? "text-emerald-800/80 font-medium" : "text-slate-500"}`}>
                  {condition.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CarCondition;