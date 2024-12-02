import { generateSampleFoodData } from './data/SampleFoodData';
import { ProbabilityService } from './services/ProbabilityService';

// Generate sample food data
const foodItems = generateSampleFoodData();
const probabilityService = new ProbabilityService();

// Test calculations for the first food item
const item = foodItems[0];
console.log('Food Item:', item.name);
console.log('Category:', item.category);

// Calculate probabilities
const demandProb = probabilityService.calculateDemandProbability(item, 20);
console.log('Demand Probability (for 20 units):', demandProb);

const pickupProb = probabilityService.calculatePickupProbability(item);
console.log('Pickup Probability:', pickupProb);

const shelfLifeProb = probabilityService.calculateShelfLifeProbability(item);
console.log('Shelf Life Probability:', shelfLifeProb);

const confidence = probabilityService.calculateConfidenceScore(item);
console.log('Confidence Score:', confidence); 