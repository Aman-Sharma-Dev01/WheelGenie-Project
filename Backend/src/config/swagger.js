import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WheelGenie API',
      version: '1.0.0',
      description: 'AI-powered automotive platform API — Buy, Sell, Evaluate & Maintain vehicles.',
      contact: {
        name: 'WheelGenie Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication & User Management' },
      { name: 'Marketplace', description: 'Vehicle Listings & Search' },
      { name: 'Mechanics', description: 'Mechanic Profiles' },
      { name: 'Bookings', description: 'Service Booking Management' },
      { name: 'AI Evaluation', description: 'AI-Powered Vehicle Evaluation' },
      { name: 'Valuation', description: 'Vehicle Price Valuation' }
    ],
    paths: {
      // ─── AUTH ────────────────────────────────────
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'phone'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                    phone: { type: 'string', example: '9876543210' },
                    role: { type: 'string', enum: ['customer', 'mechanic', 'admin'], example: 'customer' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'User registered successfully' } }
        }
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Logged in successfully' } }
        }
      },
      '/api/v1/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          responses: { 200: { description: 'Logged out successfully' } }
        }
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User profile retrieved' } }
        }
      },
      '/api/v1/auth/profile': {
        patch: {
          tags: ['Auth'],
          summary: 'Update user profile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    phone: { type: 'string' },
                    address: { type: 'object' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Profile updated' } }
        }
      },
      '/api/v1/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset link',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: { email: { type: 'string', example: 'john@example.com' } }
                }
              }
            }
          },
          responses: { 200: { description: 'Reset link generated' } }
        }
      },
      '/api/v1/auth/reset-password/{token}': {
        patch: {
          tags: ['Auth'],
          summary: 'Reset password using token',
          parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['password'],
                  properties: { password: { type: 'string', example: 'newpassword123' } }
                }
              }
            }
          },
          responses: { 200: { description: 'Password reset successfully' } }
        }
      },
      '/api/v1/auth/google-login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with Google OAuth token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token'],
                  properties: { token: { type: 'string' } }
                }
              }
            }
          },
          responses: { 200: { description: 'Logged in via Google' } }
        }
      },

      // ─── MARKETPLACE ────────────────────────────
      '/api/v1/vehicles': {
        get: {
          tags: ['Marketplace'],
          summary: 'Browse all vehicle listings (search, filter, sort, paginate)',
          parameters: [
            { name: 'brand', in: 'query', schema: { type: 'string' } },
            { name: 'city', in: 'query', schema: { type: 'string' } },
            { name: 'fuel', in: 'query', schema: { type: 'string' } },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'minYear', in: 'query', schema: { type: 'number' } },
            { name: 'maxYear', in: 'query', schema: { type: 'number' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price', '-price', 'latest', 'oldest', 'popularity'] } },
            { name: 'page', in: 'query', schema: { type: 'number' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } }
          ],
          responses: { 200: { description: 'Listings fetched successfully' } }
        },
        post: {
          tags: ['Marketplace'],
          summary: 'Create a new vehicle listing',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['brand', 'model', 'variant', 'fuel', 'transmission', 'kms', 'year', 'ownership', 'city', 'images', 'price', 'description'],
                  properties: {
                    brand: { type: 'string', example: 'Honda' },
                    model: { type: 'string', example: 'City' },
                    variant: { type: 'string', example: 'ZX CVT' },
                    fuel: { type: 'string', example: 'Petrol' },
                    transmission: { type: 'string', example: 'Automatic' },
                    kms: { type: 'number', example: 35000 },
                    year: { type: 'number', example: 2020 },
                    ownership: { type: 'number', example: 1 },
                    city: { type: 'string', example: 'Mumbai' },
                    images: { type: 'array', items: { type: 'string' }, example: ['https://example.com/img.jpg'] },
                    price: { type: 'number', example: 850000 },
                    description: { type: 'string', example: 'Well maintained Honda City with full service history' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Listing created successfully' } }
        }
      },
      '/api/v1/vehicles/{id}': {
        get: {
          tags: ['Marketplace'],
          summary: 'Get listing details by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Listing details retrieved' } }
        },
        patch: {
          tags: ['Marketplace'],
          summary: 'Update a listing',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Listing updated' } }
        },
        delete: {
          tags: ['Marketplace'],
          summary: 'Delete a listing',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Listing deleted' } }
        }
      },

      // ─── MECHANICS ──────────────────────────────
      '/api/v1/mechanics': {
        get: {
          tags: ['Mechanics'],
          summary: 'Browse verified mechanics',
          parameters: [
            { name: 'city', in: 'query', schema: { type: 'string' } },
            { name: 'skills', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'number' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } }
          ],
          responses: { 200: { description: 'Mechanics fetched' } }
        }
      },
      '/api/v1/mechanics/{id}': {
        get: {
          tags: ['Mechanics'],
          summary: 'Get mechanic profile with reviews',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Mechanic details retrieved' } }
        }
      },

      // ─── BOOKINGS ───────────────────────────────
      '/api/v1/bookings': {
        post: {
          tags: ['Bookings'],
          summary: 'Create a service booking',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mechanicId', 'vehicleId', 'service', 'date'],
                  properties: {
                    mechanicId: { type: 'string' },
                    vehicleId: { type: 'string' },
                    service: { type: 'string', example: 'Full car service' },
                    date: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Booking created' } }
        }
      },
      '/api/v1/bookings/my': {
        get: {
          tags: ['Bookings'],
          summary: 'Get my bookings (customer or mechanic)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Bookings fetched' } }
        }
      },
      '/api/v1/bookings/{id}': {
        get: {
          tags: ['Bookings'],
          summary: 'Get booking by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Booking details retrieved' } }
        }
      },
      '/api/v1/bookings/{id}/status': {
        patch: {
          tags: ['Bookings'],
          summary: 'Update booking status',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['Pending', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Cancelled'] }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Status updated' } }
        }
      },

      // ─── AI EVALUATION ──────────────────────────
      '/api/v1/ai/evaluate': {
        post: {
          tags: ['AI Evaluation'],
          summary: 'Evaluate a vehicle using AI (Gemini)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['brand', 'model', 'variant', 'year', 'fuel', 'kms', 'ownership', 'city', 'askingPrice'],
                  properties: {
                    brand: { type: 'string', example: 'Maruti Suzuki' },
                    model: { type: 'string', example: 'Swift' },
                    variant: { type: 'string', example: 'ZXI+' },
                    year: { type: 'number', example: 2021 },
                    fuel: { type: 'string', example: 'Petrol' },
                    kms: { type: 'number', example: 28000 },
                    ownership: { type: 'number', example: 1 },
                    accidentHistory: { type: 'string', example: 'None' },
                    city: { type: 'string', example: 'Delhi' },
                    askingPrice: { type: 'number', example: 650000 }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Vehicle evaluated successfully' } }
        }
      },
      '/api/v1/ai/evaluations': {
        get: {
          tags: ['AI Evaluation'],
          summary: 'Get all my past evaluations',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Evaluations fetched' } }
        }
      },
      '/api/v1/ai/evaluations/{id}': {
        get: {
          tags: ['AI Evaluation'],
          summary: 'Get evaluation by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Evaluation retrieved' } }
        }
      },

      // ─── VALUATION ──────────────────────────────
      '/api/v1/valuation': {
        post: {
          tags: ['Valuation'],
          summary: 'Get vehicle price valuation',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['brand', 'model', 'variant', 'year', 'fuel', 'kms', 'ownership', 'city'],
                  properties: {
                    brand: { type: 'string', example: 'Hyundai' },
                    model: { type: 'string', example: 'Creta' },
                    variant: { type: 'string', example: 'SX(O)' },
                    year: { type: 'number', example: 2022 },
                    fuel: { type: 'string', example: 'Diesel' },
                    kms: { type: 'number', example: 15000 },
                    ownership: { type: 'number', example: 1 },
                    city: { type: 'string', example: 'Bangalore' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Valuation completed' } }
        }
      }
    }
  },
  apis: [] // We defined paths inline above
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'WheelGenie API Docs'
  }));
};

export default swaggerSpec;
