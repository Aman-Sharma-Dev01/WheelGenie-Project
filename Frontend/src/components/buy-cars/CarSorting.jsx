import { LayoutGrid, List, ChevronDown } from 'lucide-react';

export default function CarSorting({
  total = 0,
  sort = 'newest',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
}) {
  return (
    <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
      {/* Total Count */}
      <div>
        <p className="text-sm">
          <span className="font-bold text-slate-900 text-base">
            {Number(total).toLocaleString()}
          </span>{' '}
          <span className="text-slate-500">Cars Available</span>
        </p>
      </div>

      {/* Sorting & View Toggle */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <label htmlFor="car-sort" className="shrink-0">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="car-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort listings"
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-slate-700 outline-hidden focus:border-[#155DFC] cursor-pointer shadow-2xs"
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
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white shadow-2xs" role="group" aria-label="View layout toggle">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#155DFC] text-white'
                : 'text-slate-400 hover:text-slate-600'
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
                ? 'bg-[#155DFC] text-white'
                : 'text-slate-400 hover:text-slate-600'
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
