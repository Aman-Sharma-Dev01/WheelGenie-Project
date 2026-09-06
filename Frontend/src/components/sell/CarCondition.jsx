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
        <label className="text-sm font-bold text-[#0B1F3A]">
          Car Condition <span className="text-red-500">*</span>
        </label>

        <p className="mt-1 text-xs text-slate-500">
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
                flex min-h-[76px] items-center gap-3 rounded-xl border
                p-3 text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-[#247CF0] bg-blue-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }
              `}
            >
              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                  ${
                    isSelected
                      ? "bg-[#247CF0] text-white"
                      : "bg-slate-100 text-[#0B1F3A]"
                  }
                `}
              >
                {isSelected ? "✓" : "🚗"}
              </div>

              <div>
                <p className="text-xs font-bold text-[#0B1F3A]">
                  {condition.title}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-slate-500">
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