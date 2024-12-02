import React from 'react';
import { TrendingUp, AlertTriangle, Clock, Package } from 'lucide-react';
import StatsCard from './StatsCard';
import { OptimizationResult } from '../../types';

interface StatsGridProps {
  result: OptimizationResult;
  totalItems: number;
}

export default function StatsGrid({ result, totalItems }: StatsGridProps) {
  const formatValue = (value: number): string => {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Current Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          title="Total Items"
          value={formatValue(totalItems)}
          icon={<Package className="w-4 h-4" />}
        />
        <StatsCard
          title="Distribution"
          value={formatValue(result.recommendedDistribution)}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="up"
        />
        <StatsCard
          title="Expected Waste"
          value={`${formatValue(result.expectedWaste)} units`}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="down"
        />
        <StatsCard
          title="Confidence"
          value={`${(result.confidenceScore * 100).toFixed(0)}%`}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}