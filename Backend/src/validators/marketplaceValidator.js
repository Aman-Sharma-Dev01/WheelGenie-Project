import { z } from 'zod';

// Schema for creating a vehicle and its marketplace listing
export const createVehicleSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1, 'Brand cannot be empty'),
    model: z.string({ required_error: 'Model is required' }).trim().min(1, 'Model cannot be empty'),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1, 'Variant cannot be empty'),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], {
      required_error: 'Fuel type is required',
      invalid_type_error: 'Fuel type must be Petrol, Diesel, CNG, Electric or Hybrid'
    }),
    transmission: z.enum(['Manual', 'Automatic'], {
      required_error: 'Transmission type is required',
      invalid_type_error: 'Transmission must be Manual or Automatic'
    }),
    kms: z.number({ required_error: 'Kilometers run is required' }).min(0, 'Kilometers cannot be negative'),
    year: z.number({ required_error: 'Manufacturing year is required' })
      .min(1901, 'Year must be after 1900')
      .max(new Date().getFullYear() + 1, 'Invalid manufacturing year'),
    ownership: z.number({ required_error: 'Ownership number is required' }).min(1, 'Ownership must be at least 1'),
    city: z.string({ required_error: 'City is required' }).trim().min(1, 'City cannot be empty'),
    images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one vehicle image is required'),
    price: z.number({ required_error: 'Price is required' }).min(0, 'Price cannot be negative'),
    description: z.string({ required_error: 'Description is required' }).trim().min(10, 'Description must be at least 10 characters long')
  })
});

// Schema for updating a listing (all fields optional)
export const updateVehicleSchema = z.object({
  body: z.object({
    brand: z.string().trim().min(1).optional(),
    model: z.string().trim().min(1).optional(),
    variant: z.string().trim().min(1).optional(),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']).optional(),
    transmission: z.enum(['Manual', 'Automatic']).optional(),
    kms: z.number().min(0).optional(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    ownership: z.number().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    price: z.number().min(0).optional(),
    description: z.string().trim().min(10).optional(),
    status: z.enum(['active', 'sold', 'paused']).optional()
  })
});

// Schema for validating marketplace query filters
export const queryListingSchema = z.object({
  query: z.object({
    brand: z.string().optional(),
    city: z.string().optional(),
    fuel: z.string().optional(),
    minPrice: z.string().transform(val => Number(val)).pipe(z.number().min(0)).optional(),
    maxPrice: z.string().transform(val => Number(val)).pipe(z.number().min(0)).optional(),
    minYear: z.string().transform(val => Number(val)).pipe(z.number().min(1900)).optional(),
    maxYear: z.string().transform(val => Number(val)).pipe(z.number()).optional(),
    minKms: z.string().transform(val => Number(val)).pipe(z.number().min(0)).optional(),
    maxKms: z.string().transform(val => Number(val)).pipe(z.number().min(0)).optional(),
    search: z.string().optional(),
    sort: z.enum(['price', '-price', 'latest', 'oldest', 'popularity', 'rating']).optional(),
    page: z.string().transform(val => Number(val)).pipe(z.number().min(1)).optional(),
    limit: z.string().transform(val => Number(val)).pipe(z.number().min(1)).optional()
  }).optional()
});
