import React from 'react';
import { Calculator } from 'lucide-react';

interface EquationViewerProps {
  equation: string;
}

export const EquationViewer: React.FC<EquationViewerProps> = ({ equation }) => {
  // Simple parser to style the equation parts
  // Example: V = 0.6 * Iman + 0.9 * Sabr
  
  const parts = equation.split(/([=+\*])/g);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 my-6 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4 text-emerald-800">
        <Calculator className="w-5 h-5" />
        <h3 className="font-bold text-lg">المعادلة القرآنية (Q-Equation)</h3>
      </div>
      
      <div className="flex items-center justify-center text-2xl md:text-3xl font-serif text-slate-800 py-4" dir="ltr">
        {parts.map((part, index) => {
          const trimmed = part.trim();
          if (trimmed === '=' || trimmed === '+') {
            return <span key={index} className="mx-3 text-gold-500 font-bold">{trimmed}</span>;
          }
          if (trimmed === '*') {
            return <span key={index} className="mx-1 text-slate-400 text-sm">×</span>;
          }
          if (!isNaN(parseFloat(trimmed))) {
             return <span key={index} className="text-emerald-600 font-mono font-bold">{trimmed}</span>;
          }
          // Assuming text
          return <span key={index} className="italic text-slate-900 math-font">{trimmed}</span>;
        })}
      </div>
      <p className="text-center text-sm text-slate-500 mt-2">
        تمثيل رياضي للعلاقة بين المتغيرات الدلالية في النص
      </p>
    </div>
  );
};