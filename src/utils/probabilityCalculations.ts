import { FoodItem } from '../types';
import { beta, multinomial } from 'probability-distributions';

interface CategoryDemand {
  category: string;
  probability: number;
  historicalDemand: number[];
}

interface BayesianNode {
  demand: number;
  pickup: number;
  shelfLife: number;
  waste: number;
}

// Multinomial Distribution for category demand
export function calculateMultinomialDemand(categories: CategoryDemand[]): number[] {
  const totalDemand = categories.reduce((sum, cat) => sum + cat.historicalDemand[0], 0);
  const probabilities = categories.map(cat => {
    const categoryAvg = cat.historicalDemand.reduce((a, b) => a + b) / cat.historicalDemand.length;
    return categoryAvg / totalDemand;
  });
  
  // Simulate multinomial distribution
  const n = totalDemand;
  let remaining = n;
  const result = new Array(categories.length).fill(0);
  
  for (let i = 0; i < categories.length - 1; i++) {
    const p = probabilities[i] / probabilities.slice(i).reduce((a, b) => a + b);
    result[i] = Math.round(remaining * p);
    remaining -= result[i];
  }
  result[categories.length - 1] = remaining;
  
  return result;
}

// Beta Distribution for pickup success probability
export function calculateBetaPickupRate(successes: number, failures: number): number {
  const alpha = successes + 1;
  const beta = failures + 1;
  return alpha / (alpha + beta);
}

// Conditional Probability for shelf life
export function calculateShelfLifeProbability(item: FoodItem, daysUntilExpiry: number): number {
  const maxShelfLife = getMaxShelfLife(item.category);
  return Math.max(0, Math.min(1, daysUntilExpiry / maxShelfLife));
}

// Expected waste calculation
export function calculateExpectedWaste(
  quantity: number, 
  utilizationRate: number, 
  distributionRatio: number
): number {
  return quantity * (1 - utilizationRate * distributionRatio);
}

// Helper functions
function getMaxShelfLife(category: string): number {
  const shelfLives = {
    'Dairy': 14,
    'Meat': 5,
    'Produce': 7,
    'Bakery': 3
  };
  return shelfLives[category] || 7;
}

// Combined probability calculation
export function calculateOptimalDistribution(
  items: FoodItem[],
  historicalData: Record<string, number[]>
): number[] {
  // Group items by category
  const categoryGroups = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Calculate category-level distribution using multinomial
  const categoryDemands: CategoryDemand[] = Object.entries(categoryGroups).map(([category, items]) => ({
    category,
    probability: getCategoryBaseProbability(category),
    historicalDemand: historicalData[category] || [10]
  }));

  const categoryDistribution = calculateMultinomialDemand(categoryDemands);

  // Calculate item-level distribution within categories
  return items.map(item => {
    const categoryIndex = categoryDemands.findIndex(c => c.category === item.category);
    const categoryTotal = categoryDistribution[categoryIndex];
    const itemCount = categoryGroups[item.category].length;
    
    const baseAmount = Math.floor(categoryTotal / itemCount);
    
    // Adjust based on pickup and shelf life
    const pickupRate = calculateBetaPickupRate(80, 20);
    const shelfLifeProb = calculateShelfLifeProbability(
      item,
      Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    return Math.max(1, Math.floor(baseAmount * pickupRate * shelfLifeProb));
  });
}

function getCategoryBaseProbability(category: string): number {
  const probabilities = {
    'Meat': 0.3,
    'Dairy': 0.25,
    'Produce': 0.25,
    'Bakery': 0.2
  };
  return probabilities[category] || 0.25;
}