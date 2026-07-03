import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Evaluate a vehicle using Google Gemini AI.
 * @param {Object} vehicleData - The vehicle input data from user.
 * @returns {Object} Parsed evaluation result.
 */
export const evaluateWithGemini = async (vehicleData) => {
  const { brand, model, variant, year, fuel, kms, ownership, accidentHistory, city, askingPrice } = vehicleData;

  const prompt = `
You are an expert automotive analyst in the Indian used car market. Analyze the following vehicle and return a detailed evaluation.

Vehicle Details:
- Brand: ${brand}
- Model: ${model}
- Variant: ${variant}
- Year: ${year}
- Fuel Type: ${fuel}
- Kilometers Driven: ${kms} km
- Ownership: ${ownership}${ownership === 1 ? 'st' : ownership === 2 ? 'nd' : ownership === 3 ? 'rd' : 'th'} Owner
- Accident History: ${accidentHistory || 'None'}
- City: ${city}
- Asking Price: ₹${askingPrice?.toLocaleString('en-IN')}

Return your analysis as a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "estimatedMarketPrice": <number in INR>,
  "priceRange": { "min": <number>, "max": <number> },
  "isAskingPriceFair": <boolean>,
  "hiddenRisks": [<list of risk strings>],
  "maintenanceCostPrediction": "<annual maintenance cost estimate and explanation>",
  "ownershipRecommendation": "<recommendation text>",
  "resaleValue": <estimated resale value in 2 years as number>,
  "futureDepreciation": [
    { "year": 1, "value": <projected value after 1 year> },
    { "year": 2, "value": <projected value after 2 years> },
    { "year": 3, "value": <projected value after 3 years> },
    { "year": 5, "value": <projected value after 5 years> }
  ],
  "overallRating": <number from 1 to 10>,
  "pros": [<list of advantage strings>],
  "cons": [<list of disadvantage strings>],
  "buyAvoidRecommendation": "<Buy OR Avoid OR Proceed with Caution>",
  "confidenceScore": <number from 0 to 100>
}
`;

  const generationModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await generationModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Parse the JSON response (strip markdown code fences if present)
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const evaluation = JSON.parse(cleanText);
  return evaluation;
};

/**
 * Get vehicle valuation using Google Gemini AI.
 * @param {Object} vehicleData - The vehicle input data.
 * @returns {Object} Parsed valuation result.
 */
export const valuateWithGemini = async (vehicleData) => {
  const { brand, model, variant, year, fuel, kms, ownership, city } = vehicleData;

  const prompt = `
You are an expert vehicle valuation analyst in the Indian used car market. Provide a precise valuation for this vehicle.

Vehicle Details:
- Brand: ${brand}
- Model: ${model}
- Variant: ${variant}
- Year: ${year}
- Fuel Type: ${fuel}
- Kilometers Driven: ${kms} km
- Ownership: ${ownership}${ownership === 1 ? 'st' : ownership === 2 ? 'nd' : ownership === 3 ? 'rd' : 'th'} Owner
- City: ${city}

Return your valuation as a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "expectedPrice": <number in INR>,
  "marketRange": { "min": <number>, "max": <number> },
  "isFairPrice": <boolean based on market conditions>,
  "negotiationMargin": "<percentage and explanation>",
  "depreciationRate": "<annual depreciation percentage and explanation>",
  "fiveYearProjection": [
    { "year": 1, "value": <projected value> },
    { "year": 2, "value": <projected value> },
    { "year": 3, "value": <projected value> },
    { "year": 4, "value": <projected value> },
    { "year": 5, "value": <projected value> }
  ],
  "buybackValue": <estimated buyback value>,
  "ownershipCostPerYear": <estimated annual ownership cost>,
  "summary": "<brief valuation summary>"
}
`;

  const generationModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await generationModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const valuation = JSON.parse(cleanText);
  return valuation;
};
