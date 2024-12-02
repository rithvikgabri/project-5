import React from 'react';
import { TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  const displayValue = typeof value === 'number' ? value.toString() : value;
  
  return (
    <div className="retro-stats-card">
      <div className="flex items-center space-x-2">
        {icon && <div className="w-5 h-5">{icon}</div>}
        <div>
          <div className="retro-stats-label">{title}</div>
          <div className="retro-stats-value flex items-center space-x-1">
            <span>{displayValue}</span>
            {trend && (
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}