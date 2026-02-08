import React from 'react';
import { Scroll, Feather } from 'lucide-react';

interface ReligiousArticleProps {
  article: string;
}

export const ReligiousArticle: React.FC<ReligiousArticleProps> = ({ article }) => {
  return (
    <div className="bg-[#fdfbf7] rounded-xl border-2 border-gold-400/30 p-8 shadow-md relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Scroll size={120} />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-gold-200 pb-4">
        <div className="bg-gold-100 p-2 rounded-full text-gold-600">
          <Feather className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-emerald-950">التأصيل الفقهي والبنيوي</h3>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p className="font-serif text-xl leading-10 text-slate-800 text-justify">
          {article}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <span className="text-xs text-gold-600 font-medium bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
           مستنبط عبر خوارزميات الميزان
        </span>
      </div>
    </div>
  );
};