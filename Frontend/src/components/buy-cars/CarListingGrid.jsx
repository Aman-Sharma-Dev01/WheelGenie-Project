import { Car, RefreshCw } from 'lucide-react';
import CarListingCard from './CarListingCard';
import CarListingList from './CarListingList';

export default function CarListingGrid({
  cars = [],
  isLoading = false,
  viewMode = 'grid',
  wishlistIds = [],
  onWishlistToggle,
  onSelectCar,
  onResetFilters,
  onRequireLogin,
}) {
  // Skeleton Loading State
  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'list'
            ? 'space-y-3'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5'
        }
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
          >
            <div className="h-[140px] bg-slate-200" />
            <div className="p-3 space-y-2.5">
              <div className="h-3.5 bg-slate-200 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              <div className="h-2.5 bg-slate-100 rounded w-2/3" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!cars || cars.length === 0) {
    return (
      <div className="py-16 px-6 text-center bg-white/95 border border-white/80 rounded-xl shadow-xl backdrop-blur-xl">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2F80ED] flex items-center justify-center mx-auto mb-3">
          <Car size={24} />
        </div>
        <h3 className="text-base font-bold text-[#092340] mb-1">
          No vehicles found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          We couldn't find any cars matching your current filters. Try relaxing your search criteria or resetting filters.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#092340] via-[#103E70] to-[#2F80ED] hover:from-[#0B2E54] hover:to-[#256DD6] text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:-translate-y-0.5"
        >
          <RefreshCw size={13} />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  // Loaded Results
  return (
    <div
      className={
        viewMode === 'list'
          ? 'space-y-3'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5'
      }
    >
      {cars.map((car) => {
        const isWishlisted = wishlistIds.includes(car._id);

        if (viewMode === 'list') {
          return (
            <CarListingList
              key={car._id}
              car={car}
              isWishlisted={isWishlisted}
              onWishlistToggle={onWishlistToggle}
              onSelectCar={onSelectCar}
              onRequireLogin={onRequireLogin}
            />
          );
        }

        return (
          <CarListingCard
            key={car._id}
            car={car}
            isWishlisted={isWishlisted}
            onWishlistToggle={onWishlistToggle}
            onSelectCar={onSelectCar}
            onRequireLogin={onRequireLogin}
          />
        );
      })}
    </div>
  );
}
