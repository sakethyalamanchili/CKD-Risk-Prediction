// Feature means and standard deviations for StandardScaler
// These values should be the same as those used during model training
const FEATURE_MEANS = {
  serumCreatinine: 1.3, // Example value - replace with actual mean from your training data
  estimatedGFR: 70.5,
  hemoglobinLevel: 13.2,
  ureaNitrogenLevel: 18.5,
  albuminLevel: 3.8,
  whiteBloodCellCount: 7.2,
  bloodGlucoseLevel: 110.5,
  age: 55.2,
  potassiumLevel: 4.2,
  sodiumLevel: 138.5,
};

const FEATURE_STD_DEVS = {
  serumCreatinine: 1.1, // Example value - replace with actual std dev from your training data
  estimatedGFR: 25.3,
  hemoglobinLevel: 2.1,
  ureaNitrogenLevel: 12.8,
  albuminLevel: 0.7,
  whiteBloodCellCount: 2.5,
  bloodGlucoseLevel: 45.2,
  age: 15.8,
  potassiumLevel: 0.6,
  sodiumLevel: 4.2,
};

// Define the thresholds based on the provided mean probabilities and standard deviations
const CKD_THRESHOLDS = [
  { stage: 0, meanProb: 0.724, stdDev: 0.212, min: 0.51, max: 0.93 }, // No Condition
  { stage: 1, meanProb: 0.554, stdDev: 0.19, min: 0.36, max: 0.74 }, // Stage 1
  { stage: 2, meanProb: 0.528, stdDev: 0.217, min: 0.31, max: 0.74 }, // Stage 2
  { stage: 3, meanProb: 0.534, stdDev: 0.225, min: 0.31, max: 0.76 }, // Stage 3
  { stage: 4, meanProb: 0.599, stdDev: 0.222, min: 0.38, max: 0.82 }, // Stage 4
  { stage: 5, meanProb: 0.65, stdDev: 0.192, min: 0.46, max: 0.84 }, // Stage 5
];

// Feature importance weights based on the provided data
const FEATURE_WEIGHTS = {
  serumCreatinine: 0.287242,
  estimatedGFR: 0.172315,
  albuminLevel: 0.117859,
  hemoglobinLevel: 0.117017,
  whiteBloodCellCount: 0.114151,
  age: 0.052832,
  bloodGlucoseLevel: 0.049214,
  ureaNitrogenLevel: 0.039039,
  sodiumLevel: 0.026435,
  potassiumLevel: 0.023895,
};

// Normal ranges for each feature
const NORMAL_RANGES = {
  serumCreatinine: { min: 0.7, max: 1.3 }, // mg/dL
  estimatedGFR: { min: 90, max: 120 }, // mL/min/1.73m²
  hemoglobinLevel: { min: 13.5, max: 17.5 }, // g/dL
  ureaNitrogenLevel: { min: 7, max: 20 }, // mg/dL
  albuminLevel: { min: 3.5, max: 5.0 }, // g/dL
  whiteBloodCellCount: { min: 4.5, max: 11.0 }, // ×10³/µL
  bloodGlucoseLevel: { min: 70, max: 100 }, // mg/dL
  age: { min: 18, max: 65 }, // years
  potassiumLevel: { min: 3.5, max: 5.0 }, // mEq/L
  sodiumLevel: { min: 135, max: 145 }, // mEq/L
};

// Function to standardize a value using the StandardScaler approach
const standardizeValue = (value: number, feature: string): number => {
  const mean = FEATURE_MEANS[feature as keyof typeof FEATURE_MEANS];
  const stdDev = FEATURE_STD_DEVS[feature as keyof typeof FEATURE_STD_DEVS];

  if (mean === undefined || stdDev === undefined) {
    return 0;
  }

  // Apply StandardScaler formula: (x - mean) / std_dev
  return (value - mean) / stdDev;
};

// Function to calculate the weighted score based on feature importance
const calculateWeightedScore = (formData: Record<string, number>): number => {
  let score = 0;
  let totalWeight = 0;

  // Calculate weighted score based on feature importance
  for (const [feature, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const value = formData[feature];
    if (value !== undefined) {
      // First standardize the value
      const standardizedValue = standardizeValue(value, feature);

      // For GFR, lower is worse (inverse relationship)
      if (feature === "estimatedGFR") {
        score += weight * -standardizedValue;
      }
      // For hemoglobin, lower is worse (inverse relationship)
      else if (feature === "hemoglobinLevel") {
        score += weight * -standardizedValue;
      }
      // For albumin, lower is worse (inverse relationship)
      else if (feature === "albuminLevel") {
        score += weight * -standardizedValue;
      }
      // For all other features, higher is generally worse
      else {
        score += weight * standardizedValue;
      }

      totalWeight += weight;
    }
  }

  // Normalize the score to be between 0 and 1
  return (score / totalWeight + 1) / 2;
};

// Function to determine the CKD stage based on the calculated probability
const determineCKDStage = (probability: number): number => {
  // Find the stage with the closest mean probability
  let closestStage = 0;
  let minDistance = Number.MAX_VALUE;

  for (const threshold of CKD_THRESHOLDS) {
    const distance = Math.abs(threshold.meanProb - probability);
    if (distance < minDistance) {
      minDistance = distance;
      closestStage = threshold.stage;
    }
  }

  return closestStage;
};

// Function to determine risk level based on CKD stage
const determineRiskLevel = (stage: number): string => {
  if (stage === 0) return "Low";
  if (stage === 1 || stage === 2) return "Moderate";
  if (stage === 3) return "High";
  return "Very High";
};

// Main prediction function
export const predictCKDStage = (formData: Record<string, number>) => {
  // Calculate probability based on weighted feature importance
  const probability = calculateWeightedScore(formData);

  // Determine CKD stage based on probability
  const stage = determineCKDStage(probability);

  // Determine risk level
  const risk = determineRiskLevel(stage);

  return {
    stage,
    probability,
    risk,
  };
};