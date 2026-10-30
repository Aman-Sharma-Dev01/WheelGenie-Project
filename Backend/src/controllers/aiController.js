import AIEvaluation from '../models/AIEvaluation.js';
import { removeBackground } from '@imgly/background-removal-node';
import { evaluateWithGemini } from '../ai/geminiService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const processedImageCache = new Map();
const processingImages = new Map();
const IMAGE_PROCESSING_TIMEOUT_MS = 20000;

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

  let lookupResponse;
  try {
    lookupResponse = await fetch(`${WIKIPEDIA_API_URL}?${searchParams}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'WheelGenie/1.0 (car image lookup)' }
    });
  } catch (error) {
    console.error('Car image lookup request failed:', error);
    return next(new AppError('Car image provider is unavailable.', 502));
  }

  if (!lookupResponse.ok) {
    return next(new AppError('Car image lookup failed.', 502));
  }

  const lookupData = await lookupResponse.json();
  const pages = lookupData?.query?.pages;
  const sourceUrl = pages ? Object.values(pages)[0]?.thumbnail?.source : null;

  if (!sourceUrl) {
    return next(new AppError('No image found for this car.', 404));
  }

  let sourceResponse;
  try {
    sourceResponse = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'WheelGenie/1.0 (car image fetch)' }
    });
  } catch (error) {
    console.error('Car image source request failed:', error);
    return next(new AppError('Car image provider is unavailable.', 502));
  }

  if (!sourceResponse.ok) {
    console.error('Car image source returned:', sourceResponse.status, sourceUrl);
    return next(new AppError('Car image fetch failed.', 502));
  }

  const sourceBuffer = Buffer.from(await sourceResponse.arrayBuffer());
  const sourceBlob = new Blob([sourceBuffer], {
    type: sourceResponse.headers.get('content-type') || 'image/jpeg'
  });

  const cacheKey = `${make.toLowerCase()}:${model.toLowerCase()}`;
  const cachedImage = processedImageCache.get(cacheKey);
  if (cachedImage) {
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
      'X-Image-Processing': 'processed-cache'
    });
    return res.send(cachedImage);
  }

  let processedBlob;
  try {
    let processingPromise = processingImages.get(cacheKey);
    if (!processingPromise) {
      processingPromise = removeBackground(sourceBlob, {
        model: 'small',
        output: { format: 'image/png', quality: 0.8 }
      });
      processingImages.set(cacheKey, processingPromise);
      processingPromise
        .then(async (blob) => {
          processedImageCache.set(cacheKey, Buffer.from(await blob.arrayBuffer()));
        })
        .catch((error) => {
          console.error('Car image background removal failed:', error);
        })
        .finally(() => processingImages.delete(cacheKey));
    }

    processedBlob = await Promise.race([
      processingPromise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image processing timed out')), IMAGE_PROCESSING_TIMEOUT_MS);
      })
    ]);
  } catch (error) {
    console.error('Car image background removal failed:', error);
    // Keep the image preview usable when the first model download or a
    // resource-limited deployment cannot complete background removal.
    res.set({
      'Content-Type': sourceResponse.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
      'X-Image-Processing': 'fallback'
    });
    return res.send(sourceBuffer);
  }
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
