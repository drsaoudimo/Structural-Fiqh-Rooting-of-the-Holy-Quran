import React from 'react';
import { Lightbulb, ArrowLeft } from 'lucide-react';

interface DeductionCardProps {
  text: string;
  dominant: string;
}

export const DeductionCard: React.FC<DeductionCardProps> = ({ text, dominant }) => {
  return (
    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
      <div className="flex items-center gap-2 mb-3 text-emerald-900">
        <Lightbulb className="w-5 h-5 text-gold-500" />
        <h3 className="font-bold text-lg">الاستنتاج المنطقي (Logical Inference)</h3>
      </div>
      
      <p className="text-emerald-950 leading-relaxed font-medium">
        {text}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100/50 p-2 rounded w-fit">
        <span>المتغير المهيمن (Dominant Θ):</span>
        <span className="font-bold">{dominant}</span>
        <ArrowLeft className="w-4 h-4" />
      </div>
    </div>
  );
};