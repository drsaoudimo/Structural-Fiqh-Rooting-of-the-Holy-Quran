import React, { useState, useEffect } from 'react';
import { analyzeText } from './services/geminiService';
import { AnalysisResult, HistoryItem, ModelId } from './types';
import { EquationViewer } from './components/EquationViewer';
import { ThemeChart } from './components/ThemeChart';
import { DecompositionView } from './components/DecompositionView';
import { DeductionCard } from './components/DeductionCard';
import { ReligiousArticle } from './components/ReligiousArticle';
import { VerseSelector } from './components/VerseSelector';
import { Sparkles, Search, BookOpen, Loader2, History, RotateCcw, Cpu } from 'lucide-react';

const DEFAULT_TEXT = "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ";

const App: React.FC = () => {
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-3-flash-preview');

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('quran_analysis_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = (res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      result: res
    };
    // Keep last 10 items
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('quran_analysis_history', JSON.stringify(updated));
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeText(inputText, selectedModel);
      setResult(analysis);
      addToHistory(analysis);
    } catch (err) {
      setError("حدث خطأ أثناء تحليل النص. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromHistory = (item: HistoryItem) => {
    setResult(item.result);
    setInputText(item.result.originalText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-emerald-950 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <pattern id="islamic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamic-pattern)"/>
           </svg>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500 p-2 rounded-lg text-emerald-950">
               <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-serif tracking-wide">التأصيل الفقهي والبنيوي للقرآن الكريم</h1>
              <p className="text-emerald-200 text-sm font-light tracking-widest uppercase opacity-80">
                Structural & Fiqh Rooting of the Holy Quran
              </p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <span className="inline-block bg-emerald-900/50 px-4 py-1 rounded-full text-xs text-emerald-100 border border-emerald-800">
              V 1.0 Beta &bull; Powered by Gemini
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-6 relative z-20">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border-t-4 border-gold-500">
          
          <VerseSelector 
            isLoading={isLoading} 
            onTextLoaded={(text) => setInputText(text)} 
          />

          <label className="block text-slate-600 mb-2 font-medium">النص القرآني للتحليل</label>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-xl md:text-2xl font-serif text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[120px] resize-y placeholder:text-slate-300"
              placeholder="اكتب الآية أو استخدم أداة الجلب أعلاه..."
              dir="rtl"
            />
            
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
              
              {/* Model Selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 w-full md:w-auto">
                <div className="px-2 text-slate-500">
                  <Cpu size={18} />
                </div>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                  disabled={isLoading}
                  className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-48"
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (افتراضي)</option>
                  <option value="gemini-2.5-flash-latest">Gemini 2.5 Flash</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto">
                 <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full md:w-auto bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-gold-400" />
                      تحليل رياضي
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Results Section - Conditionally Rendered */}
        {result && !isLoading && (
          <div className="mt-12 max-w-6xl mx-auto animate-fade-in-up space-y-8">
            
            {/* 1. The Equation */}
            <EquationViewer equation={result.equation} />

            {/* 2. Grid Layout for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart */}
              <div className="md:col-span-1">
                <ThemeChart data={result.themes} />
              </div>

              {/* Decomposition */}
              <div className="md:col-span-1">
                <DecompositionView items={result.decomposition} />
              </div>
            </div>

            {/* 3. Deduction */}
            <DeductionCard text={result.deduction} dominant={result.dominantTheme} />

            {/* 4. Religious Article (Fiqh Style) */}
            <ReligiousArticle article={result.religiousArticle} />

          </div>
        )}

        {/* Empty State / Placeholder */}
        {!result && !isLoading && (
          <div className="mt-20 text-center opacity-40">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-400">بانتظار المدخلات...</h2>
            <p className="text-slate-400">ابدأ بإدخال آية لتحويلها إلى معادلات واستنتاجات.</p>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && !isLoading && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-600 border-b pb-2">
              <History className="w-5 h-5" />
              <h3 className="font-bold text-lg">سجل التحليلات السابقة</h3>
            </div>
            <div className="grid gap-3">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer"
                  onClick={() => restoreFromHistory(item)}
                >
                  <div className="flex-1 truncate ml-4">
                     <p className="font-serif text-lg text-slate-800 truncate">{item.result.originalText}</p>
                     <p className="text-xs text-slate-500 mt-1">
                       المتغير المهيمن: <span className="text-emerald-600 font-medium">{item.result.dominantTheme}</span>
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleDateString('ar-EG')}
                     </span>
                     <button className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                       <RotateCcw className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-slate-50">
        <p className="mb-2">تم بناء هذا النظام وفق منهجية &quot;القرآنوميكا&quot; للمحاكاة الرياضية.</p>
        <p className="font-medium text-slate-500">
          حقوق المطور للدكتور سعودي محمد سطيف الجزائر فبراير 2026
        </p>
      </footer>
    </div>
  );
};

export default App;