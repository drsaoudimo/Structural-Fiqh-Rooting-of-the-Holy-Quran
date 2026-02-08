import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThemeWeight } from '../types';
import { PieChart } from 'lucide-react';

interface ThemeChartProps {
  data: ThemeWeight[];
}

export const ThemeChart: React.FC<ThemeChartProps> = ({ data }) => {
  const COLORS = ['#059669', '#d97706', '#0891b2', '#7c3aed', '#db2777'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <div className="flex items-center gap-2 mb-6 text-emerald-800">
        <PieChart className="w-5 h-5" />
        <h3 className="font-bold text-lg">توزيع الأوزان الدلالية (Weight Distribution)</h3>
      </div>
      
      <div className="h-64 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 1]} tickCount={6} />
            <YAxis 
              dataKey="theme" 
              type="category" 
              width={100} 
              tick={{ fill: '#334155', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={30}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-center text-slate-400">
        القيم تمثل الكثافة الموضوعية (Density) داخل النص المختار
      </div>
    </div>
  );
};