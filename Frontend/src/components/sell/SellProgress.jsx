import { sellSteps } from "../../data/sellData";

const SellProgress = ({ currentStep = 1 }) => {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 overflow-x-auto">
        {sellSteps.map((step, index) => {
          const active = currentStep === step.number;
          const completed = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="flex min-w-[170px] flex-1 items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-full text-lg transition-all duration-300
                    ${
                      active || completed
                        ? "bg-[#247CF0] text-white shadow-md shadow-blue-100"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {completed ? "✓" : step.icon}
                </div>

                <div className="whitespace-nowrap">
                  <p
                    className={`text-sm font-bold ${
                      active ? "text-[#0B1F3A]" : "text-slate-700"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < sellSteps.length - 1 && (
                <div className="mx-4 hidden h-px flex-1 border-t border-dashed border-slate-300 lg:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellProgress;