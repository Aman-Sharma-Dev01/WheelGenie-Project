import { useState } from 'react';
import { Heart, CheckCircle2, MapPin } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { toggleWishlist } from '../../services/wishlistService';

export default function CarListingCard({
  car,
  isWishlisted = false,
  onWishlistToggle,
  onSelectCar,
  onRequireLogin,
}) {
  const { country, currency } = useLocationContext();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);

  const handleHeartClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      if (onRequireLogin) {
        onRequireLogin();
      }
      return;
    }

    try {
      const result = await toggleWishlist(car._id, isWishlisted);
      if (onWishlistToggle) {
        onWishlistToggle(car._id, result.isSaved);
      }
    } catch {
      // Handled silently
    }
  };

  const formattedPrice = formatCurrency(car.price, car.country || country, car.currency || currency);

  return (
    <article
      onClick={() => onSelectCar && onSelectCar(car)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectCar && onSelectCar(car);
        }
      }}
      aria-label={`View details for ${car.brand} ${car.model} ${car.variant || ''}`}
    >
      {/* Top Image Area */}
      <div className="relative h-[140px] w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imageError && car.fallbackImage ? car.fallbackImage : (car.image || car.fallbackImage)}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Badge */}
        {car.isFeatured && (
          <div className="absolute top-2.5 left-2.5 bg-[#155DFC] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-sm z-10">
            FEATURED
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-2xs transition-colors z-10 cursor-pointer"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h3
            className="text-xs font-bold text-slate-900 truncate mb-1"
            title={`${car.brand} ${car.model} ${car.variant || ''}`}
          >
            {car.brand} {car.model} {car.variant ? car.variant : ''}
          </h3>

          {/* Specs Line 1 */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 leading-tight">
            <span>{car.year}</span>
            <span className="text-slate-300">•</span>
            <span>{car.fuel}</span>
            <span className="text-slate-300">•</span>
            <span>{car.transmission}</span>
          </div>

          {/* Specs Line 2 */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 mb-2 leading-tight">
            <span>{Number(car.kms).toLocaleString()} km</span>
            <span className="text-slate-300">•</span>
            <span>{car.ownership}</span>
          </div>
        </div>

        {/* Price & Verified Row */}
        <div>
          <div className="flex items-center justify-between pt-1">
            <strong className="text-sm font-bold text-[#155DFC]">
              {formattedPrice}
            </strong>

            {car.isVerified && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]" title="Verified Listing">
                <CheckCircle2 size={12} className="text-[#16A34A]" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <MapPin size={10} className="text-slate-400" />
            <span>{car.city}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
