'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PriorityData {
  name: string;
  value: number;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];
const LABELS: Record<string, string> = {
  urgent: 'Urgente',
  important: 'Importante',
  normal: 'Normal'
};

export default function PriorityChart({ data }: { data: PriorityData[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${LABELS[name] || name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Demandas']}
            labelFormatter={(name) => LABELS[name] || name}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}