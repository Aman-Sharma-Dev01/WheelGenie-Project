import { LayoutGrid, List, ChevronDown } from 'lucide-react';

export default function CarSorting({
  total = 0,
  sort = 'newest',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
}) {
  return (
    <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/15">
      {/* Total Count */}
      <div>
        <p className="text-sm">
          <span className="font-bold text-white text-base">
            {Number(total).toLocaleString()}
          </span>{' '}
          <span className="text-slate-300">Cars Available</span>
        </p>
      </div>

      {/* Sorting & View Toggle */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <label htmlFor="car-sort" className="shrink-0">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="car-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort listings"
              className="appearance-none bg-white/95 border border-white/80 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-[#092340] font-semibold outline-hidden focus:border-[#2F80ED] cursor-pointer shadow-md backdrop-blur-xl"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest</option>
              <option value="mileage-low">Mileage: Lowest</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-white/80 rounded-lg p-0.5 bg-white/95 shadow-md backdrop-blur-xl" role="group" aria-label="View layout toggle">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#2F80ED] text-white shadow-xs'
                : 'text-slate-400 hover:text-[#092340]'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#2F80ED] text-white shadow-xs'
                : 'text-slate-400 hover:text-[#092340]'
            }`}
            title="List View"
            aria-label="List View"
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
