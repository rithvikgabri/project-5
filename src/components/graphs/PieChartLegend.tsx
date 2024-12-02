import React from 'react';
import { CHART_COLORS } from '../../utils/constants';

interface LegendItem {
  id: string;
  name: string;
  value: number;
}

interface PieChartLegendProps {
  data: LegendItem[];
}

export default function PieChartLegend({ data }: PieChartLegendProps) {
  return (
    <div className="mt-4 space-y-2">
      {data.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <div
            className="w-4 h-4"
            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
          />
          <span className="text-sm">{item.name}: {item.value} units</span>
        </div>
      ))}
    </div>
  );
}