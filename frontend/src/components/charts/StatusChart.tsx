'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];
const LABELS: Record<string, string> = {
  open: 'Abertas',
  in_progress: 'Em Progresso',
  closed: 'Fechadas'
};

export default function StatusChart({ data }: { data: StatusData[] }) {
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