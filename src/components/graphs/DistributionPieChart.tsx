import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FoodItem } from '../../types';
import { CHART_COLORS } from '../../utils/constants';
import PieChartLegend from './PieChartLegend';

interface DistributionPieChartProps {
  items: FoodItem[];
  optimizedDistribution: number[];
}

export default function DistributionPieChart({ items, optimizedDistribution }: DistributionPieChartProps) {
  const data = items.map((item, index) => ({
    id: item.id, // Use the unique item ID for keys
    name: item.name,
    value: optimizedDistribution[index],
  }));

  return (
    <div className="retro-card p-6">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Distribution Breakdown</h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.id}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#f3ede3',
                border: '2px solid #2d2d2d',
                borderRadius: '0px',
                fontFamily: 'IBM Plex Mono'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieChartLegend data={data} />
    </div>
  );
}