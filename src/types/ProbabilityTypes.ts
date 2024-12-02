export interface ProbabilityParameters {
  averageDailyDemand: number;
  historicalPickups: number;
  totalEvents: number;
  categoryDemandRate: number;
  pickupSuccessRate: number;
  category: string;
} 