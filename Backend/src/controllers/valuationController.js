import { valuateWithGemini } from '../ai/geminiService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// POST /api/v1/valuation
export const getValuation = catchAsync(async (req, res, next) => {
  const inputData = req.body;

  let valuation;
  try {
    valuation = await valuateWithGemini(inputData);
  } catch (error) {
    console.error('Gemini Valuation Error:', error.message);
    return next(new AppError('Vehicle valuation failed. Please try again later.', 500));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Vehicle valuation completed successfully',
    data: {
      input: inputData,
      valuation
    }
  });
});
