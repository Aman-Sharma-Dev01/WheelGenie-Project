/**
 * Vehicle Catalogue API Service
 * Integration with cStudios Automotive Vehicle Database & Specs API.
 * 
 * Documentation: https://www.cstudio.sbs/apis/automotive-vehicle-specs
 * Documented Endpoint: GET https://api.cstudio.sbs/api/models/search?q={searchTerm}
 */

const BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VEHICLE_API_BASE_URL) ||
  'https://api.cstudio.sbs/api'
).replace(/\/+$/, '');

const API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VEHICLE_API_KEY) || '';

// In-memory caches to avoid redundant external network requests
const searchCache = new Map();
const modelsCache = new Map();
const variantsCache = new Map();
let makesCache = null;

/**
 * Common request helper with timeout and header injection
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Normalizes raw vehicle items returned from the API into a clean, UI-ready structure
 */
function normalizeVehicleItem(item) {
  if (!item || typeof item !== 'object') return null;

  const makeName = (item.make_name || item.make || item.brand || '').trim();
  const makeId = item.make_id || item.brand_id || makeName;
  const modelName = (item.model_name || item.model || item.name || '').trim();
  const modelId = item.model_id || `${makeId}_${modelName}`;
  const variantName = (item.root_name || item.variant_name || item.variant || item.trim || '').trim();
  const variantId = item.variant_id || item.spec_id || `${modelId}_${variantName}`;
  const makeLogoUrl = item.make_logo_url || item.brand_logo || item.logo_url || null;
  const imageUrl = item.image_url || item.photo_url || item.model_image_url || null;

  // Normalize fuel type if present
  let fuelType = null;
  const rawFuel = (item.fuel_type || item.fuel || '').toLowerCase();
  if (rawFuel.includes('petrol') || rawFuel.includes('gasoline')) fuelType = 'Petrol';
  else if (rawFuel.includes('diesel')) fuelType = 'Diesel';
  else if (rawFuel.includes('cng')) fuelType = 'CNG';
  else if (rawFuel.includes('electric') || rawFuel.includes('ev')) fuelType = 'Electric';
  else if (rawFuel.includes('hybrid')) fuelType = 'Hybrid';

  // Normalize transmission if present
  let transmission = null;
  const rawTrans = (item.transmission || item.gearbox || '').toLowerCase();
  if (rawTrans.includes('manual')) transmission = 'Manual';
  else if (rawTrans.includes('automatic')) transmission = 'Automatic';
  else if (rawTrans.includes('amt')) transmission = 'AMT';
  else if (rawTrans.includes('cvt')) transmission = 'CVT';
  else if (rawTrans.includes('dct')) transmission = 'DCT';

  return {
    makeId: String(makeId),
    makeName,
    modelId: String(modelId),
    modelName,
    variantId: String(variantId),
    variantName,
    makeLogoUrl,
    imageUrl,
    fuelType,
    transmission,
    raw: item,
  };
}

/**
 * Fallback automotive catalogue for the Indian automotive market.
 * Used automatically if external vehicle API is unreachable, offline, or returns DNS errors.
 */
export const FALLBACK_CATALOG = {
  "Maruti Suzuki": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Suzuki_Motor_Corporation_logo.svg/200px-Suzuki_Motor_Corporation_logo.svg.png",
    models: {
      Swift: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["LXi MT", "VXi MT", "VXi AMT", "ZXi MT", "ZXi AMT", "ZXi+ MT", "ZXi+ AMT", "VXi CNG", "ZXi CNG"],
      },
      Baleno: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["Sigma MT", "Delta MT", "Delta AMT", "Zeta MT", "Zeta AMT", "Alpha MT", "Alpha AMT", "Delta CNG", "Zeta CNG"],
      },
      Brezza: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic"],
        variants: ["LXi MT", "VXi MT", "VXi AT", "ZXi MT", "ZXi AT", "ZXi+ MT", "ZXi+ AT", "LXi CNG", "VXi CNG", "ZXi CNG"],
      },
      Ertiga: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic"],
        variants: ["LXi MT", "VXi MT", "VXi AT", "ZXi MT", "ZXi AT", "ZXi+ MT", "ZXi+ AT", "VXi CNG", "ZXi CNG"],
      },
      "Wagon R": {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["LXi 1.0 MT", "VXi 1.0 MT", "VXi 1.0 AMT", "ZXi 1.2 MT", "ZXi 1.2 AMT", "ZXi+ 1.2 MT", "LXi CNG", "VXi CNG"],
      },
      Dzire: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["LXi MT", "VXi MT", "VXi AMT", "ZXi MT", "ZXi AMT", "ZXi+ MT", "ZXi+ AMT", "VXi CNG", "ZXi CNG"],
      },
      "Grand Vitara": {
        fuels: ["Petrol", "Hybrid", "CNG"],
        transmissions: ["Manual", "Automatic"],
        variants: ["Sigma MT", "Delta MT", "Delta AT", "Zeta MT", "Zeta AT", "Alpha MT", "Alpha AT", "Zeta+ Hybrid e-CVT", "Alpha+ Hybrid e-CVT", "Delta CNG", "Zeta CNG"],
      },
      Fronx: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["Sigma 1.2 MT", "Delta 1.2 MT", "Delta 1.2 AMT", "Delta+ 1.2 MT", "Zeta 1.0 Turbo MT", "Alpha 1.0 Turbo AT", "Sigma CNG", "Delta CNG"],
      },
    },
  },
  Hyundai: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png",
    models: {
      Creta: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "CVT", "DCT"],
        variants: ["E Petrol MT", "EX Petrol MT", "S Petrol MT", "SX Petrol MT", "SX(O) Petrol IVT", "SX Tech Petrol MT", "E Diesel MT", "SX(O) Diesel AT", "SX(O) Turbo DCT"],
      },
      Venue: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["E 1.2 MT", "S 1.2 MT", "S(O) 1.2 MT", "SX 1.2 MT", "SX(O) 1.0 Turbo DCT", "S+ 1.5 Diesel MT", "SX 1.5 Diesel MT"],
      },
      i20: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["Era MT", "Magna MT", "Sportz MT", "Sportz IVT", "Asta MT", "Asta(O) MT", "Asta(O) IVT", "N Line N6 MT", "N Line N8 DCT"],
      },
      Verna: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "CVT", "DCT"],
        variants: ["EX 1.5 MT", "S 1.5 MT", "SX 1.5 MT", "SX 1.5 IVT", "SX(O) 1.5 IVT", "SX 1.5 Turbo DCT", "SX(O) 1.5 Turbo DCT"],
      },
      Exter: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["EX MT", "S MT", "S AMT", "SX MT", "SX AMT", "SX(O) MT", "SX(O) Connect AMT", "S CNG", "SX CNG"],
      },
      Alcazar: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Prestige 1.5 Turbo MT", "Platinum 1.5 Turbo DCT", "Signature 1.5 Turbo DCT", "Prestige 1.5 Diesel MT", "Signature 1.5 Diesel AT"],
      },
    },
  },
  Tata: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png",
    models: {
      Nexon: {
        fuels: ["Petrol", "Diesel", "CNG", "Electric"],
        transmissions: ["Manual", "Automatic", "AMT", "DCT"],
        variants: ["Smart 1.2 MT", "Pure 1.2 MT", "Creative 1.2 MT", "Creative+ 1.2 DCA", "Fearless 1.2 MT", "Fearless+ 1.2 DCA", "Pure 1.5 Diesel MT", "Creative 1.5 Diesel AMT", "EV Creative 45", "EV Empowered+ 45"],
      },
      Punch: {
        fuels: ["Petrol", "CNG", "Electric"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["Pure MT", "Adventure MT", "Adventure AMT", "Accomplished MT", "Creative MT", "Creative AMT", "Adventure CNG", "Accomplished CNG", "EV Adventure", "EV Empowered+"],
      },
      Harrier: {
        fuels: ["Diesel"],
        transmissions: ["Manual", "Automatic"],
        variants: ["Smart MT", "Pure MT", "Adventure MT", "Adventure+ AT", "Fearless MT", "Fearless+ AT", "Dark Edition Fearless+ AT"],
      },
      Safari: {
        fuels: ["Diesel"],
        transmissions: ["Manual", "Automatic"],
        variants: ["Smart MT", "Pure+ MT", "Adventure MT", "Adventure+ AT", "Accomplished AT", "Accomplished+ Dark AT"],
      },
      Altroz: {
        fuels: ["Petrol", "Diesel", "CNG"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["XE MT", "XM MT", "XT MT", "XZ MT", "XZ+ MT", "XZ+ DCA", "XM CNG", "XZ CNG", "XZ+ CNG"],
      },
      Tiago: {
        fuels: ["Petrol", "CNG", "Electric"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["XE MT", "XM MT", "XT MT", "XZ+ MT", "XZ+ AMT", "XT CNG", "XZ+ CNG", "EV XT", "EV XZ+ Tech Lux"],
      },
    },
  },
  Mahindra: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mahindra_%26_Mahindra_Rise_New_Logo.svg/200px-Mahindra_%26_Mahindra_Rise_New_Logo.svg.png",
    models: {
      Thar: {
        fuels: ["Diesel", "Petrol"],
        transmissions: ["Manual", "Automatic"],
        variants: ["AX(O) Hard Top MT 4x4", "LX Hard Top MT 4x4", "LX Hard Top AT 4x4", "AX(O) RWD Diesel MT", "LX RWD Diesel MT", "LX RWD Petrol AT", "ROXX MX3 MT", "ROXX AX7L 4x4 AT"],
      },
      "Scorpio-N": {
        fuels: ["Diesel", "Petrol"],
        transmissions: ["Manual", "Automatic"],
        variants: ["Z2 Petrol MT", "Z4 Petrol MT", "Z4 Petrol AT", "Z8 Petrol AT", "Z8L Petrol AT", "Z2 Diesel MT", "Z4 Diesel MT", "Z8 Diesel AT", "Z8L Diesel AT 4x4"],
      },
      "Scorpio Classic": {
        fuels: ["Diesel"],
        transmissions: ["Manual"],
        variants: ["S MT 7-Str", "S MT 9-Str", "S11 MT 7-Str"],
      },
      XUV700: {
        fuels: ["Diesel", "Petrol"],
        transmissions: ["Manual", "Automatic"],
        variants: ["MX 5-Str Petrol MT", "AX3 5-Str Petrol MT", "AX5 7-Str Petrol AT", "AX7 7-Str Petrol AT", "AX7L 7-Str Petrol AT", "AX5 7-Str Diesel MT", "AX7 7-Str Diesel AT", "AX7L 7-Str Diesel AWD AT"],
      },
      "XUV 3XO": {
        fuels: ["Diesel", "Petrol"],
        transmissions: ["Manual", "Automatic"],
        variants: ["MX1 1.2 MT", "MX2 Pro 1.2 MT", "MX3 1.2 MT", "AX5 1.2 AT", "AX7L 1.2 AT", "MX2 1.5 Diesel MT", "AX7L 1.5 Diesel AT"],
      },
      Bolero: {
        fuels: ["Diesel"],
        transmissions: ["Manual"],
        variants: ["B4 MT", "B6 MT", "B6(O) MT", "Neo N4 MT", "Neo N8 MT", "Neo N10 MT"],
      },
    },
  },
  Toyota: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/200px-Toyota.svg.png",
    models: {
      Fortuner: {
        fuels: ["Diesel", "Petrol"],
        transmissions: ["Manual", "Automatic"],
        variants: ["2.7 4x2 Petrol MT", "2.7 4x2 Petrol AT", "2.8 4x2 Diesel MT", "2.8 4x2 Diesel AT", "2.8 4x4 Diesel MT", "2.8 4x4 Diesel AT", "Legender 4x2 Diesel AT", "Legender 4x4 Diesel AT"],
      },
      "Innova Crysta": {
        fuels: ["Diesel"],
        transmissions: ["Manual"],
        variants: ["2.4 GX MT 7-Str", "2.4 GX MT 8-Str", "2.4 VX MT 7-Str", "2.4 ZX MT 7-Str"],
      },
      "Innova Hycross": {
        fuels: ["Petrol", "Hybrid"],
        transmissions: ["Automatic"],
        variants: ["GX 7-Str Petrol AT", "GX 8-Str Petrol AT", "VX 7-Str Hybrid e-CVT", "ZX 7-Str Hybrid e-CVT", "ZX(O) 7-Str Hybrid e-CVT"],
      },
      "Urban Cruiser Hyryder": {
        fuels: ["Petrol", "Hybrid", "CNG"],
        transmissions: ["Manual", "Automatic"],
        variants: ["E NeoDrive MT", "S NeoDrive MT", "G NeoDrive AT", "S Strong Hybrid e-CVT", "G Strong Hybrid e-CVT", "V Strong Hybrid e-CVT", "S CNG MT", "G CNG MT"],
      },
      Glanza: {
        fuels: ["Petrol", "CNG"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["E MT", "S MT", "S AMT", "G MT", "G AMT", "V MT", "V AMT", "S CNG MT", "G CNG MT"],
      },
      Camry: {
        fuels: ["Petrol", "Hybrid"],
        transmissions: ["Automatic"],
        variants: ["2.5 Hybrid e-CVT"],
      },
    },
  },
  Honda: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/200px-Honda.svg.png",
    models: {
      City: {
        fuels: ["Petrol", "Hybrid"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["SV 1.5 MT", "V 1.5 MT", "V 1.5 CVT", "VX 1.5 MT", "VX 1.5 CVT", "ZX 1.5 MT", "ZX 1.5 CVT", "e:HEV ZX Hybrid e-CVT"],
      },
      Elevate: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["SV MT", "V MT", "V CVT", "VX MT", "VX CVT", "ZX MT", "ZX CVT"],
      },
      Amaze: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["E MT", "S MT", "S CVT", "VX MT", "VX CVT"],
      },
    },
  },
  Kia: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kia_logo.svg/200px-Kia_logo.svg.png",
    models: {
      Seltos: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "CVT", "DCT"],
        variants: ["HTE 1.5 MT", "HTK 1.5 MT", "HTK+ 1.5 MT", "HTX 1.5 MT", "HTX 1.5 IVT", "HTX+ 1.5 Turbo DCT", "GTX+ 1.5 Turbo DCT", "HTX 1.5 Diesel AT", "GTX+ 1.5 Diesel AT"],
      },
      Sonet: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["HTE 1.2 MT", "HTK 1.2 MT", "HTK+ 1.2 MT", "HTX 1.0 Turbo DCT", "GTX+ 1.0 Turbo DCT", "HTX 1.5 Diesel MT", "GTX+ 1.5 Diesel AT"],
      },
      Carens: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Premium 1.5 MT", "Prestige 1.5 MT", "Prestige Plus 1.5 Turbo MT", "Luxury Plus 1.5 Turbo DCT", "Luxury Plus 1.5 Diesel AT"],
      },
    },
  },
  Volkswagen: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png",
    models: {
      Taigun: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Comfortline 1.0 MT", "Highline 1.0 MT", "Highline 1.0 AT", "Topline 1.0 MT", "Topline 1.0 AT", "GT Plus 1.5 DSG"],
      },
      Virtus: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Comfortline 1.0 MT", "Highline 1.0 MT", "Highline 1.0 AT", "Topline 1.0 MT", "Topline 1.0 AT", "GT Plus 1.5 DSG"],
      },
    },
  },
  Skoda: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Skoda_Auto_logo_%282023%29.svg/200px-Skoda_Auto_logo_%282023%29.svg.png",
    models: {
      Slavia: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Classic 1.0 MT", "Signature 1.0 MT", "Signature 1.0 AT", "Prestige 1.0 MT", "Prestige 1.5 DSG", "Monte Carlo 1.5 DSG"],
      },
      Kushaq: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "DCT"],
        variants: ["Classic 1.0 MT", "Signature 1.0 MT", "Signature 1.0 AT", "Prestige 1.0 MT", "Prestige 1.5 DSG", "Monte Carlo 1.5 DSG"],
      },
    },
  },
  MG: {
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/MG_Motor_logo.svg/200px-MG_Motor_logo.svg.png",
    models: {
      Hector: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["Style 1.5 Turbo MT", "Shine Pro 1.5 Turbo CVT", "Select Pro 1.5 Turbo MT", "Sharp Pro 1.5 Turbo CVT", "Smart Pro 2.0 Diesel MT"],
      },
      "ZS EV": {
        fuels: ["Electric"],
        transmissions: ["Automatic"],
        variants: ["Executive 50.3 kWh", "Excite Pro 50.3 kWh", "Exclusive Plus 50.3 kWh", "Essence 50.3 kWh"],
      },
      Astor: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "CVT"],
        variants: ["Sprint 1.5 MT", "Shine 1.5 MT", "Select 1.5 CVT", "Sharp Pro 1.5 CVT"],
      },
    },
  },
  Renault: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Renault_2021.svg/200px-Renault_2021.svg.png",
    models: {
      Kwid: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["RXE 1.0 MT", "RXL(O) 1.0 MT", "RXT 1.0 MT", "RXT 1.0 AMT", "Climber 1.0 MT", "Climber 1.0 AMT"],
      },
      Kiger: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "AMT", "CVT"],
        variants: ["RXE 1.0 MT", "RXL 1.0 MT", "RXT(O) 1.0 MT", "RXT(O) 1.0 AMT", "RXZ 1.0 MT", "RXZ 1.0 Turbo CVT"],
      },
      Triber: {
        fuels: ["Petrol"],
        transmissions: ["Manual", "Automatic", "AMT"],
        variants: ["RXE MT", "RXL MT", "RXT MT", "RXT AMT", "RXZ MT", "RXZ AMT"],
      },
    },
  },
  Ford: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/200px-Ford_logo_flat.svg.png",
    models: {
      EcoSport: {
        fuels: ["Petrol", "Diesel"],
        transmissions: ["Manual", "Automatic"],
        variants: ["Ambiente 1.5 MT", "Trend 1.5 MT", "Titanium 1.5 MT", "Titanium 1.5 AT", "Titanium+ 1.5 MT", "Titanium Diesel MT"],
      },
      Endeavour: {
        fuels: ["Diesel"],
        transmissions: ["Automatic"],
        variants: ["Titanium 2.0 4x2 AT", "Titanium+ 2.0 4x4 AT", "Sport 2.0 4x4 AT"],
      },
    },
  },
};

/**
 * Search vehicles via external endpoint or resilient catalog fallback
 * @param {string} searchTerm
 * @returns {Promise<{ success: boolean, data: Array, error?: string }>}
 */
export async function searchVehicles(searchTerm = '') {
  const query = (searchTerm || '').trim();
  if (!query) return { success: true, data: [] };

  const cacheKey = query.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return { success: true, data: searchCache.get(cacheKey) };
  }

  // 1. Try external API endpoint first
  try {
    const endpoint = `${BASE_URL}/models/search?q=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(endpoint, {}, 4000);

    if (res.ok) {
      const json = await res.json();
      const rawItems = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.models)
        ? json.models
        : Array.isArray(json?.results)
        ? json.results
        : [];

      const normalized = rawItems
        .map(normalizeVehicleItem)
        .filter((v) => v && v.makeName && v.modelName);

      if (normalized.length > 0) {
        searchCache.set(cacheKey, normalized);
        return { success: true, data: normalized };
      }
    }
  } catch (err) {
    // Expected when external endpoint is offline, unreachable, or has DNS issues.
    console.warn(`External vehicle API unavailable (${err.message}). Using automotive catalogue fallback.`);
  }

  // 2. Resilient fallback: search inside FALLBACK_CATALOG
  const fallbackResults = [];
  const q = query.toLowerCase();

  Object.entries(FALLBACK_CATALOG).forEach(([brand, brandData]) => {
    const brandMatches = brand.toLowerCase().includes(q);

    Object.entries(brandData.models).forEach(([modelName, modelData]) => {
      const modelMatches = modelName.toLowerCase().includes(q);

      if (brandMatches || modelMatches || q === 'car') {
        modelData.variants.forEach((vName) => {
          fallbackResults.push({
            makeId: brand,
            makeName: brand,
            modelId: `${brand}_${modelName}`,
            modelName,
            variantId: `${brand}_${modelName}_${vName}`,
            variantName: vName,
            makeLogoUrl: brandData.logo,
            imageUrl: null,
            fuelType: modelData.fuels?.[0] || 'Petrol',
            transmission: modelData.transmissions?.[0] || 'Manual',
          });
        });
      }
    });
  });

  searchCache.set(cacheKey, fallbackResults);
  return { success: true, data: fallbackResults };
}

/**
 * Retrieve unique makes / manufacturers from the vehicle database
 * @param {string} [searchQuery='']
 * @returns {Promise<{ success: boolean, data: Array<{ id: string, name: string, logo: string|null }>, error?: string }>}
 */
export async function getMakes(searchQuery = '') {
  const q = (searchQuery || '').trim().toLowerCase();

  // If we already cached the broad catalogue makes and no specific query is passed, return them
  if (!q && makesCache && makesCache.length > 0) {
    return { success: true, data: makesCache };
  }

  // Broad initial seed queries for the Indian car market to discover brands if none cached
  const queryTerm = q || 'car';
  const result = await searchVehicles(queryTerm);

  if (!result.success) {
    return { success: false, data: makesCache || [], error: result.error };
  }

  const map = new Map();
  // Always ensure all Indian automotive brands from FALLBACK_CATALOG are available
  Object.entries(FALLBACK_CATALOG).forEach(([brand, data]) => {
    map.set(brand.toLowerCase(), {
      id: brand,
      name: brand,
      logo: data.logo || null,
    });
  });

  // Preserve any previously cached makes
  if (makesCache) {
    makesCache.forEach((m) => map.set(m.name.toLowerCase(), m));
  }

  result.data.forEach((item) => {
    const key = item.makeName.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        id: item.makeId || item.makeName,
        name: item.makeName,
        logo: item.makeLogoUrl || null,
      });
    }
  });

  let makesList = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));

  if (!q) {
    makesCache = makesList;
  } else {
    makesList = makesList.filter((m) => m.name.toLowerCase().includes(q));
  }

  return { success: true, data: makesList };
}

/**
 * Retrieve models belonging to a specific make
 * @param {string} makeName
 * @param {string} [searchQuery='']
 * @returns {Promise<{ success: boolean, data: Array<{ id: string, name: string, makeName: string, logo: string|null, imageUrl: string|null }>, error?: string }>}
 */
export async function getModels(makeName, searchQuery = '') {
  if (!makeName) return { success: true, data: [] };

  const cleanMake = makeName.trim();
  const cacheKey = cleanMake.toLowerCase();

  let modelsList = modelsCache.get(cacheKey) || null;

  if (!modelsList) {
    const modelMap = new Map();

    // Check FALLBACK_CATALOG first for instant zero-latency availability
    const brandEntry = Object.entries(FALLBACK_CATALOG).find(
      ([b]) => b.toLowerCase() === cleanMake.toLowerCase()
    );
    if (brandEntry) {
      const [brand, brandData] = brandEntry;
      Object.entries(brandData.models).forEach(([mName, mData]) => {
        modelMap.set(mName.toLowerCase(), {
          id: `${brand}_${mName}`,
          name: mName,
          makeName: brand,
          logo: brandData.logo || null,
          imageUrl: null,
          fuelType: mData.fuels?.[0] || null,
          transmission: mData.transmissions?.[0] || null,
        });
      });
    }

    // Also attempt external search if available
    const result = await searchVehicles(cleanMake);
    if (result.success && result.data.length > 0) {
      result.data.forEach((item) => {
        if (item.makeName.toLowerCase() === cleanMake.toLowerCase()) {
          const mKey = item.modelName.toLowerCase();
          if (!modelMap.has(mKey)) {
            modelMap.set(mKey, {
              id: item.modelId || item.modelName,
              name: item.modelName,
              makeName: item.makeName,
              logo: item.makeLogoUrl || null,
              imageUrl: item.imageUrl || null,
              fuelType: item.fuelType || null,
              transmission: item.transmission || null,
            });
          }
        }
      });
    }

    modelsList = Array.from(modelMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    modelsCache.set(cacheKey, modelsList);
  }

  const q = (searchQuery || '').trim().toLowerCase();
  const filtered = q
    ? modelsList.filter((m) => m.name.toLowerCase().includes(q))
    : modelsList;

  return { success: true, data: filtered };
}

/**
 * Retrieve variants for a specific make and model
 * @param {string} makeName
 * @param {string} modelName
 * @returns {Promise<{ success: boolean, data: Array<{ id: string, name: string, fuelType: string|null, transmission: string|null, imageUrl: string|null }>, error?: string }>}
 */
export async function getVariants(makeName, modelName) {
  if (!makeName || !modelName) return { success: true, data: [] };

  const cacheKey = `${makeName.trim().toLowerCase()}:::${modelName.trim().toLowerCase()}`;
  if (variantsCache.has(cacheKey)) {
    return { success: true, data: variantsCache.get(cacheKey) };
  }

  const variantMap = new Map();

  // Check FALLBACK_CATALOG for instant response
  const brandEntry = Object.entries(FALLBACK_CATALOG).find(
    ([b]) => b.toLowerCase() === makeName.trim().toLowerCase()
  );
  if (brandEntry) {
    const [, brandData] = brandEntry;
    const modelEntry = Object.entries(brandData.models).find(
      ([m]) => m.toLowerCase() === modelName.trim().toLowerCase()
    );
    if (modelEntry) {
      const [, mData] = modelEntry;
      mData.variants.forEach((vName) => {
        // Derive fuel & transmission from variant name if present, else fallback
        let fuel = mData.fuels?.[0] || 'Petrol';
        if (vName.toLowerCase().includes('diesel')) fuel = 'Diesel';
        else if (vName.toLowerCase().includes('cng')) fuel = 'CNG';
        else if (vName.toLowerCase().includes('ev') || vName.toLowerCase().includes('electric')) fuel = 'Electric';
        else if (vName.toLowerCase().includes('hybrid')) fuel = 'Hybrid';

        let trans = mData.transmissions?.[0] || 'Manual';
        if (vName.toLowerCase().includes('at') || vName.toLowerCase().includes('amt') || vName.toLowerCase().includes('dct') || vName.toLowerCase().includes('cvt') || vName.toLowerCase().includes('dca')) {
          if (vName.toLowerCase().includes('amt')) trans = 'AMT';
          else if (vName.toLowerCase().includes('dct') || vName.toLowerCase().includes('dca')) trans = 'DCT';
          else if (vName.toLowerCase().includes('cvt') || vName.toLowerCase().includes('ivt')) trans = 'CVT';
          else trans = 'Automatic';
        } else if (vName.toLowerCase().includes('mt')) {
          trans = 'Manual';
        }

        variantMap.set(vName.toLowerCase(), {
          id: `${makeName}_${modelName}_${vName}`,
          name: vName,
          fuelType: fuel,
          transmission: trans,
          imageUrl: null,
        });
      });
    }
  }

  // Also query external search
  const searchTerm = `${makeName.trim()} ${modelName.trim()}`;
  const result = await searchVehicles(searchTerm);
  if (result.success && result.data.length > 0) {
    result.data.forEach((item) => {
      const sameMake = item.makeName.toLowerCase() === makeName.trim().toLowerCase();
      const sameModel = item.modelName.toLowerCase() === modelName.trim().toLowerCase();

      if (sameMake && sameModel && item.variantName) {
        const vKey = item.variantName.toLowerCase();
        if (!variantMap.has(vKey)) {
          variantMap.set(vKey, {
            id: item.variantId || item.variantName,
            name: item.variantName,
            fuelType: item.fuelType || null,
            transmission: item.transmission || null,
            imageUrl: item.imageUrl || null,
          });
        }
      }
    });
  }

  const variantsList = Array.from(variantMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  variantsCache.set(cacheKey, variantsList);

  return { success: true, data: variantsList };
}

export default {
  searchVehicles,
  getMakes,
  getModels,
  getVariants,
};
