/**
 * International Location & Country Configuration
 * Supports India 🇮🇳 and Canada 🇨🇦
 */

export const COUNTRIES = {
  India: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    defaultCity: 'Delhi',
    priceRange: {
      min: 100000,
      max: 5000000,
      step: 50000,
      defaultMin: 100000,
      defaultMax: 5000000,
    },
    cities: [
      { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, isPopular: true },
      { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, isPopular: true },
      { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, isPopular: true },
      { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, isPopular: true },
      { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, isPopular: true },
      { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, isPopular: true },
      { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, isPopular: true },
      { id: 'faridabad', name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, isPopular: false },
      { id: 'gurugram', name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, isPopular: true },
      { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, isPopular: true },
      { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, isPopular: false },
      { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, isPopular: false },
      { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794, isPopular: false },
    ],
    fuelTypes: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    makes: [
      'Maruti Suzuki',
      'Hyundai',
      'Tata',
      'Mahindra',
      'Kia',
      'Honda',
      'Toyota',
      'MG',
      'Skoda',
      'Volkswagen',
      'Renault',
      'Ford',
    ],
    modelsByMake: {
      'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Wagon R', 'Dzire', 'Grand Vitara', 'Fronx'],
      'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter', 'Alcazar', 'Tucson'],
      'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Curvv'],
      'Mahindra': ['Thar', 'Scorpio-N', 'XUV700', 'XUV 3XO', 'Scorpio Classic', 'Bolero'],
      'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6'],
      'Honda': ['City', 'Elevate', 'Amaze'],
      'Toyota': ['Fortuner', 'Innova Hycross', 'Innova Crysta', 'Urban Cruiser Hyryder', 'Glanza', 'Camry'],
      'MG': ['Hector', 'ZS EV', 'Astor', 'Comet EV'],
      'Skoda': ['Slavia', 'Kushaq', 'Kodiaq'],
      'Volkswagen': ['Virtus', 'Taigun', 'Tiguan'],
      'Renault': ['Kwid', 'Kiger', 'Triber'],
      'Ford': ['EcoSport', 'Endeavour', 'Figo'],
    },
  },

  Canada: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    locale: 'en-CA',
    defaultCity: 'Toronto',
    priceRange: {
      min: 5000,
      max: 200000,
      step: 2500,
      defaultMin: 5000,
      defaultMax: 200000,
    },
    cities: [
      { id: 'toronto', name: 'Toronto', state: 'Ontario', lat: 43.6532, lng: -79.3832, isPopular: true },
      { id: 'vancouver', name: 'Vancouver', state: 'British Columbia', lat: 49.2827, lng: -123.1207, isPopular: true },
      { id: 'calgary', name: 'Calgary', state: 'Alberta', lat: 51.0447, lng: -114.0719, isPopular: true },
      { id: 'edmonton', name: 'Edmonton', state: 'Alberta', lat: 53.5461, lng: -113.4938, isPopular: true },
      { id: 'ottawa', name: 'Ottawa', state: 'Ontario', lat: 45.4215, lng: -75.6972, isPopular: true },
      { id: 'montreal', name: 'Montreal', state: 'Quebec', lat: 45.5017, lng: -73.5673, isPopular: true },
      { id: 'winnipeg', name: 'Winnipeg', state: 'Manitoba', lat: 49.8951, lng: -97.1384, isPopular: false },
      { id: 'mississauga', name: 'Mississauga', state: 'Ontario', lat: 43.5890, lng: -79.6441, isPopular: true },
      { id: 'brampton', name: 'Brampton', state: 'Ontario', lat: 43.7315, lng: -79.7624, isPopular: true },
    ],
    fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    makes: [
      'Toyota',
      'Honda',
      'Ford',
      'Chevrolet',
      'Hyundai',
      'Kia',
      'Mazda',
      'Nissan',
      'BMW',
      'Mercedes-Benz',
      'Subaru',
      'Audi',
      'Tesla',
      'Volkswagen',
    ],
    modelsByMake: {
      'Toyota': ['RAV4', 'Corolla', 'Camry', 'Highlander', 'Tacoma', 'Tundra', 'Prius'],
      'Honda': ['Civic', 'CR-V', 'Accord', 'Pilot', 'HR-V', 'Passport'],
      'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Bronco', 'Edge'],
      'Chevrolet': ['Silverado 1500', 'Equinox', 'Tahoe', 'Traverse', 'Corvette', 'Colorado'],
      'Hyundai': ['Tucson', 'Elantra', 'Santa Fe', 'Kona', 'Palisade', 'Ioniq 5'],
      'Kia': ['Sportage', 'Seltos', 'Telluride', 'Forte', 'EV6', 'Sorento'],
      'Mazda': ['CX-5', 'Mazda3', 'CX-30', 'CX-50', 'CX-90'],
      'Nissan': ['Rogue', 'Sentra', 'Altima', 'Pathfinder', 'Murano', 'Frontier'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', 'M3'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'CLA', 'GLB'],
      'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'WRX'],
      'Audi': ['A4', 'A6', 'Q5', 'Q7', 'Q3', 'e-tron'],
      'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
      'Volkswagen': ['Golf', 'Jetta', 'Tiguan', 'Atlas', 'ID.4'],
    },
  },
};

export const SUPPORTED_COUNTRY_NAMES = Object.keys(COUNTRIES);

export function getCountryConfig(countryName) {
  return COUNTRIES[countryName] || COUNTRIES.India;
}

export function getCitiesForCountry(countryName) {
  const config = getCountryConfig(countryName);
  return config.cities || [];
}

export function getMakesForCountry(countryName) {
  const config = getCountryConfig(countryName);
  return config.makes || [];
}

export function getModelsForMake(countryName, makeName) {
  const config = getCountryConfig(countryName);
  return config.modelsByMake?.[makeName] || [];
}
