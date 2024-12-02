import { FoodItem } from '../types';

interface Node {
  id: string;
  parents: string[];
  cpt: { [key: string]: number };
}

export class BayesianNetworkService {
  private nodes: Map<string, Node>;

  constructor() {
    this.nodes = new Map();
  }

  // Add a node to the network
  addNode(id: string, parents: string[] = []): void {
    this.nodes.set(id, {
      id,
      parents,
      cpt: {},
    });
  }

  // Set conditional probability for a node
  setConditionalProbability(nodeId: string, condition: string, probability: number): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.cpt[condition] = probability;
    }
  }

  // Calculate probability for food item distribution
  calculateDistributionProbability(item: FoodItem, targetDistribution: number): number {
    // Create nodes for relevant factors
    this.addNode('demand');
    this.addNode('expiry', ['demand']);
    this.addNode('category', ['demand']);
    this.addNode('distribution', ['demand', 'expiry', 'category']);

    // Set base probabilities based on historical data and item properties
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const expiryProbability = this.calculateExpiryProbability(daysUntilExpiry);
    const categoryProbability = this.getCategoryBaseProbability(item.category);
    const demandProbability = this.calculateDemandProbability(targetDistribution, item.quantity);

    // Set conditional probabilities
    this.setConditionalProbability('expiry', 'high', expiryProbability);
    this.setConditionalProbability('category', item.category, categoryProbability);
    this.setConditionalProbability('demand', 'high', demandProbability);

    // Calculate joint probability
    return this.calculateJointProbability(demandProbability, expiryProbability, categoryProbability);
  }

  private calculateExpiryProbability(daysUntilExpiry: number): number {
    const maxShelfLife = 14; // Maximum shelf life in days
    return Math.max(0, Math.min(1, daysUntilExpiry / maxShelfLife));
  }

  private getCategoryBaseProbability(category: string): number {
    const categoryProbabilities: { [key: string]: number } = {
      'Dairy': 0.85,
      'Meat': 0.75,
      'Produce': 0.70,
      'Bakery': 0.65
    };
    return categoryProbabilities[category] || 0.5;
  }

  private calculateDemandProbability(targetDistribution: number, totalQuantity: number): number {
    const ratio = targetDistribution / totalQuantity;
    return Math.max(0, Math.min(1, ratio));
  }

  private calculateJointProbability(
    demandProb: number,
    expiryProb: number,
    categoryProb: number
  ): number {
    // Using simplified joint probability calculation
    return (demandProb * 0.4 + expiryProb * 0.3 + categoryProb * 0.3);
  }

  // Get confidence score based on network probabilities
  getConfidenceScore(item: FoodItem, targetDistribution: number): number {
    const probability = this.calculateDistributionProbability(item, targetDistribution);
    
    // Adjust confidence based on category and expiry
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const expiryFactor = this.calculateExpiryProbability(daysUntilExpiry);
    const categoryFactor = this.getCategoryBaseProbability(item.category);

    // Weighted average of factors
    return (probability * 0.5 + expiryFactor * 0.3 + categoryFactor * 0.2);
  }
} 