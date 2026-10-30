import AIEvaluation from '../models/AIEvaluation.js';
import { evaluateWithGemini } from '../ai/geminiService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// 1. EVALUATE VEHICLE (Protected)
export const evaluateVehicle = catchAsync(async (req, res, next) => {
  const inputData = req.body;

  // Call Gemini AI
  let evaluation;
  try {
    evaluation = await evaluateWithGemini(inputData);
  } catch (error) {
    console.error('Gemini AI Error:', error.message);
    return next(new AppError('AI evaluation failed. Please try again later.', 500));
  }

  // Store evaluation in database
  const aiEvaluation = await AIEvaluation.create({
    user: req.user._id,
    inputData,
    evaluation
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Vehicle evaluated successfully',
    data: { evaluation: aiEvaluation }
  });
});

// 2. GET MY EVALUATIONS (Protected)
export const getMyEvaluations = catchAsync(async (req, res, next) => {
  const evaluations = await AIEvaluation.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Evaluations fetched successfully',
    data: {
      count: evaluations.length,
      evaluations
    }
  });
});

// 3. GET EVALUATION BY ID (Protected)
export const getEvaluationById = catchAsync(async (req, res, next) => {
  const evaluation = await AIEvaluation.findById(req.params.id);

  if (!evaluation) {
    return next(new AppError('No evaluation found with that ID', 404));
  }

  // Only the owner or admin can access
  if (evaluation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this evaluation', 403));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Evaluation retrieved successfully',
    data: { evaluation }
  });
});
