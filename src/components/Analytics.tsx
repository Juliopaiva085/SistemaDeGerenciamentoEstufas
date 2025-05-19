import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Seed } from '../types/greenhouse';

interface Props {
  seeds: Seed[];
}

export const Analytics: React.FC<Props> = ({ seeds }) => {
  const seedStats = seeds.reduce((acc, seed) => {
    if (!acc[seed.name]) {
      acc[seed.name] = {
        name: seed.name,
        count: 0,
        successRate: 0,
        totalProfit: 0,
      };
    }
    acc[seed.name].count++;
    acc[seed.name].successRate += seed.germinationSuccess;
    acc[seed.name].totalProfit += seed.profit;
    return acc;
  }, {} as Record<string, { name: string; count: number; successRate: number; totalProfit: number; }>);

  const chartData = Object.values(seedStats).map(stat => ({
    ...stat,
    successRate: (stat.successRate / stat.count).toFixed(2),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Estatísticas de Uso de Sementes</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Quantidade Utilizada" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Análise de Lucro</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalProfit" stroke="#82ca9d" name="Lucro Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};