import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    phone: z.string({ required_error: 'Phone number is required' }).trim().min(10, 'Phone must be at least 10 digits'),
    role: z.enum(['customer', 'mechanic', 'admin']).default('customer'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional()
    }).optional(),
    profilePic: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' })
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().trim().min(10, 'Phone must be at least 10 digits').optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional()
    }).optional(),
    profilePic: z.string().optional()
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
  })
});

export const googleLoginSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Google OAuth token is required' })
  })
});

// Middleware helper to validate incoming requests against schemas
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    next(error);
  }
};
