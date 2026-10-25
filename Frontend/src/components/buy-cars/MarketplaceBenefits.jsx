import { ShieldCheck, Tag, Landmark } from 'lucide-react';

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Verified Cars',
    description: 'All cars are inspected',
  },
  {
    icon: Tag,
    title: 'Best Prices',
    description: 'Get the best deals',
  },
  {
    icon: Landmark,
    title: 'Easy Financing',
    description: 'Flexible loan options',
  },
];

export default function MarketplaceBenefits() {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between divide-x divide-slate-100 shadow-2xs w-full"
      aria-label="Marketplace Trust Benefits"
    >
      {BENEFITS.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2.5 px-3 py-1 flex-1 first:pl-2 last:pr-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-[#155DFC] flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <strong className="block text-xs font-bold text-slate-900 leading-tight truncate">
                {item.title}
              </strong>
              <span className="block text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                {item.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
