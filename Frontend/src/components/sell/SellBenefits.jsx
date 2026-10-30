import { sellBenefits } from "../../data/sellData";

const SellBenefits = () => {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/95 px-5 py-6 shadow-xl backdrop-blur-xl sm:px-8">
      <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {sellBenefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-center gap-4 py-4 lg:px-7 lg:py-2 first:lg:pl-0 last:lg:pr-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg text-[#2F80ED]">
              {benefit.icon}
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#092340]">
                {benefit.title}
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellBenefits;