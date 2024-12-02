import { FoodItem } from '../types';

export class ProbabilityService {
  /**
   * Calculates the probability of a specific demand level for a food item
   */
  calculateDemandProbability(item: FoodItem, demandLevel: number): number {
    // Base probability on category and quantity
    const categoryFactor = this.getCategoryFactor(item.category);
    const quantityFactor = Math.min(1, item.quantity / 100);
    return (categoryFactor + quantityFactor) / 2;
  }

  /**
   * Calculates pickup success probability based on historical data
   */
  calculatePickupProbability(item: FoodItem): number {
    // Base probability on category and expiry date
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const expiryFactor = Math.max(0, Math.min(1, daysUntilExpiry / 14)); // 14 days max
    return expiryFactor * this.getCategoryFactor(item.category);
  }

  /**
   * Calculates confidence score based on data quality
   */
  calculateConfidenceScore(item: FoodItem): number {
    const demandConfidence = this.calculateDemandConfidence(item);
    const pickupConfidence = this.calculatePickupConfidence(item);
    return (demandConfidence + pickupConfidence) / 2;
  }

  private getCategoryFactor(category: string): number {
    const factors: { [key: string]: number } = {
      'Dairy': 0.85,
      'Meat': 0.75,
      'Produce': 0.70,
      'Bakery': 0.65
    };
    return factors[category] || 0.5;
  }

  private calculateDemandConfidence(item: FoodItem): number {
    // Base confidence on category reliability
    return this.getCategoryFactor(item.category);
  }

  private calculatePickupConfidence(item: FoodItem): number {
    // Base confidence on expiry timeline
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0.2, Math.min(1, daysUntilExpiry / 14)); // 14 days max
  }
} 