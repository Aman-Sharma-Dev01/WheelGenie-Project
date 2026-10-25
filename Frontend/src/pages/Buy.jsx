import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BuyCarsHeader from '../components/buy-cars/BuyCarsHeader';
import CarCategories from '../components/buy-cars/CarCategories';
import MarketplaceBenefits from '../components/buy-cars/MarketplaceBenefits';
import CarFilters from '../components/buy-cars/CarFilters';
import CarSorting from '../components/buy-cars/CarSorting';
import CarListingGrid from '../components/buy-cars/CarListingGrid';
import CarAlertBanner from '../components/buy-cars/CarAlertBanner';
import CarAlertModal from '../components/buy-cars/CarAlertModal';
import LocationModal from '../components/buy-cars/LocationModal';
import CarDetailModal from '../components/buy-cars/CarDetailModal';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { getMarketplaceCars } from '../services/carService';
import { getLocalWishlistIds } from '../services/wishlistService';

export default function Buy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    country,
    hasConfiguredLocation,
  } = useLocationContext();

  const { isAuthenticated } = useAuth();

  // State Management
  const [prevCountry, setPrevCountry] = useState(country);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All Cars'
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'newest'
  );
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  // Filter state
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    ownership: searchParams.get('ownership') || '',
  });

  // Reset filters during render when country changes (India <-> Canada)
  if (prevCountry !== country) {
    setPrevCountry(country);
    setFilters({
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      maxPrice: null,
      fuel: '',
      transmission: '',
      ownership: '',
    });
    setSelectedCategory('All Cars');
    setSearchTerm('');
    setPage(1);
  }

  // Mobile Filters Drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Modals
  const [locationModalOpen, setLocationModalOpen] = useState(!hasConfiguredLocation);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);

  // Local Wishlist IDs
  const [wishlistIds, setWishlistIds] = useState(() => getLocalWishlistIds());

  // Show wishlist filter if query param is set
  const showWishlistOnly = searchParams.get('wishlist') === 'true';

  // Keep wishlist state updated
  useEffect(() => {
    const handleWishlistUpdated = (e) => {
      if (e.detail?.ids) {
        setWishlistIds(e.detail.ids);
      } else {
        setWishlistIds(getLocalWishlistIds());
      }
    };
    window.addEventListener('wg-wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('wg-wishlist-updated', handleWishlistUpdated);
  }, []);

  // TanStack Query for Data Fetching & Caching
  const queryKey = useMemo(
    () => [
      'marketplace-cars',
      {
        country,
        city: filters.city || '',
        category: selectedCategory,
        search: searchTerm,
        brand: filters.brand,
        model: filters.model,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        maxPrice: filters.maxPrice,
        fuel: filters.fuel,
        transmission: filters.transmission,
        ownership: filters.ownership,
        sort: sortOption,
        page,
      },
    ],
    [country, selectedCategory, searchTerm, filters, sortOption, page]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getMarketplaceCars({
        country,
        category: selectedCategory,
        search: searchTerm,
        brand: filters.brand,
        model: filters.model,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        maxPrice: filters.maxPrice,
        fuel: filters.fuel,
        transmission: filters.transmission,
        ownership: filters.ownership,
        sort: sortOption,
        page,
        limit: 12,
      }),
    staleTime: 60 * 1000,
  });

  const rawCars = useMemo(() => data?.cars || [], [data?.cars]);
  const categoryCounts = data?.categoryCounts || {};
  const totalAvailable = data?.total || 0;

  // If filtered for wishlist only
  const displayedCars = useMemo(() => {
    if (showWishlistOnly) {
      return rawCars.filter((c) => wishlistIds.includes(c._id));
    }
    return rawCars;
  }, [rawCars, showWishlistOnly, wishlistIds]);

  const displayedTotal = showWishlistOnly ? displayedCars.length : totalAvailable;

  // Handlers
  const handleCategorySelect = useCallback((catId) => {
    setSelectedCategory(catId);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      maxPrice: null,
      fuel: '',
      transmission: '',
      ownership: '',
    });
    setSelectedCategory('All Cars');
    setSearchTerm('');
    setPage(1);
    if (showWishlistOnly) {
      navigate('/buy', { replace: true });
    }
  }, [showWishlistOnly, navigate]);

  const handleRequireLogin = useCallback(() => {
    navigate('/login', {
      state: {
        from: location,
        message: 'Please log in to explore cars and access personalized listings.',
      },
    });
  }, [navigate, location]);

  const handleWishlistToggle = useCallback((carId, isSaved) => {
    setWishlistIds((prev) =>
      isSaved ? [...prev, carId] : prev.filter((id) => id !== carId)
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* 1. Standard Global Navbar (Untouched) */}
      <Navbar activePage="buy" />

      {/* Main Marketplace Area */}
      <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Wishlist Active Banner (if filtered by wishlist) */}
        {showWishlistOnly && (
          <div className="mb-4 bg-rose-50 border border-rose-200 py-2.5 px-4 rounded-xl text-xs text-rose-800 font-semibold flex items-center justify-between shadow-2xs">
            <span>Showing only your Wishlisted vehicles ({displayedCars.length})</span>
            <button
              type="button"
              onClick={() => navigate('/buy', { replace: true })}
              className="underline text-[#155DFC] hover:text-blue-700 cursor-pointer"
            >
              Show all cars
            </button>
          </div>
        )}

        {/* 2. Page Header: Title, Subtitle, Search & Location Selector */}
        <BuyCarsHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onToggleMobileFilters={() => setMobileFiltersOpen(true)}
          onOpenLocationModal={() => setLocationModalOpen(true)}
        />

        {/* 3. Categories & Trust Benefits in One Unified Row */}
        <div className="flex flex-col xl:flex-row gap-3 items-stretch mb-6">
          <div className="flex-1 min-w-0">
            <CarCategories
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              categoryCounts={categoryCounts}
            />
          </div>
          <div className="w-full xl:w-[410px] shrink-0 flex items-stretch">
            <MarketplaceBenefits />
          </div>
        </div>

        {/* 4. Main 2-Column Marketplace: Filters Sidebar + Listings Grid */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-5 items-start">
          {/* Filters Sidebar */}
          <CarFilters
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            isOpenMobile={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />

          {/* Results Area */}
          <div className="flex-1 min-w-0 w-full">
            {/* Sorting Header */}
            <CarSorting
              total={displayedTotal}
              sort={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Vehicle Cards Grid / List */}
            <CarListingGrid
              cars={displayedCars}
              isLoading={isLoading}
              viewMode={viewMode}
              wishlistIds={wishlistIds}
              onWishlistToggle={handleWishlistToggle}
              onSelectCar={(car) => setSelectedCarForModal(car)}
              onResetFilters={handleResetFilters}
              onRequireLogin={handleRequireLogin}
            />

            {/* 5. Can't Find What You're Looking For Alert Banner */}
            <CarAlertBanner
              onOpenAlertModal={() => {
                if (!isAuthenticated) {
                  handleRequireLogin();
                } else {
                  setAlertModalOpen(true);
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Standard Global Footer (Untouched) */}
      <Footer />

      {/* 6. Modals */}
      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        forceSelect={!hasConfiguredLocation}
      />

      {/* Car Alert Creation Modal */}
      <CarAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        initialFilters={{
          ...filters,
          category: selectedCategory,
        }}
      />

      {/* Car Detailed Specifications Modal */}
      <CarDetailModal
        car={selectedCarForModal}
        isOpen={Boolean(selectedCarForModal)}
        onClose={() => setSelectedCarForModal(null)}
        isWishlisted={selectedCarForModal ? wishlistIds.includes(selectedCarForModal._id) : false}
        onWishlistToggle={handleWishlistToggle}
        onRequireLogin={handleRequireLogin}
      />
    </div>
  );
}
