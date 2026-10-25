/**
 * Car & Marketplace Service
 * Seamlessly integrates with Backend APIs (/api/v1/cars & /api/v1/vehicles)
 * with a resilient, country-separated marketplace inventory layer for India and Canada.
 */

import api from '../api/axios';
import car1 from '../assets/cars/car1.png.png';
import car2 from '../assets/cars/car2.png.png';
import car3 from '../assets/cars/car3.png';
import car4 from '../assets/cars/car4.png.png';
import car5 from '../assets/cars/car5.png.png';
import car6 from '../assets/cars/car6.png.png';
import car7 from '../assets/cars/car7.png.png';

// ---------------------------------------------------------------------------
// Verified Marketplace Inventory: India 🇮🇳 (INR)
// ---------------------------------------------------------------------------
export const INDIA_CAR_INVENTORY = [
  {
    _id: 'in-car-101',
    brand: 'Hyundai',
    model: 'i20',
    variant: 'Asta',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 45000,
    ownership: 'First Owner',
    price: 675000,
    currency: 'INR',
    city: 'Delhi',
    country: 'India',
    bodyType: 'Hatchback',
    category: 'Hatchback',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 480,
    rating: 4.8,
    seller: {
      name: 'Rajesh Varma',
      phone: '+91 98112 34567',
      email: 'rajesh.v@example.com',
      verified: true,
    },
    specs: {
      engine: '1.2L Kappa Dual VTVT',
      power: '83 bhp',
      mileage: '19.65 kmpl',
      color: 'Polar White',
      rto: 'DL01',
      insurance: 'Valid until Nov 2026',
    },
    features: ['Sunroof', '10.25-inch Touchscreen', 'Bose 7-Speaker Audio', 'Wireless Charger', 'Reverse Camera'],
  },
  {
    _id: 'in-car-102',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXi',
    year: 2020,
    fuel: 'Petrol',
    transmission: 'Manual',
    kms: 38000,
    ownership: 'First Owner',
    price: 525000,
    currency: 'INR',
    city: 'Gurugram',
    country: 'India',
    bodyType: 'Hatchback',
    category: 'Hatchback',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car3,
    views: 380,
    rating: 4.8,
    seller: {
      name: 'Vikas Malhotra',
      phone: '+91 99100 23456',
      email: 'vikas.m@example.com',
      verified: true,
    },
    specs: {
      engine: '1.2L DualJet Dual VVT',
      power: '89 bhp',
      mileage: '23.2 kmpl',
      color: 'Pearl Arctic White',
      rto: 'HR26',
      insurance: 'Comprehensive Valid',
    },
    features: ['SmartPlay Studio 7-inch', 'Cruise Control', 'Keyless Push Start', 'Dual Airbags', 'ABS with EBD'],
  },
  {
    _id: 'in-car-103',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'HTK Plus',
    year: 2022,
    fuel: 'Diesel',
    transmission: 'Manual',
    kms: 22000,
    ownership: 'First Owner',
    price: 1175000,
    currency: 'INR',
    city: 'Noida',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car2,
    views: 510,
    rating: 4.9,
    seller: {
      name: 'Abhinav Saxena',
      phone: '+91 98118 44332',
      email: 'abhinav.s@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L CRDi VGT',
      power: '113 bhp',
      mileage: '20.8 kmpl',
      color: 'Imperial Blue',
      rto: 'UP16',
      insurance: 'Zero Dep Valid',
    },
    features: ['Electric Sunroof', 'LED Headlamps', 'Wireless Android Auto', 'Push Button Start', 'Rear Camera'],
  },
  {
    _id: 'in-car-104',
    brand: 'Honda',
    model: 'City',
    variant: 'V CVT',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 30000,
    ownership: 'Second Owner',
    price: 925000,
    currency: 'INR',
    city: 'Delhi',
    country: 'India',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car6,
    views: 430,
    rating: 4.8,
    seller: {
      name: 'Gaurav Singhal',
      phone: '+91 98101 99887',
      email: 'gaurav.s@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L i-VTEC DOHC',
      power: '119 bhp',
      mileage: '18.4 kmpl',
      color: 'Platinum White Pearl',
      rto: 'DL04',
      insurance: 'Valid until 2026',
    },
    features: ['Honda LaneWatch Camera', 'Paddle Shifters', '8-inch Touchscreen', 'Cruise Control', 'Auto AC'],
  },
  {
    _id: 'in-car-105',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'XM',
    year: 2019,
    fuel: 'Diesel',
    transmission: 'Manual',
    kms: 55000,
    ownership: 'First Owner',
    price: 620000,
    currency: 'INR',
    city: 'Faridabad',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car4,
    views: 390,
    rating: 4.7,
    seller: {
      name: 'Sunil Choudhary',
      phone: '+91 98110 55443',
      email: 'sunil.c@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L Turbocharged Revotorq',
      power: '108 bhp',
      mileage: '21.5 kmpl',
      color: 'Foliage Green',
      rto: 'HR51',
      insurance: 'Valid',
    },
    features: ['5-Star GNCAP Safety', 'Harman Audio System', 'Multi-Drive Modes', 'Dual Airbags', 'Rear Parking Sensors'],
  },
  {
    _id: 'in-car-106',
    brand: 'Mahindra',
    model: 'XUV500',
    variant: 'W8',
    year: 2018,
    fuel: 'Diesel',
    transmission: 'Automatic',
    kms: 68000,
    ownership: 'Second Owner',
    price: 810000,
    currency: 'INR',
    city: 'Ghaziabad',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car7,
    views: 460,
    rating: 4.7,
    seller: {
      name: 'Pramod Tyagi',
      phone: '+91 98120 77665',
      email: 'pramod.t@example.com',
      verified: true,
    },
    specs: {
      engine: '2.2L mHawk Diesel',
      power: '140 bhp',
      mileage: '15.1 kmpl',
      color: 'Pearl White',
      rto: 'UP14',
      insurance: 'Valid',
    },
    features: ['Touchscreen Navigation', 'Leather Seats', 'Automatic Headlamps', 'Reverse Parking Camera', 'Alloy Wheels'],
  },
  {
    _id: 'in-car-107',
    brand: 'Skoda',
    model: 'Rapid',
    variant: 'Style',
    year: 2019,
    fuel: 'Petrol',
    transmission: 'Manual',
    kms: 48000,
    ownership: 'First Owner',
    price: 590000,
    currency: 'INR',
    city: 'Delhi',
    country: 'India',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 340,
    rating: 4.8,
    seller: {
      name: 'Manish Chawla',
      phone: '+91 98105 33221',
      email: 'manish.c@example.com',
      verified: true,
    },
    specs: {
      engine: '1.6L MPI Petrol',
      power: '103 bhp',
      mileage: '15.4 kmpl',
      color: 'Silk Blue',
      rto: 'DL08',
      insurance: 'Valid until 2026',
    },
    features: ['Climatronic Automatic AC', 'Projector Headlamps', '6.5-inch Touchscreen', 'Cruise Control', 'Leatherette Upholstery'],
  },
  {
    _id: 'in-car-108',
    brand: 'MG',
    model: 'Hector',
    variant: 'Smart',
    year: 2021,
    fuel: 'Diesel',
    transmission: 'Manual',
    kms: 35000,
    ownership: 'First Owner',
    price: 1350000,
    currency: 'INR',
    city: 'Gurugram',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car5,
    views: 580,
    rating: 4.9,
    seller: {
      name: 'Kunal Kapoor',
      phone: '+91 99111 88776',
      email: 'kunal.k@example.com',
      verified: true,
    },
    specs: {
      engine: '2.0L Turbocharged Diesel',
      power: '168 bhp',
      mileage: '17.4 kmpl',
      color: 'Starry Black',
      rto: 'HR26',
      insurance: 'Zero Dep Valid',
    },
    features: ['10.4-inch HD Touchscreen', 'Infinity Premium Sound', 'Panoramic Sunroof', 'i-SMART Connected Tech', 'LED DRLs'],
  },
  {
    _id: 'in-car-108',
    brand: 'Tata',
    model: 'Nexon EV',
    variant: 'Empowered+ Long Range',
    year: 2023,
    fuel: 'Electric',
    transmission: 'Automatic',
    kms: 19000,
    ownership: 'First Owner',
    price: 1520000,
    currency: 'INR',
    city: 'Bangalore',
    country: 'India',
    bodyType: 'SUV',
    category: 'Electric',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 650,
    rating: 4.9,
    seller: {
      name: 'Karthik Rao',
      phone: '+91 99000 66778',
      email: 'karthik.r@example.com',
      verified: true,
    },
    specs: {
      engine: 'Permanent Magnet Synchronous Motor',
      power: '143 bhp',
      mileage: '465 km Range',
      color: 'Intensi-Teal',
      rto: 'KA05',
      insurance: 'Battery Warranty 8 Yrs',
    },
    features: ['Vehicle to Vehicle (V2V) Charging', 'V2L Power Bank', 'Electronic Parking Brake', 'Wireless Apple CarPlay', 'Arcade.ev App Suite'],
  },
  {
    _id: 'in-car-109',
    brand: 'Tata',
    model: 'Punch',
    variant: 'Creative AMT',
    year: 2023,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 15000,
    ownership: 'First Owner',
    price: 840000,
    currency: 'INR',
    city: 'Pune',
    country: 'India',
    bodyType: 'Hatchback',
    category: 'Hatchback',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car2,
    views: 380,
    rating: 4.7,
    seller: {
      name: 'Mahesh Patil',
      phone: '+91 98900 12345',
      email: 'mahesh.p@example.com',
      verified: true,
    },
    specs: {
      engine: '1.2L Revotron Petrol',
      power: '86 bhp',
      mileage: '18.8 kmpl',
      color: 'Tornado Blue',
      rto: 'MH12',
      insurance: 'Valid',
    },
    features: ['5-Star GNCAP Safety', 'Rain Sensing Wipers', 'Auto Headlamps', 'Diamond Cut Alloys', 'Traction Pro Mode'],
  },
  {
    _id: 'in-car-110',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: 'Legender 4x4 AT',
    year: 2022,
    fuel: 'Diesel',
    transmission: 'Automatic',
    kms: 42000,
    ownership: 'First Owner',
    price: 4100000,
    currency: 'INR',
    city: 'Delhi',
    country: 'India',
    bodyType: 'SUV',
    category: 'Luxury',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car3,
    views: 1120,
    rating: 5.0,
    seller: {
      name: 'Harpreet Singh',
      phone: '+91 98111 77665',
      email: 'harpreet.s@example.com',
      verified: true,
    },
    specs: {
      engine: '2.8L Turbo Diesel',
      power: '201 bhp',
      mileage: '14.2 kmpl',
      color: 'White Pearl Crystal Shine Dual Tone',
      rto: 'DL08',
      insurance: 'Zero Dep Valid',
    },
    features: ['Catamaran Front Bumper', 'JBL Premium 11-Speaker Audio', 'Kick Sensor Back Door', 'Dual Zone Climate', 'Rear Differential Lock'],
  },
  {
    _id: 'in-car-111',
    brand: 'Skoda',
    model: 'Slavia',
    variant: '1.5 TSI Style DSG',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 26000,
    ownership: 'First Owner',
    price: 1420000,
    currency: 'INR',
    city: 'Mumbai',
    country: 'India',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car4,
    views: 390,
    rating: 4.8,
    seller: {
      name: 'Nitin Mehta',
      phone: '+91 98205 77665',
      email: 'nitin.m@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L TSI EVO with ACT',
      power: '148 bhp',
      mileage: '18.7 kmpl',
      color: 'Crystal Blue',
      rto: 'MH01',
      insurance: 'Valid until 2026',
    },
    features: ['7-Speed DSG Gearbox', 'Active Cylinder Technology', 'Ventilated Leather Seats', 'Virtual Cockpit Display', 'Electric Sunroof'],
  },
  {
    _id: 'in-car-112',
    brand: 'MG',
    model: 'ZS EV',
    variant: 'Exclusive Pro',
    year: 2023,
    fuel: 'Electric',
    transmission: 'Automatic',
    kms: 16500,
    ownership: 'First Owner',
    price: 1890000,
    currency: 'INR',
    city: 'Chennai',
    country: 'India',
    bodyType: 'SUV',
    category: 'Electric',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car5,
    views: 520,
    rating: 4.8,
    seller: {
      name: 'Suresh Raman',
      phone: '+91 98401 22334',
      email: 'suresh.r@example.com',
      verified: true,
    },
    specs: {
      engine: '50.3 kWh Prismatic Battery',
      power: '174 bhp',
      mileage: '461 km Claimed',
      color: 'Ferrite Red',
      rto: 'TN07',
      insurance: 'Zero Dep Valid',
    },
    features: ['Level 2 Autonomous ADAS', 'Dual Pane Panoramic Skyroof', 'i-SMART with 75+ Connected Features', 'Wireless Phone Charger', 'Digital Key'],
  },
  {
    _id: 'in-car-113',
    brand: 'Maruti Suzuki',
    model: 'Grand Vitara',
    variant: 'Alpha+ Strong Hybrid',
    year: 2023,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    kms: 22000,
    ownership: 'First Owner',
    price: 1780000,
    currency: 'INR',
    city: 'Delhi',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car6,
    views: 430,
    rating: 4.9,
    seller: {
      name: 'Anil Kapoor',
      phone: '+91 98119 44332',
      email: 'anil.k@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L Intelligent Electric Hybrid',
      power: '114 bhp (combined)',
      mileage: '27.97 kmpl',
      color: 'Arctic White',
      rto: 'DL02',
      insurance: 'Valid',
    },
    features: ['EV Mode Capability', 'Head-Up Display (HUD)', '360 View Camera', 'Ventilated Seats', 'Panoramic Sunroof'],
  },
  {
    _id: 'in-car-114',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'GTX+ 1.5 Turbo DCT',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 33000,
    ownership: 'First Owner',
    price: 1610000,
    currency: 'INR',
    city: 'Kolkata',
    country: 'India',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car7,
    views: 470,
    rating: 4.8,
    seller: {
      name: 'Subhash Sen',
      phone: '+91 98300 88776',
      email: 'subhash.s@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L Smartstream T-GDi',
      power: '158 bhp',
      mileage: '16.5 kmpl',
      color: 'Pewter Olive',
      rto: 'WB02',
      insurance: 'Valid',
    },
    features: ['Dual Zone Climate Control', 'Bose 8-Speaker System', 'Full Digital Cluster', 'Smart Pure Air Purifier', 'Drive Modes (Eco, Normal, Sport)'],
  },
  {
    _id: 'in-car-115',
    brand: 'Toyota',
    model: 'Glanza',
    variant: 'V CVT',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 38000,
    ownership: 'Second Owner',
    price: 710000,
    currency: 'INR',
    city: 'Pune',
    country: 'India',
    bodyType: 'Hatchback',
    category: 'Hatchback',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 290,
    rating: 4.6,
    seller: {
      name: 'Pramod Jadhav',
      phone: '+91 98220 55443',
      email: 'pramod.j@example.com',
      verified: true,
    },
    specs: {
      engine: '1.2L K-Series DualJet',
      power: '89 bhp',
      mileage: '22.3 kmpl',
      color: 'Insta Blue',
      rto: 'MH14',
      insurance: 'Valid',
    },
    features: ['Heads-Up Display', '9-inch Smart Playcast', 'Toyota i-Connect', 'UV Cut Glass', 'Cruise Control'],
  },
  {
    _id: 'in-car-116',
    brand: 'Volkswagen',
    model: 'Virtus',
    variant: 'GT Plus 1.5 DSG',
    year: 2023,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 18000,
    ownership: 'First Owner',
    price: 1680000,
    currency: 'INR',
    city: 'Hyderabad',
    country: 'India',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car2,
    views: 610,
    rating: 4.9,
    seller: {
      name: 'Venkat Reddy',
      phone: '+91 98480 33221',
      email: 'venkat.r@example.com',
      verified: true,
    },
    specs: {
      engine: '1.5L TSI EVO Engine',
      power: '148 bhp',
      mileage: '19.6 kmpl',
      color: 'Wild Cherry Red',
      rto: 'TS07',
      insurance: 'Valid until 2027',
    },
    features: ['GT Red Calipers & Badging', 'Ventilated Leather Seats', 'Digital Cockpit', '10.1-inch VW Play Audio', '5-Star Global NCAP Safety'],
  },
];

// ---------------------------------------------------------------------------
// Verified Marketplace Inventory: Canada 🇨🇦 (CAD)
// ---------------------------------------------------------------------------
export const CANADA_CAR_INVENTORY = [
  {
    _id: 'ca-car-201',
    brand: 'Toyota',
    model: 'RAV4',
    variant: 'XLE AWD Hybrid',
    year: 2022,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    kms: 36000,
    ownership: 'First Owner',
    price: 34500,
    currency: 'CAD',
    city: 'Toronto',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car3,
    views: 740,
    rating: 4.9,
    seller: {
      name: 'David Tremblay',
      phone: '+1 416-555-0192',
      email: 'david.t@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.5L 4-Cylinder Hybrid Synergy Drive',
      power: '219 hp combined',
      mileage: '6.0 L/100km',
      color: 'Magnetic Grey Metallic',
      province: 'Ontario',
      safety: 'Safety Certified & Clean Carfax',
    },
    features: ['All-Wheel Drive (AWD)', 'Toyota Safety Sense 2.5', 'Heated Front Seats & Steering Wheel', 'Power Moonroof', 'Apple CarPlay & Android Auto'],
  },
  {
    _id: 'ca-car-202',
    brand: 'Honda',
    model: 'Civic',
    variant: 'Touring Sedan',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 41000,
    ownership: 'First Owner',
    price: 26900,
    currency: 'CAD',
    city: 'Vancouver',
    country: 'Canada',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car4,
    views: 610,
    rating: 4.8,
    seller: {
      name: 'Michael Wong',
      phone: '+1 604-555-0143',
      email: 'm.wong@example.ca',
      verified: true,
    },
    specs: {
      engine: '1.5L Turbocharged 4-Cylinder',
      power: '180 hp',
      mileage: '6.9 L/100km',
      color: 'Platinum White Pearl',
      province: 'British Columbia',
      safety: 'Clean Title, 1 Owner',
    },
    features: ['Bose Premium 12-Speaker Audio', 'Wireless Smartphone Charging', 'Leather-Trimmed Seats', 'Navigation System', 'Honda Sensing Suite'],
  },
  {
    _id: 'ca-car-203',
    brand: 'Ford',
    model: 'F-150',
    variant: 'Lariat 4x4 SuperCrew',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 52000,
    ownership: 'First Owner',
    price: 48900,
    currency: 'CAD',
    city: 'Calgary',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car5,
    views: 920,
    rating: 5.0,
    seller: {
      name: 'Brett Anderson',
      phone: '+1 403-555-0178',
      email: 'brett.a@example.ca',
      verified: true,
    },
    specs: {
      engine: '3.5L EcoBoost V6',
      power: '400 hp / 500 lb-ft torque',
      mileage: '12.0 L/100km',
      color: 'Agate Black',
      province: 'Alberta',
      safety: 'Certified Pre-Owned',
    },
    features: ['4x4 Electronic Locking Rear Differential', 'SYNC 4 with 12-inch Display', 'B&O Sound System', 'Twin-Panel Moonroof', 'Pro Power Onboard (2.0kW)'],
  },
  {
    _id: 'ca-car-204',
    brand: 'Tesla',
    model: 'Model 3',
    variant: 'Long Range AWD',
    year: 2022,
    fuel: 'Electric',
    transmission: 'Automatic',
    kms: 34000,
    ownership: 'First Owner',
    price: 39800,
    currency: 'CAD',
    city: 'Montreal',
    country: 'Canada',
    bodyType: 'Sedan',
    category: 'Electric',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car6,
    views: 880,
    rating: 4.9,
    seller: {
      name: 'Guillaume Beaulieu',
      phone: '+1 514-555-0129',
      email: 'guillaume.b@example.ca',
      verified: true,
    },
    specs: {
      engine: 'Dual Motor All-Wheel Drive',
      power: '346 hp equivalent',
      mileage: '576 km Range (EPA)',
      color: 'Deep Blue Metallic',
      province: 'Quebec',
      safety: 'Full Battery & Drive Warranty Valid',
    },
    features: ['Autopilot Included', 'Premium Heated Seating Throughout', '15-inch Touchscreen Navigation', 'Glass Roof', 'Heat Pump HVAC for Winter'],
  },
  {
    _id: 'ca-car-205',
    brand: 'Honda',
    model: 'CR-V',
    variant: 'Sport AWD Hybrid',
    year: 2023,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    kms: 22000,
    ownership: 'First Owner',
    price: 38200,
    currency: 'CAD',
    city: 'Ottawa',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car7,
    views: 490,
    rating: 4.8,
    seller: {
      name: 'Sarah MacLeod',
      phone: '+1 613-555-0164',
      email: 'sarah.m@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L 4-Cylinder Hybrid Electric',
      power: '204 hp combined',
      mileage: '6.4 L/100km',
      color: 'Meteorite Gray Metallic',
      province: 'Ontario',
      safety: 'Ontario Safety Standard Certificate',
    },
    features: ['Real Time AWD with Intelligent Control', 'Gloss Black 18-inch Alloys', 'Heated Steering Wheel', 'Dual-Chrome Exhaust Finishers', 'Blind Spot Information'],
  },
  {
    _id: 'ca-car-206',
    brand: 'BMW',
    model: '3 Series',
    variant: '330i xDrive Sedan',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 44000,
    ownership: 'First Owner',
    price: 37800,
    currency: 'CAD',
    city: 'Toronto',
    country: 'Canada',
    bodyType: 'Sedan',
    category: 'Luxury',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 710,
    rating: 4.9,
    seller: {
      name: 'Alexander Ross',
      phone: '+1 416-555-0187',
      email: 'a.ross@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L TwinPower Turbo 4-Cylinder',
      power: '255 hp / 295 lb-ft',
      mileage: '8.3 L/100km',
      color: 'Portimao Blue Metallic',
      province: 'Ontario',
      safety: 'BMW CPO Warranty Option',
    },
    features: ['xDrive Intelligent All-Wheel Drive', 'M Sport Appearance Package', 'Live Cockpit Professional', 'Harman Kardon Surround Sound', 'Head-Up Display'],
  },
  {
    _id: 'ca-car-207',
    brand: 'Hyundai',
    model: 'Tucson',
    variant: 'Ultimate AWD Hybrid',
    year: 2023,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    kms: 25000,
    ownership: 'First Owner',
    price: 36400,
    currency: 'CAD',
    city: 'Mississauga',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car2,
    views: 450,
    rating: 4.8,
    seller: {
      name: 'Jaspreet Gill',
      phone: '+1 905-555-0155',
      email: 'jaspreet.g@example.ca',
      verified: true,
    },
    specs: {
      engine: '1.6L Turbo GDI Hybrid AWD',
      power: '226 hp combined',
      mileage: '6.4 L/100km',
      color: 'Amazon Gray',
      province: 'Ontario',
      safety: 'Clean Carfax, No Accidents',
    },
    features: ['HTRAC All-Wheel Drive', 'Remote Smart Parking Assist (Smart Key)', 'Panoramic Sunroof', 'Surround View Monitor', 'Bose Premium Audio'],
  },
  {
    _id: 'ca-car-208',
    brand: 'Mazda',
    model: 'CX-5',
    variant: 'GT AWD',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 39000,
    ownership: 'First Owner',
    price: 29500,
    currency: 'CAD',
    city: 'Edmonton',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car3,
    views: 380,
    rating: 4.8,
    seller: {
      name: 'Ryan Miller',
      phone: '+1 780-555-0131',
      email: 'ryan.m@example.ca',
      verified: true,
    },
    specs: {
      engine: 'Skyactiv-G 2.5L DOHC 4-Cylinder',
      power: '187 hp',
      mileage: '8.5 L/100km',
      color: 'Soul Red Crystal Metallic',
      province: 'Alberta',
      safety: 'Inspected with Winter Tires Package',
    },
    features: ['i-Activ AWD System', 'Nappa Leather Upholstery', 'Windshield-Projected Active Driving Display', 'Bose 10-Speaker Audio', 'Power Liftgate'],
  },
  {
    _id: 'ca-car-209',
    brand: 'Mercedes-Benz',
    model: 'GLC',
    variant: 'GLC 300 4MATIC SUV',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 31000,
    ownership: 'First Owner',
    price: 46900,
    currency: 'CAD',
    city: 'Vancouver',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'Luxury',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car4,
    views: 860,
    rating: 5.0,
    seller: {
      name: 'Oliver Zhang',
      phone: '+1 604-555-0199',
      email: 'oliver.z@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L Turbo Inline-4 with Mild Hybrid',
      power: '255 hp / 273 lb-ft',
      mileage: '9.2 L/100km',
      color: 'Selenite Grey Metallic',
      province: 'British Columbia',
      safety: 'Mercedes-Benz Certified Pre-Owned',
    },
    features: ['4MATIC Permanent All-Wheel Drive', 'MBUX Multimedia with Voice Control', 'Burmester Surround Sound', 'Panoramic Sunroof', 'AMG Line Exterior Styling'],
  },
  {
    _id: 'ca-car-210',
    brand: 'Kia',
    model: 'EV6',
    variant: 'Wind AWD Long Range',
    year: 2023,
    fuel: 'Electric',
    transmission: 'Automatic',
    kms: 18000,
    ownership: 'First Owner',
    price: 44200,
    currency: 'CAD',
    city: 'Toronto',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'Electric',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car5,
    views: 790,
    rating: 4.9,
    seller: {
      name: 'Marcus Johnson',
      phone: '+1 416-555-0112',
      email: 'marcus.j@example.ca',
      verified: true,
    },
    specs: {
      engine: 'Dual Motor AWD 77.4 kWh Battery',
      power: '320 hp / 446 lb-ft torque',
      mileage: '441 km Range (EPA)',
      color: 'Glacier White',
      province: 'Ontario',
      safety: 'Full Manufacturer Warranty Valid',
    },
    features: ['800V Ultra-Fast Charging (10-80% in 18 min)', 'Highway Driving Assist 2', 'Dual 12.3-inch Panoramic Curved Displays', 'Vehicle-to-Load (V2L) Power Outlets', 'Heated & Ventilated Front Seats'],
  },
  {
    _id: 'ca-car-211',
    brand: 'Volkswagen',
    model: 'Golf',
    variant: 'GTI Performance',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Manual',
    kms: 29000,
    ownership: 'First Owner',
    price: 32400,
    currency: 'CAD',
    city: 'Montreal',
    country: 'Canada',
    bodyType: 'Hatchback',
    category: 'Hatchback',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car6,
    views: 420,
    rating: 4.8,
    seller: {
      name: 'Etienne Gagnon',
      phone: '+1 514-555-0177',
      email: 'etienne.g@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L TSI Turbocharged 4-Cylinder',
      power: '241 hp',
      mileage: '8.4 L/100km',
      color: 'Kings Red Metallic',
      province: 'Quebec',
      safety: 'Inspected, Clean Title',
    },
    features: ['6-Speed Manual Transmission', 'VAQ Torque-Sensing Limited-Slip Diff', 'Clark Plaid Tartan Sport Seats', 'Harman Kardon Audio', 'Digital Cockpit Pro'],
  },
  {
    _id: 'ca-car-212',
    brand: 'Subaru',
    model: 'Outback',
    variant: 'Premier XT Turbo AWD',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 37000,
    ownership: 'First Owner',
    price: 35900,
    currency: 'CAD',
    city: 'Calgary',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car7,
    views: 510,
    rating: 4.9,
    seller: {
      name: 'Jordan Clark',
      phone: '+1 403-555-0149',
      email: 'jordan.c@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.4L Turbocharged SUBARU BOXER',
      power: '260 hp / 277 lb-ft',
      mileage: '9.1 L/100km',
      color: 'Autumn Green Metallic',
      province: 'Alberta',
      safety: 'Subaru Certified Inspection Report',
    },
    features: ['Symmetrical Full-Time AWD', 'X-MODE with Hill Descent Control', 'EyeSight Driver Assist Technology', 'Nappa Leather Seating', '11.6-inch Tablet Touchscreen'],
  },
  {
    _id: 'ca-car-213',
    brand: 'Toyota',
    model: 'Corolla',
    variant: 'SE Sedan',
    year: 2023,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 19000,
    ownership: 'First Owner',
    price: 24800,
    currency: 'CAD',
    city: 'Brampton',
    country: 'Canada',
    bodyType: 'Sedan',
    category: 'Sedan',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car1,
    views: 340,
    rating: 4.7,
    seller: {
      name: 'Harpreet Bains',
      phone: '+1 905-555-0182',
      email: 'harpreet.b@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L Dynamic Force Engine',
      power: '169 hp',
      mileage: '6.7 L/100km',
      color: 'Celestite Metallic',
      province: 'Ontario',
      safety: 'Safety Certified, 1 Owner',
    },
    features: ['Sport Tuned Suspension', '18-inch Alloy Wheels', 'Paddle Shifters', 'Toyota Safety Sense 3.0', 'Blind Spot Monitor with Rear Cross Traffic Alert'],
  },
  {
    _id: 'ca-car-214',
    brand: 'Chevrolet',
    model: 'Silverado 1500',
    variant: 'RST 4x4 Crew Cab',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 48000,
    ownership: 'First Owner',
    price: 45500,
    currency: 'CAD',
    city: 'Winnipeg',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car2,
    views: 530,
    rating: 4.8,
    seller: {
      name: 'Tyler Scott',
      phone: '+1 204-555-0163',
      email: 'tyler.s@example.ca',
      verified: true,
    },
    specs: {
      engine: '5.3L EcoTec3 V8',
      power: '355 hp / 383 lb-ft',
      mileage: '13.2 L/100km',
      color: 'Glacier Blue Metallic',
      province: 'Manitoba',
      safety: 'Manitoba Safety Certificate Passed',
    },
    features: ['Autotrac 2-Speed Transfer Case', '13.4-inch Touchscreen with Google Built-in', 'Chevy Safety Assist', 'Multi-Flex Tailgate', 'Heated Seats & Steering Wheel'],
  },
  {
    _id: 'ca-car-215',
    brand: 'Nissan',
    model: 'Rogue',
    variant: 'Platinum AWD',
    year: 2022,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 42000,
    ownership: 'Second Owner',
    price: 28900,
    currency: 'CAD',
    city: 'Mississauga',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'SUV',
    isFeatured: false,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car3,
    views: 360,
    rating: 4.7,
    seller: {
      name: 'Karen Bell',
      phone: '+1 905-555-0138',
      email: 'karen.b@example.ca',
      verified: true,
    },
    specs: {
      engine: '1.5L VC-Turbo 3-Cylinder',
      power: '201 hp / 225 lb-ft',
      mileage: '7.6 L/100km',
      color: 'Caspian Blue Metallic',
      province: 'Ontario',
      safety: 'Carfax Verified, Clean History',
    },
    features: ['Intelligent All-Wheel Drive', 'ProPILOT Assist with Navi-link', 'Quilted Semi-Aniline Leather', '12.3-inch Digital Dashboard', 'Head-Up Display'],
  },
  {
    _id: 'ca-car-216',
    brand: 'Audi',
    model: 'Q5',
    variant: '45 TFSI Progressiv S-Line',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    kms: 47000,
    ownership: 'First Owner',
    price: 39200,
    currency: 'CAD',
    city: 'Vancouver',
    country: 'Canada',
    bodyType: 'SUV',
    category: 'Luxury',
    isFeatured: true,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fallbackImage: car4,
    views: 750,
    rating: 4.9,
    seller: {
      name: 'Christopher Evans',
      phone: '+1 604-555-0171',
      email: 'c.evans@example.ca',
      verified: true,
    },
    specs: {
      engine: '2.0L TFSI Turbo 4-Cylinder Mild Hybrid',
      power: '261 hp / 273 lb-ft',
      mileage: '9.3 L/100km',
      color: 'Mythos Black Metallic',
      province: 'British Columbia',
      safety: 'Audi Certified Plus Available',
    },
    features: ['quattro All-Wheel Drive with Ultra Technology', 'Audi Virtual Cockpit Plus', 'Panoramic Glass Sunroof', 'Top View Camera System', 'Bang & Olufsen 3D Sound'],
  },
];

/**
 * Returns raw inventory based on country
 * @param {string} country
 * @returns {Array}
 */
export function getInventoryByCountry(country = 'India') {
  return country === 'Canada' ? CANADA_CAR_INVENTORY : INDIA_CAR_INVENTORY;
}

/**
 * Fetch marketplace vehicle listings with backend integration + fallback catalog
 * @param {Object} params
 * @returns {Promise<{ cars: Array, total: number, categoryCounts: Object, page: number, totalPages: number }>}
 */
export async function getMarketplaceCars({
  country = 'India',
  city = '',
  category = 'All Cars',
  search = '',
  brand = '',
  model = '',
  minPrice = null,
  maxPrice = null,
  minYear = null,
  maxYear = null,
  fuel = '',
  transmission = '',
  ownership = '',
  sort = 'newest',
  page = 1,
  limit = 12,
} = {}) {
  // 1. Check if backend has active listings in MongoDB
  let remoteListings = [];
  let remoteTotal = 0;

  try {
    const queryParams = new URLSearchParams();
    if (city) queryParams.set('city', city);
    if (brand) queryParams.set('brand', brand);
    if (model) queryParams.set('model', model);
    if (fuel) queryParams.set('fuel', fuel);
    if (transmission) queryParams.set('transmission', transmission);
    if (search) queryParams.set('search', search);
    if (minPrice) queryParams.set('minPrice', String(minPrice));
    if (maxPrice) queryParams.set('maxPrice', String(maxPrice));
    if (minYear) queryParams.set('minYear', String(minYear));
    if (maxYear) queryParams.set('maxYear', String(maxYear));

    // Map frontend sort values to backend syntax
    if (sort === 'price-low') queryParams.set('sort', 'price');
    else if (sort === 'price-high') queryParams.set('sort', '-price');
    else if (sort === 'year-new') queryParams.set('sort', '-year');
    else if (sort === 'mileage-low') queryParams.set('sort', 'kms');
    else queryParams.set('sort', '-createdAt');

    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));

    // Try `/cars` endpoint first, then fallback to `/vehicles`
    let res = null;
    try {
      res = await api.get(`/cars?${queryParams.toString()}`);
    } catch {
      res = await api.get(`/vehicles?${queryParams.toString()}`);
    }

    if (res?.data?.success) {
      const fetched = res.data.data?.cars || res.data.data?.listings || [];
      if (Array.isArray(fetched) && fetched.length > 0) {
        remoteListings = fetched.map((item) => {
          // Normalize backend structure
          const veh = item.vehicle || item;
          return {
            _id: item._id || veh._id,
            brand: veh.brand || '',
            model: veh.model || '',
            variant: veh.variant || '',
            year: veh.year || 2022,
            fuel: veh.fuel || 'Petrol',
            transmission: veh.transmission || 'Automatic',
            kms: veh.kms || 30000,
            ownership: veh.ownership === 1 ? 'First Owner' : 'Second Owner',
            price: item.price || veh.price || 0,
            currency: veh.country === 'Canada' ? 'CAD' : 'INR',
            city: veh.city || city || (country === 'Canada' ? 'Toronto' : 'Delhi'),
            country: veh.country || country,
            bodyType: veh.bodyType || 'SUV',
            category: veh.category || veh.bodyType || 'SUV',
            isFeatured: Boolean(item.isFeatured || veh.isFeatured || item.views > 500),
            isVerified: true,
            image: (veh.images && veh.images[0]) || car1,
            views: item.views || 100,
            seller: item.seller || { name: 'WheelGenie Verified' },
          };
        });
        remoteTotal = res.data.pagination?.total || remoteListings.length;
      }
    }
  } catch {
    // Backend API unavailable or empty; fallback catalog handles cleanly
  }

  // 2. Fallback to Country-Specific Marketplace Inventory
  let dataset = remoteListings.length > 0 ? remoteListings : getInventoryByCountry(country);

  // Filter: Country isolation (never mix India and Canada)
  dataset = dataset.filter((car) => {
    if (!car.country) return true;
    return car.country.toLowerCase() === country.toLowerCase();
  });

  // Calculate live Category Counts for current country
  const categoryCounts = {
    'All Cars': dataset.length,
    'Hatchback': dataset.filter((c) => c.category === 'Hatchback' || c.bodyType === 'Hatchback').length,
    'Sedan': dataset.filter((c) => c.category === 'Sedan' || c.bodyType === 'Sedan').length,
    'SUV': dataset.filter((c) => c.category === 'SUV' || c.bodyType === 'SUV').length,
    'Luxury': dataset.filter((c) => c.category === 'Luxury' || c.price > (country === 'Canada' ? 37000 : 2000000)).length,
    'Electric': dataset.filter((c) => c.category === 'Electric' || c.fuel === 'Electric').length,
  };

  // Filter: Category
  if (category && category !== 'All Cars') {
    dataset = dataset.filter((car) => {
      if (category === 'Luxury') {
        return car.category === 'Luxury' || car.price > (country === 'Canada' ? 37000 : 2000000);
      }
      if (category === 'Electric') {
        return car.fuel === 'Electric' || car.category === 'Electric';
      }
      return car.category === category || car.bodyType === category;
    });
  }

  // Filter: Search Keyword (Make, Model, Variant, City)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    dataset = dataset.filter(
      (car) =>
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.variant && car.variant.toLowerCase().includes(q)) ||
        car.city.toLowerCase().includes(q)
    );
  }

  // Filter: City (if specific city filter is selected)
  if (city && city.trim() && city.toLowerCase() !== 'all') {
    const targetCity = city.trim().toLowerCase();
    dataset = dataset.filter((car) => car.city.toLowerCase().includes(targetCity));
  }

  // Filter: Brand / Make
  if (brand && brand.trim() && brand !== 'all') {
    dataset = dataset.filter((car) => car.brand.toLowerCase() === brand.trim().toLowerCase());
  }

  // Filter: Model
  if (model && model.trim() && model !== 'all') {
    dataset = dataset.filter((car) => car.model.toLowerCase() === model.trim().toLowerCase());
  }

  // Filter: Fuel Type
  if (fuel && fuel.trim()) {
    const fuelList = fuel.split(',').map((f) => f.trim().toLowerCase());
    dataset = dataset.filter((car) => fuelList.includes(car.fuel.toLowerCase()));
  }

  // Filter: Transmission
  if (transmission && transmission.trim()) {
    const transList = transmission.split(',').map((t) => t.trim().toLowerCase());
    dataset = dataset.filter((car) => transList.includes(car.transmission.toLowerCase()));
  }

  // Filter: Ownership
  if (ownership && ownership.trim()) {
    const ownerList = ownership.split(',').map((o) => o.trim().toLowerCase());
    dataset = dataset.filter((car) => ownerList.includes(car.ownership.toLowerCase()));
  }

  // Filter: Price Range
  if (minPrice != null && !isNaN(minPrice)) {
    dataset = dataset.filter((car) => car.price >= Number(minPrice));
  }
  if (maxPrice != null && !isNaN(maxPrice)) {
    dataset = dataset.filter((car) => car.price <= Number(maxPrice));
  }

  // Filter: Year Range
  if (minYear != null && !isNaN(minYear)) {
    dataset = dataset.filter((car) => car.year >= Number(minYear));
  }
  if (maxYear != null && !isNaN(maxYear)) {
    dataset = dataset.filter((car) => car.year <= Number(maxYear));
  }

  // Sorting
  const sorted = [...dataset].sort((a, b) => {
    switch (sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'year-new':
        return b.year - a.year;
      case 'mileage-low':
        return a.kms - b.kms;
      case 'newest':
      default:
        // Featured first, then newest year/views
        if (a.isFeatured !== b.isFeatured) {
          return b.isFeatured ? 1 : -1;
        }
        return b.year - a.year;
    }
  });

  const total = remoteListings.length > 0 && remoteTotal ? remoteTotal : sorted.length;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedCars = sorted.slice(startIndex, startIndex + limitNum);

  return {
    cars: paginatedCars,
    total,
    categoryCounts,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
}

/**
 * Get detailed car by ID
 * @param {string} carId
 * @returns {Promise<Object>}
 */
export async function getCarById(carId) {
  // 1. Try remote API
  try {
    const res = await api.get(`/cars/${carId}`);
    if (res?.data?.success && res.data.data?.car) {
      return res.data.data.car;
    }
  } catch {
    // Fall back to local dataset
  }

  // 2. Search local inventories
  const allCars = [...INDIA_CAR_INVENTORY, ...CANADA_CAR_INVENTORY];
  const found = allCars.find((c) => c._id === carId || c.id === carId);
  if (found) return found;

  return allCars[0];
}

export default {
  INDIA_CAR_INVENTORY,
  CANADA_CAR_INVENTORY,
  getInventoryByCountry,
  getMarketplaceCars,
  getCarById,
};
