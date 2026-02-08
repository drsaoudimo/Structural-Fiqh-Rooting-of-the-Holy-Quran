import React, { useState, useEffect } from 'react';
import { getSurahs, getVersesText } from '../services/quranService';
import { Surah } from '../types';
import { BookOpen, Search, ArrowDown } from 'lucide-react';

interface VerseSelectorProps {
  onTextLoaded: (text: string) => void;
  isLoading: boolean;
}

export const VerseSelector: React.FC<VerseSelectorProps> = ({ onTextLoaded, isLoading }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [startVerse, setStartVerse] = useState<number>(1);
  const [endVerse, setEndVerse] = useState<number>(7);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [fetchingText, setFetchingText] = useState(false);

  useEffect(() => {
    const load = async () => {
      const list = await getSurahs();
      setSurahs(list);
      setLoadingSurahs(false);
    };
    load();
  }, []);

  const handleFetch = async () => {
    setFetchingText(true);
    try {
      const text = await getVersesText(selectedSurah, startVerse, endVerse);
      onTextLoaded(text);
    } catch (e) {
      alert("تعذر جلب النص القرآني، يرجى التحقق من الاتصال.");
    } finally {
      setFetchingText(false);
    }
  };

  const currentSurah = surahs.find(s => s.number === Number(selectedSurah));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4 text-emerald-800">
        <BookOpen className="w-5 h-5" />
        <h3 className="font-bold text-lg">اختيار النص من المصحف</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Surah Selector */}
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">السورة</label>
          <div className="relative">
            <select
              value={selectedSurah}
              onChange={(e) => {
                setSelectedSurah(Number(e.target.value));
                setStartVerse(1);
                setEndVerse(1); // Reset ranges on surah change
              }}
              disabled={loadingSurahs}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
            >
              {loadingSurahs ? (
                <option>جاري التحميل...</option>
              ) : (
                surahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name}
                  </option>
                ))
              )}
            </select>
            <ArrowDown className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Start Verse */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">من الآية</label>
          <input
            type="number"
            min={1}
            max={currentSurah?.numberOfAyahs || 286}
            value={startVerse}
            onChange={(e) => setStartVerse(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* End Verse */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
             إلى الآية (الحد الأقصى {currentSurah?.numberOfAyahs})
          </label>
          <input
            type="number"
            min={startVerse}
            max={currentSurah?.numberOfAyahs || 286}
            value={endVerse}
            onChange={(e) => setEndVerse(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleFetch}
            disabled={fetchingText || isLoading}
            className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {fetchingText ? (
                <span className="text-sm">جاري الجلب...</span>
            ) : (
                <>
                    <Search className="w-4 h-4" />
                    <span>جلب النص</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};