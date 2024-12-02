import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import FoodItemForm from './components/FoodItemForm';
import OptimizationDisplay from './components/OptimizationDisplay';
import DistributionChart from './components/DistributionChart';
import WasteReductionGraph from './components/graphs/WasteReductionGraph';
import DistributionPieChart from './components/graphs/DistributionPieChart';
import StatsGrid from './components/stats/StatsGrid';
import { FoodItem, OptimizationResult } from './types';
import {
  calculatePoissonProbability,
  calculatePickupProbability,
  calculateShelfLifeProbability,
  calculateExpectedWaste,
  calculateOptimalDistribution
} from './utils/probabilityCalculations';
import { addDays } from 'date-fns';
import { getHighConfidenceSample, getMediumConfidenceSample, getLowConfidenceSample } from './data/SampleFoodData';
import { ProbabilityParameters } from './types/ProbabilityTypes';

interface ProbabilityNotification {
  item: string;
  params: ProbabilityParameters;
  timestamp: number;
}

function App() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => getLowConfidenceSample());
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [optimizedDistribution, setOptimizedDistribution] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<ProbabilityNotification[]>([]);

  const generateProbabilityParams = (category: string): ProbabilityParameters => {
    // Generate random parameters based on category
    const baseParams = {
      averageDailyDemand: Math.floor(Math.random() * 20) + 10, // 10-30
      historicalPickups: Math.floor(Math.random() * 50) + 50,   // 50-100
      totalEvents: 100,
      categoryDemandRate: 0,
      pickupSuccessRate: 0,
      category: category
    };

    // Adjust rates based on category
    switch (category) {
      case 'Meat':
        baseParams.categoryDemandRate = 0.7 + Math.random() * 0.2; // 0.7-0.9
        baseParams.pickupSuccessRate = 0.8 + Math.random() * 0.15; // 0.8-0.95
        break;
      case 'Dairy':
        baseParams.categoryDemandRate = 0.6 + Math.random() * 0.2; // 0.6-0.8
        baseParams.pickupSuccessRate = 0.7 + Math.random() * 0.2;  // 0.7-0.9
        break;
      case 'Produce':
        baseParams.categoryDemandRate = 0.5 + Math.random() * 0.3; // 0.5-0.8
        baseParams.pickupSuccessRate = 0.6 + Math.random() * 0.2;  // 0.6-0.8
        break;
      case 'Bakery':
        baseParams.categoryDemandRate = 0.4 + Math.random() * 0.4; // 0.4-0.8
        baseParams.pickupSuccessRate = 0.5 + Math.random() * 0.3;  // 0.5-0.8
        break;
      default:
        baseParams.categoryDemandRate = 0.5 + Math.random() * 0.3; // 0.5-0.8
        baseParams.pickupSuccessRate = 0.6 + Math.random() * 0.2;  // 0.6-0.8
    }

    return baseParams;
  };

  const handleAddItem = (item: FoodItem) => {
    const params = generateProbabilityParams(item.category);
    
    // Add notification
    setNotifications(prev => [{
      item: item.name,
      params,
      timestamp: Date.now()
    }, ...prev].slice(0, 5)); // Last 5 notifications

    setFoodItems(prev => [...prev, item]);
    optimizeDistribution([...foodItems, item], params);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = foodItems.filter(item => item.id !== id);
    setFoodItems(updatedItems);
    if (updatedItems.length > 0) {
      optimizeDistribution(updatedItems);
    } else {
      setOptimizationResult(null);
      setOptimizedDistribution([]);
    }
  };

  const optimizeDistribution = (items: FoodItem[], lastParams?: ProbabilityParameters) => {
    if (items.length === 0) return;

    // Example historical data - in real app, this would come from a database
    const historicalData = {
      'Meat': [15, 18, 20, 17, 16],
      'Dairy': [25, 22, 20, 23, 24],
      'Produce': [30, 28, 25, 27, 29],
      'Bakery': [40, 35, 38, 42, 37]
    };

    const distribution = calculateOptimalDistribution(items, historicalData);

    const totalWaste = items.reduce((acc, item, index) => {
      return acc + calculateExpectedWaste(item.quantity, 0.8, distribution[index] / item.quantity);
    }, 0);

    const urgency = totalWaste > 20 ? 'high' : totalWaste > 10 ? 'medium' : 'low';
    
    setOptimizedDistribution(distribution);
    setOptimizationResult({
      recommendedDistribution: Math.floor(distribution.reduce((a, b) => a + b, 0)),
      expectedWaste: Number(totalWaste.toFixed(1)),
      confidenceScore: 0.85,
      urgencyLevel: urgency
    });
  };

  React.useEffect(() => {
    if (foodItems.length > 0) {
      optimizeDistribution(foodItems);
    }
  }, []);

  // Add this component inside your JSX to display notifications
  const NotificationPanel = () => (
    <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
      {notifications.map((notif, index) => (
        <div 
          key={notif.timestamp} 
          className="retro-card p-4 text-sm animate-fade-in"
        >
          <h4 className="font-bold">{notif.item} ({notif.params.category}) - Generated Parameters:</h4>
          <ul className="mt-2 space-y-1">
            <li>Daily Demand: {notif.params.averageDailyDemand} units</li>
            <li>Historical Success: {notif.params.historicalPickups}/{notif.params.totalEvents}</li>
            <li>Category Demand Rate: {(notif.params.categoryDemandRate * 100).toFixed(1)}%</li>
            <li>Pickup Success Rate: {(notif.params.pickupSuccessRate * 100).toFixed(1)}%</li>
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen retro-container">
      <header className="border-b-2 border-[#2d2d2d] sticky top-0 bg-[#f3ede3] z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center space-x-4">
            <Utensils className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">FOODIE - for food distribution centers</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Top Section - Form and Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Add Food Item */}
          <div className="retro-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Add Food Item</h2>
            <FoodItemForm onSubmit={handleAddItem} />
          </div>
          
          {/* Waste Reduction Impact */}
          <div className="retro-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Waste Reduction Impact</h2>
            {foodItems.length > 0 && optimizedDistribution.length > 0 ? (
              <WasteReductionGraph
                items={foodItems}
                optimizedDistribution={optimizedDistribution}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-gray-500">Add items to see waste reduction impact</p>
              </div>
            )}
          </div>

          {/* Distribution Breakdown */}
          <div className="retro-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Distribution Breakdown</h2>
            {foodItems.length > 0 && optimizedDistribution.length > 0 ? (
              <DistributionPieChart
                items={foodItems}
                optimizedDistribution={optimizedDistribution}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-gray-500">Add items to see distribution breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Distribution List */}
        {foodItems.length > 0 && (
          <div className="retro-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Distribution</h2>
            <DistributionChart
              items={foodItems}
              optimizedDistribution={optimizedDistribution}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        )}

        {/* Bottom Section - Stats and Results */}
        {optimizationResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="retro-card p-4 sm:p-6">
              <StatsGrid result={optimizationResult} totalItems={foodItems.length} />
            </div>
            <div className="retro-card p-4 sm:p-6 md:col-span-2">
              <OptimizationDisplay result={optimizationResult} />
            </div>
          </div>
        )}
      </main>

      <NotificationPanel />
    </div>
  );
}

export default App;