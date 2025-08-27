'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EvolutionData {
  date: string;
  count: number;
}

export default function EvolutionChart({ data }: { data: EvolutionData[] }) {
  // Formatar as datas para exibição
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: item.date.split('-')[1] + '/' + item.date.split('-')[0].slice(2)
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [value, 'Demandas']}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Demandas"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}