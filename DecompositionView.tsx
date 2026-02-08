import React from 'react';
import { Layers } from 'lucide-react';

interface DecompositionViewProps {
  items: string[];
}

export const DecompositionView: React.FC<DecompositionViewProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <div className="flex items-center gap-2 mb-4 text-emerald-800">
        <Layers className="w-5 h-5" />
        <h3 className="font-bold text-lg">التجزئة البنيوية (Decomposition)</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-700 font-serif text-lg">
            {item}
          </div>
        ))}
      </div>
       <p className="text-xs text-slate-400 mt-4">
        العناصر الأساسية المستخرجة (Δ) من الكائن النصي (V)
      </p>
    </div>
  );
};