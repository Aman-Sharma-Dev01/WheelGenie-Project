import { z } from 'zod';

export const evaluateVehicleSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
    model: z.string({ required_error: 'Model is required' }).trim().min(1),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1),
    year: z.number({ required_error: 'Year is required' }).min(1900).max(new Date().getFullYear() + 1),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], { required_error: 'Fuel type is required' }),
    kms: z.number({ required_error: 'Kilometers is required' }).min(0),
    ownership: z.number({ required_error: 'Ownership is required' }).min(1),
    accidentHistory: z.string().default('None'),
    city: z.string({ required_error: 'City is required' }).trim().min(1),
    askingPrice: z.number({ required_error: 'Asking price is required' }).min(0)
  })
});

export const valuationSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
    model: z.string({ required_error: 'Model is required' }).trim().min(1),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1),
    year: z.number({ required_error: 'Year is required' }).min(1900).max(new Date().getFullYear() + 1),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], { required_error: 'Fuel type is required' }),
    kms: z.number({ required_error: 'Kilometers is required' }).min(0),
    ownership: z.number({ required_error: 'Ownership is required' }).min(1),
    city: z.string({ required_error: 'City is required' }).trim().min(1)
  })
});
