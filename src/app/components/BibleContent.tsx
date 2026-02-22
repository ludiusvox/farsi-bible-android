// src/components/BibleContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BibleBook } from './Sidebar';

interface Verse {
  verse: number;
  text: string;
}

interface BibleContentProps {
  selectedBook: BibleBook | null;
  selectedChapter: number;
  onSelectChapter: (chapter: number) => void;
}

export function BibleContent({ selectedBook, selectedChapter, onSelectChapter }: BibleContentProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVerses = async () => {
      if (!selectedBook || !selectedBook.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/data/bible/${selectedBook.id}.json`);
        
        if (!response.ok) {
          throw new Error(`کتاب "${selectedBook.name}" یافت نشد.`);
        }

        const data = await response.json();
        const chapterKey = selectedChapter.toString();
        const chapterData = data[chapterKey];

        if (chapterData) {
          const formattedVerses = Object.entries(chapterData).map(([verseNum, text]) => ({
            verse: parseInt(verseNum),
            text: text as string
          }));
          
          formattedVerses.sort((a, b) => a.verse - b.verse);
          setVerses(formattedVerses);
          
          // Scroll to top immediately on successful load
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        } else {
          setVerses([]); 
        }
      } catch (err) {
        console.error("BibleContent Fetch Error:", err);
        setError(err instanceof Error ? err.message : 'خطایی رخ داد');
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [selectedBook?.id, selectedChapter]); // Refined dependency array

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = Number(selectedChapter);
    const max = Number(selectedBook?.chapters || 0);

    if (current < max) {
      onSelectChapter(current + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const current = Number(selectedChapter);
    if (current > 1) {
      onSelectChapter(current - 1);
    }
  };

  // --- Render States ---

  if (!selectedBook) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted" dir="rtl">
        <p className="text-lg italic">لطفاً یک کتاب را انتخاب کنید</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background" dir="rtl">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background text-red-500 p-4" dir="rtl">
        <p className="font-bold mb-2">خطا در بارگذاری:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 h-full min-h-0 overflow-y-auto bg-background transition-colors duration-300 custom-scrollbar" 
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:px-12">
        <header className="mb-12 text-center border-b border-sidebar-border pb-8">
          <h2 className="text-4xl font-black text-foreground mb-2">
            {selectedBook.name}
          </h2>
          <p className="text-accent font-bold text-xl">فصل {selectedChapter}</p>
        </header>
        
        <div className="space-y-6 leading-relaxed mb-16">
          {verses.length > 0 ? (
            verses.map(({ verse, text }) => (
              <p key={verse} className="text-xl text-foreground flex items-start group">
                <span className="text-xs font-bold text-accent/50 ml-4 mt-2 min-w-[1.5rem] group-hover:text-accent transition-colors">
                  {verse}
                </span>
                <span className="flex-1 selection:bg-accent/20">{text}</span>
              </p>
            ))
          ) : (
            <div className="text-center py-20 bg-bg-surface rounded-xl border-2 border-dashed border-sidebar-border">
              <p className="text-muted">آیه‌ای برای این فصل پیدا نشد.</p>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex items-center justify-between border-t border-sidebar-border pt-8 mt-12 mb-8">
          <button
            onClick={handlePrev}
            type="button"
            disabled={Number(selectedChapter) <= 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              Number(selectedChapter) <= 1 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-bg-hover text-foreground font-medium bg-bg-surface border border-sidebar-border'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
            <span>فصل قبلی</span>
          </button>

          <div className="text-sm text-muted font-medium">
            {selectedChapter} از {selectedBook.chapters}
          </div>

          <button
            onClick={handleNext}
            type="button"
            disabled={Number(selectedChapter) >= Number(selectedBook.chapters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              Number(selectedChapter) >= Number(selectedBook.chapters) 
              ? 'opacity-20 cursor-not-allowed' 
              : 'bg-accent text-white hover:opacity-90 font-bold shadow-sm'
            }`}
          >
            <span>فصل بعدی</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}