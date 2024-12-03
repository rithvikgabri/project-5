import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import FoodItemForm from './components/FoodItemForm';
import OptimizationDisplay from './components/OptimizationDisplay';
import DistributionChart from './components/DistributionChart';
import WasteReductionGraph from './components/graphs/WasteReductionGraph';
import DistributionPieChart from './components/graphs/DistributionPieChart';
import StatsGrid from './components/stats/StatsGrid';
import { FoodItem, OptimizationResult } from './types';
import { ProbabilityService } from './services/ProbabilityService';
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
    // Use historical data to generate parameters
    const historicalData = {
      'Meat': { pickupSuccesses: 85, demandSuccesses: 80, trials: 100, demand: [15, 18, 20, 17, 16] },
      'Dairy': { pickupSuccesses: 75, demandSuccesses: 70, trials: 100, demand: [25, 22, 20, 23, 24] },
      'Produce': { pickupSuccesses: 65, demandSuccesses: 60, trials: 100, demand: [30, 28, 25, 27, 29] },
      'Bakery': { pickupSuccesses: 55, demandSuccesses: 50, trials: 100, demand: [40, 35, 38, 42, 37] }
    };

    const categoryData = historicalData[category as keyof typeof historicalData] || historicalData['Produce'];
    const probabilityService = new ProbabilityService();
    
    return {
      averageDailyDemand: Math.round(categoryData.demand.reduce((a: number, b: number) => a + b, 0) / categoryData.demand.length),
      historicalPickups: categoryData.pickupSuccesses,
      totalEvents: categoryData.trials,
      // Category demand rate based on historical demand success
      categoryDemandRate: categoryData.demandSuccesses / categoryData.trials,
      // Pickup success rate based on historical pickup success
      pickupSuccessRate: categoryData.pickupSuccesses / categoryData.trials,
      category: category
    };
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

    const probabilityService = new ProbabilityService();
    const historicalData = {
      'Meat': [15, 18, 20, 17, 16],
      'Dairy': [25, 22, 20, 23, 24],
      'Produce': [30, 28, 25, 27, 29],
      'Bakery': [40, 35, 38, 42, 37]
    };

    // Calculate optimal distribution using multinomial distribution
    const distribution = probabilityService.calculateOptimalDistribution(items, historicalData);
    
    // Calculate daily distribution for each item
    const dailyDistributions = items.map((item, index) => {
      const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // If expiring today or tomorrow, distribute all remaining
      if (daysUntilExpiry <= 1) {
        return distribution[index];
      }
      
      // Otherwise distribute based on daily demand and days left
      return Math.ceil(distribution[index] / Math.max(1, daysUntilExpiry));
    });

    const totalDailyDistribution = dailyDistributions.reduce((acc, val) => acc + val, 0);
    
    // Calculate expected waste using beta distribution for success rates
    const expectedWaste = items.reduce((acc, item, index) => {
      const params = generateProbabilityParams(item.category);
      const wasteRate = 1 - (params.pickupSuccessRate * params.categoryDemandRate);
      return acc + (dailyDistributions[index] * wasteRate);
    }, 0);

    // Calculate average confidence across all items
    const avgConfidence = items.reduce((sum, item) => {
      return sum + probabilityService.calculateConfidenceScore(item);
    }, 0) / items.length;

    // Calculate urgency based on closest expiry date
    const closestExpiryDays = Math.min(...items.map(item => 
      Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    ));
    const urgency = closestExpiryDays <= 2 ? 'high' : closestExpiryDays <= 5 ? 'medium' : 'low';
    
    setOptimizedDistribution(dailyDistributions);
    setOptimizationResult({
      recommendedDistribution: totalDailyDistribution,
      expectedWaste: Number(expectedWaste.toFixed(1)),
      confidenceScore: Number(avgConfidence.toFixed(1)),
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

  // Add this sorting function before rendering
  const sortedData = [...foodItems].sort((a, b) => {
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

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
                items={sortedData}
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
                items={sortedData}
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
              items={sortedData}
              optimizedDistribution={optimizedDistribution}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        )}

        {/* Stats and Results */}
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