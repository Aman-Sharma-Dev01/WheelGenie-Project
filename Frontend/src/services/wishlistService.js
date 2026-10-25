/**
 * Wishlist Service
 * Communicates with backend endpoints (/api/v1/wishlist) and manages local cache.
 */

import api from '../api/axios';

const STORAGE_KEY = 'wg_user_wishlist';

/**
 * Get stored wishlist IDs from localStorage
 * @returns {string[]}
 */
export function getLocalWishlistIds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Save wishlist IDs to localStorage
 * @param {string[]} ids
 */
export function setLocalWishlistIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Dispatch custom event so navbar and cards update instantly across the app
    window.dispatchEvent(new CustomEvent('wg-wishlist-updated', { detail: { ids } }));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Fetch wishlist from backend API
 * @returns {Promise<string[]>} Array of wishlisted vehicle IDs
 */
export async function fetchWishlist() {
  try {
    const res = await api.get('/wishlist');
    if (res?.data?.success && Array.isArray(res.data.data?.wishlist)) {
      const ids = res.data.data.wishlist.map((item) => (item._id || item.id || item));
      setLocalWishlistIds(ids);
      return ids;
    }
  } catch {
    // If backend unavailable or unauthenticated, return cached local IDs
  }
  return getLocalWishlistIds();
}

/**
 * Toggle wishlist item
 * @param {string} carId
 * @param {boolean} isCurrentlySaved
 * @returns {Promise<{ isSaved: boolean, ids: string[] }>}
 */
export async function toggleWishlist(carId, isCurrentlySaved) {
  const current = getLocalWishlistIds();
  let updated;

  if (isCurrentlySaved) {
    updated = current.filter((id) => id !== carId);
    // Optimistic local update
    setLocalWishlistIds(updated);

    try {
      await api.delete(`/wishlist/${carId}`);
    } catch {
      // Backend may not have this specific mock ID, keep local state
    }
    return { isSaved: false, ids: updated };
  } else {
    updated = current.includes(carId) ? current : [...current, carId];
    // Optimistic local update
    setLocalWishlistIds(updated);

    try {
      await api.post(`/wishlist/${carId}`);
    } catch {
      // Backend may not have this specific mock ID, keep local state
    }
    return { isSaved: true, ids: updated };
  }
}

export default {
  getLocalWishlistIds,
  setLocalWishlistIds,
  fetchWishlist,
  toggleWishlist,
};
