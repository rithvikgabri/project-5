import React from 'react';
import { TrendingUp, AlertTriangle, Clock, Package } from 'lucide-react';
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
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-label">
            <Package className="w-4 h-4" />
            Total Items
          </div>
          <div className="stats-value">
            {formatValue(totalItems)}
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-label">
            <TrendingUp className="w-4 h-4" />
            Distribution
          </div>
          <div className="stats-value">
            {formatValue(result.recommendedDistribution)}
            <span className="text-sm text-green-500">↑</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-label">
            <AlertTriangle className="w-4 h-4" />
            Expected Waste
          </div>
          <div className="stats-value">
            {formatValue(result.expectedWaste)} units
            <span className="text-sm text-red-500">↓</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-label">
            <Clock className="w-4 h-4" />
            Confidence
          </div>
          <div className="stats-value">
            {(result.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}