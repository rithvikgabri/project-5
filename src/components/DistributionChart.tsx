import React from 'react';
import { Trash2 } from 'lucide-react';
import { FoodItem } from '../types';

interface DistributionChartProps {
  items: FoodItem[];
  optimizedDistribution: number[];
  onDeleteItem: (id: string) => void;
}

export default function DistributionChart({ 
  items, 
  optimizedDistribution, 
  onDeleteItem 
}: DistributionChartProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.name}</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {optimizedDistribution[index]} / {item.quantity}
              </span>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-[#2d2d2d] hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-4 border-2 border-[#2d2d2d] overflow-hidden">
            <div
              className="h-full bg-[#2d2d2d] transition-all duration-500"
              style={{
                width: `${(optimizedDistribution[index] / item.quantity) * 100}%`
              }}
            />
          </div>
          <div className="text-sm">
            Expires in {Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
          </div>
        </div>
      ))}
    </div>
  );
}