import { FoodItem } from '../types';

interface CategoryDemand {
  category: string;
  probability: number;
  historicalDemand: number[];
}

export class ProbabilityService {
  private readonly categoryFactors: { [key: string]: number } = {
    'Dairy': 0.85,
    'Meat': 0.75,
    'Produce': 0.70,
    'Bakery': 0.65
  };

  private readonly shelfLives: { [key: string]: number } = {
    'Dairy': 14,
    'Meat': 5,
    'Produce': 7,
    'Bakery': 3
  };

  /**
   * Calculates optimal distribution for a list of food items
   */
  calculateOptimalDistribution(
    items: FoodItem[],
    historicalData: Record<string, number[]>
  ): number[] {
    // Group items by category
    const categoryGroups = this.groupItemsByCategory(items);

    // Calculate category-level distribution
    const categoryDemands = Object.entries(categoryGroups).map(([category, items]) => ({
      category,
      probability: this.getCategoryFactor(category),
      historicalDemand: historicalData[category] || [10]
    }));

    const categoryDistribution = this.calculateMultinomialDemand(categoryDemands);

    // Calculate item-level distribution
    return items.map(item => {
      const categoryIndex = categoryDemands.findIndex(c => c.category === item.category);
      const categoryTotal = categoryDistribution[categoryIndex];
      const itemCount = categoryGroups[item.category].length;
      
      const baseAmount = Math.floor(categoryTotal / itemCount);
      const pickupRate = this.calculateBetaPickupRate(80, 20);
      const shelfLifeProb = this.calculateShelfLifeProbability(item);

      const calculatedAmount = Math.floor(baseAmount * pickupRate * shelfLifeProb);
      return Math.min(item.quantity, Math.max(1, calculatedAmount));
    });
  }

  /**
   * Calculates expected waste for a given distribution
   */
  calculateExpectedWaste(
    quantity: number, 
    utilizationRate: number, 
    distributionRatio: number
  ): number {
    return quantity * (1 - utilizationRate * distributionRatio);
  }

  /**
   * Calculates confidence score based on multiple factors
   */
  calculateConfidenceScore(item: FoodItem): number {
    const daysUntilExpiry = this.getDaysUntilExpiry(item);
    const categoryReliability = this.getCategoryFactor(item.category);
    const maxShelfLife = this.getMaxShelfLife(item.category);
    
    // Calculate individual factors
    const shelfLifeConfidence = Math.max(0.3, Math.min(1, daysUntilExpiry / maxShelfLife));
    const quantityFactor = Math.min(1, Math.max(0.4, 1 - Math.abs(50 - item.quantity) / 100));
    const urgencyFactor = Math.max(0.4, 1 - (daysUntilExpiry / maxShelfLife));
    
    // Weighted average
    return (
      categoryReliability * 0.3 +
      shelfLifeConfidence * 0.3 +
      quantityFactor * 0.2 +
      urgencyFactor * 0.2
    );
  }

  private calculateMultinomialDemand(categories: CategoryDemand[]): number[] {
    // Calculate the average demand for each category
    const categoryAvgs = categories.map(cat => {
        const categoryAvg = cat.historicalDemand.reduce((a, b) => a + b, 0) / cat.historicalDemand.length;
        return categoryAvg;
    });

    // Calculate the total average demand across all categories
    const totalAvgDemand = categoryAvgs.reduce((sum, avg) => sum + avg, 0);

    // Calculate probabilities for each category
    const probabilities = categoryAvgs.map(avg => avg / totalAvgDemand);

    // Total quantity to distribute
    const n = Math.round(totalAvgDemand);

    // Allocate demands using standard multinomial expectations
    const result = probabilities.map(p => Math.round(n * p));

    // Adjust for rounding errors to ensure total sums to n
    const totalAllocated = result.reduce((sum, count) => sum + count, 0);
    let difference = n - totalAllocated;

    // Adjust counts to correct the total
    for (let i = 0; difference !== 0 && i < result.length; i++) {
        if (difference > 0) {
            result[i]++;
            difference--;
        } else if (difference < 0 && result[i] > 0) {
            result[i]--;
            difference++;
        }
    }

    return result;
}


  private calculateBetaPickupRate(successes: number, failures: number): number {
    const alpha = successes + 1;
    const beta = failures + 1;
    return alpha / (alpha + beta);
  }

  private calculateShelfLifeProbability(item: FoodItem): number {
    const daysUntilExpiry = this.getDaysUntilExpiry(item);
    const maxShelfLife = this.getMaxShelfLife(item.category);
    return Math.max(0, Math.min(1, daysUntilExpiry / maxShelfLife));
  }

  private getDaysUntilExpiry(item: FoodItem): number {
    return Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  private getMaxShelfLife(category: string): number {
    return this.shelfLives[category] || 7;
  }

  private getCategoryFactor(category: string): number {
    return this.categoryFactors[category] || 0.5;
  }

  private groupItemsByCategory(items: FoodItem[]): { [key: string]: FoodItem[] } {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as { [key: string]: FoodItem[] });
  }
} 