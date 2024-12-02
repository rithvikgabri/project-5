import { FoodItem } from '../types/FoodTypes';
import { poissonProbability, binomialProbability } from '../utils/StatisticalUtils';

export class ProbabilityService {
  /**
   * Calculates the probability of a specific demand level for a food item
   */
  calculateDemandProbability(item: FoodItem, demandLevel: number): number {
    const { dailyMean } = item.demandStats;
    return poissonProbability(dailyMean, demandLevel);
  }

  /**
   * Calculates pickup success probability based on historical data
   */
  calculatePickupProbability(item: FoodItem): number {
    const { successCount, totalAttempts } = item.pickupStats;
    if (totalAttempts === 0) return 0.5; // Default when no data
    
    return binomialProbability(successCount, totalAttempts);
  }

  /**
   * Calculates remaining shelf life probability considering storage conditions
   */
  calculateShelfLifeProbability(item: FoodItem): number {
    const { baseShelfLife, temperatureRanges, currentCondition } = item.shelfLife;
    
    // Find applicable temperature range
    const range = temperatureRanges.find(r => 
      currentCondition.temperature >= r.min && 
      currentCondition.temperature <= r.max
    );
    
    const spoilageMultiplier = range ? range.spoilageMultiplier : 1;
    const adjustedShelfLife = baseShelfLife / spoilageMultiplier;
    
    return Math.max(0, adjustedShelfLife / baseShelfLife);
  }

  /**
   * Calculates confidence score based on data quality
   */
  calculateConfidenceScore(item: FoodItem): number {
    const demandConfidence = this.calculateDemandConfidence(item);
    const pickupConfidence = this.calculatePickupConfidence(item);
    const seasonalConfidence = this.calculateSeasonalConfidence(item);
    
    return (demandConfidence + pickupConfidence + seasonalConfidence) / 3;
  }

  private calculateDemandConfidence(item: FoodItem): number {
    const { historicalDemand, dailyVariance, dailyMean } = item.demandStats;
    if (historicalDemand.length < 5) return 0.3;
    
    // Higher variance = lower confidence
    const coefficientOfVariation = Math.sqrt(dailyVariance) / dailyMean;
    return Math.max(0.2, 1 - coefficientOfVariation);
  }

  private calculatePickupConfidence(item: FoodItem): number {
    const { totalAttempts } = item.pickupStats;
    // More attempts = higher confidence, max out at 100 attempts
    return Math.min(1, totalAttempts / 100);
  }

  private calculateSeasonalConfidence(item: FoodItem): number {
    const { monthly, weekday } = item.seasonalDemand;
    const variance = this.calculateVariance(monthly.concat(weekday));
    return Math.max(0.2, 1 - variance);
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const squareDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squareDiffs.reduce((a, b) => a + b) / numbers.length;
  }
} 