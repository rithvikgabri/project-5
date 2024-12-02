export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: Date;
  category: string;
}

export interface OptimizationResult {
  recommendedDistribution: number;
  expectedWaste: number;
  confidenceScore: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}