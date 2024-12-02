import React from 'react';
import { TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { OptimizationResult } from '../types';

interface OptimizationDisplayProps {
  result: OptimizationResult;
}

export default function OptimizationDisplay({ result }: OptimizationDisplayProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2" />
        Results
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between border-2 border-[#2d2d2d] p-3">
          <span>Distribution:</span>
          <span className="font-bold">{result.recommendedDistribution} units</span>
        </div>
        <div className="flex items-center justify-between border-2 border-[#2d2d2d] p-3">
          <span>Expected Waste:</span>
          <span className="font-bold">{result.expectedWaste.toFixed(2)} units</span>
        </div>
        <div className="flex items-center justify-between border-2 border-[#2d2d2d] p-3">
          <span>Confidence:</span>
          <span className="font-bold">{(result.confidenceScore * 100).toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between border-2 border-[#2d2d2d] p-3">
          <span>Urgency:</span>
          <span className="font-bold flex items-center">
            {result.urgencyLevel === 'high' && <AlertTriangle className="w-4 h-4 mr-1" />}
            {result.urgencyLevel === 'medium' && <Clock className="w-4 h-4 mr-1" />}
            {result.urgencyLevel.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}