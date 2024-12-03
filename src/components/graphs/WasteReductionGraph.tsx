import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { FoodItem } from '../../types';
import { CHART_STYLES } from '../../utils/constants';

interface WasteReductionGraphProps {
  items: FoodItem[];
  optimizedDistribution: number[];
}

export default function WasteReductionGraph({ items, optimizedDistribution }: WasteReductionGraphProps) {
  const data = items.map((item, index) => {
    const originalWaste = item.quantity;
    const optimizedWaste = Math.max(0, item.quantity - optimizedDistribution[index]);
    const date = format(item.expiryDate, 'MMM dd');
    
    return {
      id: item.id,
      name: item.name,
      date,
      originalWaste,
      optimizedWaste,
      reduction: originalWaste - optimizedWaste,
    };
  });

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis 
            dataKey="date" 
            stroke="#2d2d2d"
            tick={{ fill: '#2d2d2d' }}
          />
          <YAxis 
            stroke="#2d2d2d"
            tick={{ fill: '#2d2d2d' }}
          />
          <Tooltip contentStyle={CHART_STYLES.tooltip} />
          <Area
            type="monotone"
            dataKey="originalWaste"
            stroke="#2d2d2d"
            fill="#2d2d2d"
            fillOpacity={0.3}
            name="Original Waste"
          />
          <Area
            type="monotone"
            dataKey="optimizedWaste"
            stroke="#2d2d2d"
            fill="#2d2d2d"
            fillOpacity={0.7}
            name="Optimized Waste"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}