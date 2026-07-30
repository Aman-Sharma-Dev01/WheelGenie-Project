import express from 'express';
import * as inspectionController from '../controllers/inspectionController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Inspection ID is required' }).length(24, 'Invalid inspection ID')
  })
});

const sellRequestIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const createInspectionSchema = z.object({
  body: z.object({
    sellRequestId: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID'),
    scheduledDate: z.string().optional(),
    inspectedBy: z.string().length(24, 'Invalid official ID').optional()
  })
});

const updateInspectionSchema = z.object({
  body: z.object({
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    scheduledDate: z.string().optional(),
    completedDate: z.string().optional(),
    exterior: z.object({
      bodyCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      paintCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      rustDamage: z.enum(['none', 'minor', 'moderate', 'severe']).optional(),
      dentsScratches: z.enum(['none', 'minor', 'moderate', 'severe']).optional(),
      glassCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      lightsCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      tyresCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      notes: z.string().optional()
    }).optional(),
    interior: z.object({
      seatsCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      dashboardCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      electronicsWorking: z.boolean().optional(),
      acHeatingWorking: z.boolean().optional(),
      odometerReading: z.number().optional(),
      notes: z.string().optional()
    }).optional(),
    mechanical: z.object({
      engineCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      transmissionCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      suspensionCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      brakesCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      steeringCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      exhaustCondition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      fluidLevels: z.enum(['good', 'low', 'needs_change']).optional(),
      notes: z.string().optional()
    }).optional(),
    testDrive: z.object({
      performed: z.boolean().optional(),
      enginePerformance: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      transmissionPerformance: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      brakePerformance: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      steeringPerformance: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
      noiseVibration: z.enum(['none', 'minor', 'moderate', 'severe']).optional(),
      notes: z.string().optional()
    }).optional(),
    documents: z.object({
      rcVerified: z.boolean().optional(),
      insuranceVerified: z.boolean().optional(),
      pucVerified: z.boolean().optional(),
      serviceHistoryVerified: z.boolean().optional(),
      ownershipVerified: z.boolean().optional(),
      notes: z.string().optional()
    }).optional(),
    overallRating: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
    estimatedValue: z.number().min(0).optional(),
    recommendation: z.enum(['accept_as_is', 'accept_with_repairs', 'reject']).optional(),
    repairEstimate: z.number().min(0).optional(),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Inspection ID is required' }).length(24, 'Invalid inspection ID')
  })
});

const uploadImagesSchema = z.object({
  body: z.object({
    images: z.array(z.object({
      category: z.enum(['exterior', 'interior', 'mechanical', 'documents', 'damage', 'other']),
      url: z.string({ required_error: 'Image URL is required' }),
      publicId: z.string().optional()
    })).min(1, 'At least one image is required')
  }),
  params: z.object({
    id: z.string({ required_error: 'Inspection ID is required' }).length(24, 'Invalid inspection ID')
  })
});

const uploadReportSchema = z.object({
  body: z.object({
    reportUrl: z.string({ required_error: 'Report URL is required' }),
    reportPublicId: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Inspection ID is required' }).length(24, 'Invalid inspection ID')
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.post('/', validate(createInspectionSchema), inspectionController.createInspection);
router.get('/:id', validate(idParamSchema), inspectionController.getInspectionById);
router.put('/:id', validate(updateInspectionSchema), inspectionController.updateInspection);
router.get('/sell-request/:id', validate(sellRequestIdParamSchema), inspectionController.getInspectionBySellRequest);
router.post('/:id/upload-images', validate(uploadImagesSchema), inspectionController.uploadInspectionImages);
router.post('/:id/upload-report', validate(uploadReportSchema), inspectionController.uploadInspectionReport);

export default router;