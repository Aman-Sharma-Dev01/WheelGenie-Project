import AIEvaluation from '../models/AIEvaluation.js';
import { removeBackground } from '@imgly/background-removal-node';
import { evaluateWithGemini } from '../ai/geminiService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

// Fetch the representative car image and remove its background on the server.
export const getCarImage = catchAsync(async (req, res, next) => {
  const make = req.query.make?.trim();
  const model = req.query.model?.trim();

  if (!make || !model || make.length > 100 || model.length > 100) {
    return next(new AppError('A valid car make and model are required.', 400));
  }

  const searchParams = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${make} ${model} car`,
    gsrlimit: '1',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '420',
    format: 'json'
  });

  const lookupResponse = await fetch(`${WIKIPEDIA_API_URL}?${searchParams}`, {
    signal: AbortSignal.timeout(10000),
    headers: { 'User-Agent': 'WheelGenie/1.0 (car image lookup)' }
  });

  if (!lookupResponse.ok) {
    return next(new AppError('Car image lookup failed.', 502));
  }

  const lookupData = await lookupResponse.json();
  const pages = lookupData?.query?.pages;
  const sourceUrl = pages ? Object.values(pages)[0]?.thumbnail?.source : null;

  if (!sourceUrl) {
    return next(new AppError('No image found for this car.', 404));
  }

  const sourceResponse = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(15000),
    headers: { 'User-Agent': 'WheelGenie/1.0 (car image fetch)' }
  });

  if (!sourceResponse.ok) {
    return next(new AppError('Car image fetch failed.', 502));
  }

  const sourceBuffer = Buffer.from(await sourceResponse.arrayBuffer());
  const sourceBlob = new Blob([sourceBuffer], {
    type: sourceResponse.headers.get('content-type') || 'image/jpeg'
  });
  const processedBlob = await removeBackground(sourceBlob, {
    model: 'small',
    output: { format: 'image/png', quality: 0.8 }
  });
  const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());

  res.set({
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=86400'
  });
  res.send(processedBuffer);
});

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
