import {
  Car,
  Zap,
  Crown,
  Grid,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All Cars', label: 'All Cars', icon: Grid },
  { id: 'Hatchback', label: 'Hatchback', icon: Car },
  { id: 'Sedan', label: 'Sedan', icon: Car },
  { id: 'SUV', label: 'SUV', icon: Car },
  { id: 'Luxury', label: 'Luxury', icon: Crown },
  { id: 'Electric', label: 'Electric', icon: Zap },
];

export default function CarCategories({
  selectedCategory = 'All Cars',
  onSelectCategory,
  categoryCounts = {},
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full" aria-label="Car Categories">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center cursor-pointer min-h-[72px] ${
              isSelected
                ? 'border-[#2F80ED] bg-blue-50/90 ring-2 ring-[#2F80ED]/30 shadow-md backdrop-blur-xl'
                : 'border-white/80 bg-white/95 hover:bg-white hover:border-slate-300 shadow-md backdrop-blur-xl'
            }`}
          >
            <Icon
              size={20}
              className={`mb-1 transition-colors ${
                isSelected ? 'text-[#2F80ED]' : 'text-slate-600'
              }`}
            />
            <span
              className={`text-[11px] font-bold leading-tight ${
                isSelected ? 'text-[#2F80ED]' : 'text-[#092340]'
              }`}
            >
              {cat.label}
            </span>
            <span
              className={`text-[10px] mt-0.5 leading-tight ${
                isSelected ? 'text-[#2F80ED] font-semibold' : 'text-slate-400 font-medium'
              }`}
            >
              {count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
