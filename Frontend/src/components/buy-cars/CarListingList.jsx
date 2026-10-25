import { useState } from 'react';
import { Heart, CheckCircle2, MapPin, Eye, ArrowRight } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { toggleWishlist } from '../../services/wishlistService';

export default function CarListingList({
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
      if (onRequireLogin) onRequireLogin();
      return;
    }

    try {
      const result = await toggleWishlist(car._id, isWishlisted);
      if (onWishlistToggle) {
        onWishlistToggle(car._id, result.isSaved);
      }
    } catch {
      // Ignored
    }
  };

  const formattedPrice = formatCurrency(car.price, car.country || country, car.currency || currency);

  return (
    <article
      onClick={() => onSelectCar && onSelectCar(car)}
      className="car-card flex flex-col sm:flex-row overflow-hidden border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white cursor-pointer group"
    >
      {/* Left Image Area */}
      <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
        <img
          src={imageError && car.fallbackImage ? car.fallbackImage : (car.image || car.fallbackImage)}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="image-gradient" />

        {car.isFeatured && (
          <div className="featured-badge font-bold tracking-wider">
            FEATURED
          </div>
        )}

        <button
          type="button"
          onClick={handleHeartClick}
          className={`favorite-btn ${isWishlisted ? 'favorite-active text-rose-600' : 'text-slate-600'}`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}
          />
        </button>
      </div>

      {/* Right Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-wg-navy group-hover:text-wg-blue transition-colors">
                  {car.brand} {car.model} {car.variant || ''}
                </h3>
                {car.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.fuel}</span>
                <span>•</span>
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{Number(car.kms).toLocaleString()} km</span>
                <span>•</span>
                <span>{car.ownership}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-extrabold text-wg-blue block">
                {formattedPrice}
              </span>
              <span className="text-[10px] text-slate-400">Fixed Fair Price</span>
            </div>
          </div>

          {/* Features preview */}
          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 my-3">
              {car.features.slice(0, 4).map((f, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin size={13} className="text-wg-blue" />
              <span>{car.city}, {car.country || country}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Eye size={13} />
              <span>{car.views || 250} views</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-wg-blue font-semibold group-hover:translate-x-1 transition-transform">
            <span>View Full Details</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </article>
  );
}
