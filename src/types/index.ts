export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  shelfLife: number;
  expiryDate: Date;
  category: 'perishable' | 'non-perishable';
  temperature: 'room' | 'refrigerated' | 'frozen';
}

export interface OptimizationResult {
  recommendedDistribution: number;
  expectedWaste: number;
  confidenceScore: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}