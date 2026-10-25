/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  COUNTRIES,
  SUPPORTED_COUNTRY_NAMES,
  getCountryConfig,
  getCitiesForCountry,
} from "../utils/locationConfig";
import { formatCurrency, getCurrencyCode, getCurrencySymbol } from "../utils/currencyFormatter";

// ---------------------------------------------------------------------------
// Legacy Predefined Indian Automotive Hubs (for backwards compatibility with CarDetailsForm)
// ---------------------------------------------------------------------------
export const POPULAR_CITIES = COUNTRIES.India.cities.filter((c) => c.isPopular);
export const OTHER_CITIES = COUNTRIES.India.cities.filter((c) => !c.isPopular);
export const ALL_CITIES = COUNTRIES.India.cities;
export const DEFAULT_CITY = {
  id: "delhi",
  name: "Delhi",
  city: "Delhi",
  state: "Delhi",
  country: "India",
  lat: 28.6139,
  lng: 77.2090,
  isDetected: false,
};

// ---------------------------------------------------------------------------
// Helpers: Distance Calculation (Haversine Formula)
// ---------------------------------------------------------------------------
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestCityInList(lat, lng, cityList) {
  if (!cityList || cityList.length === 0) return null;
  let closest = cityList[0];
  let minDistance = Infinity;

  for (const item of cityList) {
    if (item.lat != null && item.lng != null) {
      const dist = getDistanceKm(lat, lng, item.lat, item.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    }
  }

  return { ...closest, distanceKm: Math.round(minDistance) };
}

// ---------------------------------------------------------------------------
// Context Creation
// ---------------------------------------------------------------------------
const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  // Current active country ('India' | 'Canada')
  const [country, setCountryState] = useState(() => {
    return localStorage.getItem("wg_user_country") || "India";
  });

  // Flag if the user has explicitly chosen/configured a location
  const [hasConfiguredLocation, setHasConfiguredLocation] = useState(() => {
    return localStorage.getItem("wg_location_configured") === "true";
  });

  // Current active city name
  const [city, setCityState] = useState(() => {
    const saved = localStorage.getItem("wg_user_city");
    if (saved) return saved;
    const initialCountry = localStorage.getItem("wg_user_country") || "India";
    return COUNTRIES[initialCountry]?.defaultCity || "Delhi";
  });

  // Detailed location info
  const [locationDetails, setLocationDetails] = useState(() => {
    const saved = localStorage.getItem("wg_location_details");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back below
      }
    }
    const currentCountryConfig = COUNTRIES[country] || COUNTRIES.India;
    const defaultCityObj = currentCountryConfig.cities.find((c) => c.name === currentCountryConfig.defaultCity) || currentCountryConfig.cities[0];
    return {
      name: defaultCityObj.name,
      city: defaultCityObj.name,
      state: defaultCityObj.state,
      country: country,
      lat: defaultCityObj.lat,
      lng: defaultCityObj.lng,
      isDetected: false,
    };
  });

  // Recent cities for quick selection
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem("wg_recent_cities");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ["Delhi", "Toronto"];
      }
    }
    return ["Delhi", "Toronto"];
  });

  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [unsupportedCountryDetected, setUnsupportedCountryDetected] = useState(null);

  // Derived country configuration
  const currentConfig = useMemo(() => getCountryConfig(country), [country]);
  const availableCities = useMemo(() => getCitiesForCountry(country), [country]);
  const popularCities = useMemo(() => availableCities.filter((c) => c.isPopular), [availableCities]);
  const currency = useMemo(() => getCurrencyCode(country), [country]);
  const currencySymbol = useMemo(() => getCurrencySymbol(country), [country]);

  // Set country and adjust city/currency accordingly
  const setCountry = useCallback(
    (newCountry, targetCity = null) => {
      if (!newCountry || !COUNTRIES[newCountry]) return;

      const targetConfig = COUNTRIES[newCountry];
      const selectedCity = targetCity || targetConfig.defaultCity;
      const matchedCity = targetConfig.cities.find(
        (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
      ) || targetConfig.cities[0];

      const newDetails = {
        name: matchedCity.name,
        city: matchedCity.name,
        state: matchedCity.state,
        country: newCountry,
        lat: matchedCity.lat,
        lng: matchedCity.lng,
        isDetected: false,
      };

      setCountryState(newCountry);
      setCityState(matchedCity.name);
      setLocationDetails(newDetails);
      setHasConfiguredLocation(true);
      setError(null);
      setUnsupportedCountryDetected(null);

      try {
        localStorage.setItem("wg_user_country", newCountry);
        localStorage.setItem("wg_user_city", matchedCity.name);
        localStorage.setItem("wg_location_details", JSON.stringify(newDetails));
        localStorage.setItem("wg_location_configured", "true");
      } catch {
        // Storage fallback
      }
    },
    []
  );

  // Update selected city manually
  const setCity = useCallback(
    (cityName, customCountry = null, customDetails = {}) => {
      if (!cityName) return;

      const activeCountry = customCountry || country;
      const targetConfig = COUNTRIES[activeCountry] || COUNTRIES.India;

      const matchedCity = targetConfig.cities.find(
        (c) => c.name.toLowerCase() === cityName.toLowerCase() || c.id === cityName.toLowerCase()
      );

      const resolvedName = matchedCity ? matchedCity.name : cityName;

      const newDetails = {
        name: resolvedName,
        city: resolvedName,
        state: matchedCity?.state || customDetails.state || "",
        country: activeCountry,
        lat: matchedCity?.lat || customDetails.lat || null,
        lng: matchedCity?.lng || customDetails.lng || null,
        isDetected: false,
        ...customDetails,
      };

      if (customCountry && customCountry !== country) {
        setCountryState(customCountry);
        localStorage.setItem("wg_user_country", customCountry);
      }

      setCityState(resolvedName);
      setLocationDetails(newDetails);
      setHasConfiguredLocation(true);
      setError(null);
      setUnsupportedCountryDetected(null);

      // Save to localStorage
      try {
        localStorage.setItem("wg_user_city", resolvedName);
        localStorage.setItem("wg_location_details", JSON.stringify(newDetails));
        localStorage.setItem("wg_location_configured", "true");

        setRecentCities((prev) => {
          const updated = [resolvedName, ...prev.filter((c) => c !== resolvedName)].slice(0, 5);
          localStorage.setItem("wg_recent_cities", JSON.stringify(updated));
          return updated;
        });
      } catch {
        // Storage quota / restricted mode fallback
      }
    },
    [country]
  );

  // Detect location via browser Geolocation + reverse geocoding
  const detectLocation = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      const err = "Geolocation is not supported by your browser";
      setError(err);
      return { success: false, error: err };
    }

    setIsLocating(true);
    setError(null);
    setUnsupportedCountryDetected(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Attempt reverse geocoding via OpenStreetMap with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            let detectedCountryName = null;
            let detectedCityName = null;
            let detectedState = null;

            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                  signal: controller.signal,
                  headers: {
                    Accept: "application/json",
                  },
                }
              );
              clearTimeout(timeoutId);

              if (res.ok) {
                const data = await res.json();
                const addr = data.address || {};
                detectedCountryName = addr.country;
                detectedCityName =
                  addr.city ||
                  addr.town ||
                  addr.municipality ||
                  addr.suburb ||
                  addr.county ||
                  addr.state_district;
                detectedState = addr.state;
              }
            } catch {
              // Timeout or network error; determine country by coordinate bounds
            }

            // Fallback country detection via coordinates if reverse geocode failed
            if (!detectedCountryName) {
              if (latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 98) {
                detectedCountryName = "India";
              } else if (latitude >= 42 && latitude <= 83 && longitude >= -141 && longitude <= -52) {
                detectedCountryName = "Canada";
              }
            }

            // Normalize detected country
            let matchedCountry = null;
            if (detectedCountryName) {
              const lower = detectedCountryName.toLowerCase();
              if (lower.includes("india") || lower.includes("bharat")) {
                matchedCountry = "India";
              } else if (lower.includes("canada")) {
                matchedCountry = "Canada";
              }
            }

            // Handle unsupported country
            if (!matchedCountry) {
              setIsLocating(false);
              const unsupportedName = detectedCountryName || "Your location";
              setUnsupportedCountryDetected(unsupportedName);
              const msg = `WheelGenie currently supports India and Canada. Detected country: ${unsupportedName}. Please select your preferred marketplace manually.`;
              setError(msg);
              resolve({
                success: false,
                isUnsupported: true,
                detectedCountry: unsupportedName,
                error: msg,
              });
              return;
            }

            // Find nearest city in the matched country catalogue
            const countryCities = getCitiesForCountry(matchedCountry);
            const nearestHub = findNearestCityInList(latitude, longitude, countryCities);

            const finalCityName =
              nearestHub && nearestHub.distanceKm < 100
                ? nearestHub.name
                : detectedCityName || nearestHub?.name || COUNTRIES[matchedCountry].defaultCity;

            const finalDetails = {
              name: finalCityName,
              city: finalCityName,
              state: detectedState || nearestHub?.state || "",
              country: matchedCountry,
              lat: latitude,
              lng: longitude,
              isDetected: true,
              distanceToHubKm: nearestHub?.distanceKm || 0,
            };

            setCountryState(matchedCountry);
            setCityState(finalCityName);
            setLocationDetails(finalDetails);
            setHasConfiguredLocation(true);
            setIsLocating(false);

            try {
              localStorage.setItem("wg_user_country", matchedCountry);
              localStorage.setItem("wg_user_city", finalCityName);
              localStorage.setItem("wg_location_details", JSON.stringify(finalDetails));
              localStorage.setItem("wg_location_configured", "true");
              setRecentCities((prev) => {
                const updated = [finalCityName, ...prev.filter((c) => c !== finalCityName)].slice(0, 5);
                localStorage.setItem("wg_recent_cities", JSON.stringify(updated));
                return updated;
              });
            } catch {
              // Ignore storage errors
            }

            resolve({ success: true, details: finalDetails, country: matchedCountry, city: finalCityName });
          } catch (err) {
            setIsLocating(false);
            const msg = err.message || "Failed to resolve your address";
            setError(msg);
            resolve({ success: false, error: msg });
          }
        },
        (geoError) => {
          setIsLocating(false);
          let message = "Location access is unavailable. Please select your country and city manually.";
          if (geoError.code === 1) {
            message = "Location access is unavailable. Please select your country and city manually.";
          } else if (geoError.code === 2) {
            message = "Location position unavailable. Please choose your city manually.";
          } else if (geoError.code === 3) {
            message = "Location request timed out. Please choose your city manually.";
          }
          setError(message);
          resolve({ success: false, error: message });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    });
  }, []);

  // Clear location preferences
  const clearLocation = useCallback(() => {
    const defaultCountry = "India";
    const defaultCity = COUNTRIES.India.defaultCity;
    const defaultDetails = {
      name: defaultCity,
      city: defaultCity,
      state: "Delhi",
      country: defaultCountry,
      lat: 28.6139,
      lng: 77.2090,
      isDetected: false,
    };

    setCountryState(defaultCountry);
    setCityState(defaultCity);
    setLocationDetails(defaultDetails);
    setHasConfiguredLocation(false);
    setError(null);
    setUnsupportedCountryDetected(null);

    try {
      localStorage.removeItem("wg_user_country");
      localStorage.removeItem("wg_user_city");
      localStorage.removeItem("wg_location_details");
      localStorage.removeItem("wg_location_configured");
    } catch {
      // Ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      country,
      city,
      location: locationDetails,
      locationDetails,
      currency,
      currencySymbol,
      countryConfig: currentConfig,
      hasConfiguredLocation,
      isLocating,
      error,
      unsupportedCountryDetected,
      recentCities,
      popularCities,
      availableCities,
      supportedCountries: SUPPORTED_COUNTRY_NAMES,
      setCountry,
      setCity,
      detectLocation,
      clearLocation,
      formatPrice: (amt) => formatCurrency(amt, country, currency),
    }),
    [
      country,
      city,
      locationDetails,
      currency,
      currencySymbol,
      currentConfig,
      hasConfiguredLocation,
      isLocating,
      error,
      unsupportedCountryDetected,
      recentCities,
      popularCities,
      availableCities,
      setCountry,
      setCity,
      detectLocation,
      clearLocation,
    ]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}

export function useUserLocation() {
  return useLocationContext();
}

export function useLocation() {
  return useLocationContext();
}

export default LocationContext;
