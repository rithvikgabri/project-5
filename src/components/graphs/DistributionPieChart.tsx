import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FoodItem } from '../../types';
import { CHART_COLORS } from '../../utils/constants';

interface DistributionPieChartProps {
  items: FoodItem[];
  optimizedDistribution: number[];
}

export default function DistributionPieChart({ items, optimizedDistribution }: DistributionPieChartProps) {
  const data = items.map((item, index) => ({
    id: item.id,
    name: item.name,
    value: optimizedDistribution[index],
  }));

  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 min-h-[250px]">
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
      <div className="mt-4 flex flex-col space-y-2 max-h-[120px] overflow-y-auto px-2">
        {data.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2 text-sm">
            <div
              className="w-3 h-3 flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="min-w-[150px]">{item.name}: {item.value} units</span>
          </div>
        ))}
      </div>
    </div>
  );
}