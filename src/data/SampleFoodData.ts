import { FoodItem, FoodCategory } from '../types/FoodTypes';
import { addDays } from 'date-fns';

export const sampleFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Whole Milk',
    quantity: 25,
    expiryDate: addDays(new Date(), 7),
    category: 'Dairy',
    humidity: 85
  },
  {
    id: '2',
    name: 'Fresh Bread',
    quantity: 30,
    expiryDate: addDays(new Date(), 3),
    category: 'Bakery',
    humidity: 60
  },
  {
    id: '3',
    name: 'Fresh Apples',
    quantity: 50,
    expiryDate: addDays(new Date(), 14),
    category: 'Produce',
    humidity: 90
  },
  {
    id: '4',
    name: 'Chicken Breast',
    quantity: 15,
    expiryDate: addDays(new Date(), 4),
    category: 'Meat',
    humidity: 82
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    quantity: 20,
    expiryDate: addDays(new Date(), 10),
    category: 'Dairy',
    humidity: 85
  },
  {
    id: '6',
    name: 'Fresh Spinach',
    quantity: 35,
    expiryDate: addDays(new Date(), 5),
    category: 'Produce',
    humidity: 95
  },
  {
    id: '7',
    name: 'Ground Beef',
    quantity: 18,
    expiryDate: addDays(new Date(), 3),
    category: 'Meat',
    humidity: 82
  },
  {
    id: '8',
    name: 'Croissants',
    quantity: 40,
    expiryDate: addDays(new Date(), 2),
    category: 'Bakery',
    humidity: 60
  },
  {
    id: '9',
    name: 'Cheddar Cheese',
    quantity: 22,
    expiryDate: addDays(new Date(), 21),
    category: 'Dairy',
    humidity: 85
  },
  {
    id: '10',
    name: 'Fresh Tomatoes',
    quantity: 45,
    expiryDate: addDays(new Date(), 7),
    category: 'Produce',
    humidity: 90
  }
];

// Helper function to get a random item from the sample data
export function getRandomSampleItem(): FoodItem {
  const randomIndex = Math.floor(Math.random() * sampleFoodItems.length);
  return { ...sampleFoodItems[randomIndex], id: crypto.randomUUID() };
}

// Helper function to get items by category
export function getSampleItemsByCategory(category: string): FoodItem[] {
  return sampleFoodItems.filter(item => item.category === category);
}

// Helper function to get a specific number of random items
export function getRandomSampleItems(count: number): FoodItem[] {
  const shuffled = [...sampleFoodItems]
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(item => ({ ...item, id: crypto.randomUUID() }));
  return shuffled;
}

// Export default function for backward compatibility
export function generateSampleFoodData(): FoodItem[] {
  return getRandomSampleItems(3); // Returns 3 random items by default
}

// Add these preset combinations to your SampleFoodData.ts

// High confidence combination (0.9+ confidence score)
export function getHighConfidenceSample(): FoodItem[] {
  return [
    {
      id: '1',
      name: 'Whole Milk',
      quantity: 25,
      expiryDate: addDays(new Date(), 7),
      category: 'Dairy',
      humidity: 85
    },
    {
      id: '2',
      name: 'Cheddar Cheese',
      quantity: 22,
      expiryDate: addDays(new Date(), 21),
      category: 'Dairy',
      humidity: 85
    }
  ];
}

// Medium confidence combination (0.5-0.7 confidence score)
export function getMediumConfidenceSample(): FoodItem[] {
  return [
    {
      id: '3',
      name: 'Fresh Bread',
      quantity: 30,
      expiryDate: addDays(new Date(), 3),
      category: 'Bakery',
      humidity: 60
    },
    {
      id: '4',
      name: 'Fresh Spinach',
      quantity: 35,
      expiryDate: addDays(new Date(), 5),
      category: 'Produce',
      humidity: 95
    }
  ];
}

// Low confidence combination (0.3-0.5 confidence score)
export function getLowConfidenceSample(): FoodItem[] {
  return [
    {
      id: '5',
      name: 'Fresh Tomatoes',
      quantity: 45,
      expiryDate: addDays(new Date(), 7),
      category: 'Produce',
      humidity: 90
    },
    {
      id: '6',
      name: 'Ground Beef',
      quantity: 18,
      expiryDate: addDays(new Date(), 3),
      category: 'Meat',
      humidity: 82
    },
    {
      id: '7',
      name: 'Croissants',
      quantity: 40,
      expiryDate: addDays(new Date(), 2),
      category: 'Bakery',
      humidity: 60
    }
  ];
} 