// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import type { BibleBook } from './components/Sidebar';
import { BibleContent } from './components/BibleContent';
import { ThemeToggle } from './components/ThemeToggle';
import type { Theme } from './components/ThemeToggle';
import { Menu } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('bible-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    const loadMetadata = async () => {
      try {
        const response = await fetch('/data/bible/metadata.json');
        if (!response.ok) throw new Error('Failed to load book list');
        const metadata = await response.json();
        setBooks(metadata);
        if (metadata.length > 0 && !selectedBook) setSelectedBook(metadata[0]);
      } catch (error) {
        console.error("Metadata error:", error);
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    localStorage.setItem('bible-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Use useCallback to prevent unnecessary re-renders and ensure stable logic
  const handleBookSelect = useCallback((book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
  }, []);

  const handleChapterSelect = useCallback((chapter: number) => {
    // This ensures only the chapter number is updated, never the book
    setSelectedChapter(Number(chapter));
  }, []);

  return (
    <div 
      className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden" 
      dir="rtl"
      data-theme={theme}
    >
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        books={books} 
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        onSelectBook={handleBookSelect}
        onSelectChapter={handleChapterSelect}
      />

      <main className="flex-1 relative flex flex-col min-w-0 min-h-0 overflow-hidden">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 right-4 z-40 p-3 rounded-xl bg-bg-surface border border-sidebar-border shadow-lg text-accent hover:scale-105 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="absolute top-4 left-4 z-40">
           <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 pt-16 md:pt-0 overflow-hidden">
          <BibleContent 
            // The KEY is crucial. It resets the component state entirely when book/chapter changes
            key={`${selectedBook?.id || 'none'}-${selectedChapter}`} 
            selectedBook={selectedBook}
            selectedChapter={selectedChapter}
            onSelectChapter={handleChapterSelect}
          />
        </div>
      </main>
    </div>
  );
}