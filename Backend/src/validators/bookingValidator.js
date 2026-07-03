import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    mechanicId: z.string({ required_error: 'Mechanic ID is required' }),
    vehicleId: z.string({ required_error: 'Vehicle ID is required' }),
    service: z.string({ required_error: 'Service description is required' }).trim().min(5, 'Service description must be at least 5 characters'),
    date: z.string({ required_error: 'Booking date is required' }).datetime({ message: 'Invalid date format' })
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(
      ['Pending', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Cancelled'],
      { required_error: 'Status is required', invalid_type_error: 'Invalid booking status' }
    )
  })
});

export const mechanicQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    skills: z.string().optional(),
    page: z.string().transform(val => Number(val)).pipe(z.number().min(1)).optional(),
    limit: z.string().transform(val => Number(val)).pipe(z.number().min(1)).optional()
  }).optional()
});
