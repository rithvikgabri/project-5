/**
 * Calculates Poisson probability for discrete events
 */
export function poissonProbability(mean: number, k: number): number {
  const e = Math.E;
  const factorial = (n: number): number => 
    n <= 1 ? 1 : n * factorial(n - 1);
    
  return (Math.pow(e, -mean) * Math.pow(mean, k)) / factorial(k);
}

/**
 * Calculates binomial probability based on success/failure history
 */
export function binomialProbability(successes: number, trials: number): number {
  if (trials === 0) return 0;
  return successes / trials;
}

/**
 * Calculates confidence interval for a given sample
 */
export function calculateConfidenceInterval(
  mean: number, 
  stdDev: number, 
  sampleSize: number, 
  confidenceLevel: number = 0.95
): { lower: number; upper: number } {
  const zScore = 1.96; // 95% confidence level
  const margin = zScore * (stdDev / Math.sqrt(sampleSize));
  
  return {
    lower: mean - margin,
    upper: mean + margin
  };
} 