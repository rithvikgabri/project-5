import { FoodItem } from '../types';
import { addDays } from 'date-fns';

/**
 * High Confidence Sample (0.9+ confidence score)
 * Characteristics:
 * - Items from same category (Dairy) for consistent demand patterns
 * - Moderate quantities (20-25 units) that are easier to distribute
 * - Longer shelf life (7-21 days) allowing flexible distribution
 * - Historical data shows stable demand for these items
 */
export function getHighConfidenceSample(): FoodItem[] {
  return [
    {
      id: '1',
      name: 'Whole Milk',
      quantity: 25,
      expiryDate: addDays(new Date(), 7),
      category: 'Dairy'
    },
    {
      id: '2',
      name: 'Cheddar Cheese',
      quantity: 22,
      expiryDate: addDays(new Date(), 21),
      category: 'Dairy'
    }
  ];
}

/**
 * Medium Confidence Sample (0.5-0.7 confidence score)
 * Characteristics:
 * - Mixed categories (Bakery, Produce) with different demand patterns
 * - Varied quantities (30-35 units) requiring more complex distribution
 * - Shorter shelf life (3-5 days) making timing more critical
 * - Less consistent historical demand data
 */
export function getMediumConfidenceSample(): FoodItem[] {
  return [
    {
      id: '3',
      name: 'Fresh Bread',
      quantity: 30,
      expiryDate: addDays(new Date(), 3),
      category: 'Bakery'
    },
    {
      id: '4',
      name: 'Fresh Spinach',
      quantity: 35,
      expiryDate: addDays(new Date(), 5),
      category: 'Produce'
    }
  ];
}

/**
 * Low Confidence Sample (0.3-0.5 confidence score)
 * Characteristics:
 * - Diverse categories with complex interactions
 * - Large quantity variations (18-45 units)
 * - Very short shelf life (2-7 days)
 * - Limited or volatile historical data
 * - Multiple items competing for same distribution channels
 */
export function getLowConfidenceSample(): FoodItem[] {
  return [
    {
      id: '5',
      name: 'Fresh Tomatoes',
      quantity: 45,
      expiryDate: addDays(new Date(), 7),
      category: 'Produce'
    },
    {
      id: '6',
      name: 'Ground Beef',
      quantity: 18,
      expiryDate: addDays(new Date(), 3),
      category: 'Meat'
    },
    {
      id: '7',
      name: 'Croissants',
      quantity: 40,
      expiryDate: addDays(new Date(), 2),
      category: 'Bakery'
    }
  ];
} 