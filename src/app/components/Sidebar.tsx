import React, { useState, useMemo } from 'react';
import { Book, Search, ChevronRight, PanelLeftClose } from 'lucide-react';

export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  chapters: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  books: BibleBook[];
  selectedBook: BibleBook | null;
  selectedChapter: number;
  onSelectBook: (book: BibleBook) => void;
  onSelectChapter: (chapter: number) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  books,
  selectedBook,
  selectedChapter,
  onSelectBook,
  onSelectChapter,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'books' | 'chapters'>('books');

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.name.includes(searchQuery) || 
      book.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [books, searchQuery]);

  const handleBookSelect = (book: BibleBook) => {
    onSelectBook(book);
    setView('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    onSelectChapter(chapter);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 right-0 z-50 transition-all duration-300 ease-in-out bg-sidebar-bg border-l border-sidebar-border
        ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full pointer-events-none'} 
        md:relative md:translate-x-0 md:pointer-events-auto
      `}
      dir="rtl"
    >
      {/* Toggle button: Visible only when sidebar is open */}
      <button
        onClick={onToggle}
        className={`absolute -left-12 top-4 p-3 bg-bg-surface border border-sidebar-border border-r-0 rounded-l-xl shadow-md transition-all duration-300 
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <PanelLeftClose className="w-5 h-5 text-accent" />
      </button>

      {/* Internal wrapper with fixed width to prevent text squishing */}
      <div className={`w-80 h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {view === 'books' ? (
          <>
            <div className="p-4 border-b border-sidebar-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-xl font-bold text-foreground">کتاب مقدس</h1>
              </div>
              
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="جستجوی کتاب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-lg border border-sidebar-border bg-bg-surface text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-6 custom-scrollbar">
              <section>
                <h2 className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-widest">عهد عتیق</h2>
                <div className="space-y-1">
                  {filteredBooks.filter(b => b.testament === 'OT').map((book) => (
                    <BookButton 
                      key={book.id}
                      book={book}
                      isSelected={selectedBook?.id === book.id}
                      onClick={() => handleBookSelect(book)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-widest">عهد جدید</h2>
                <div className="space-y-1">
                  {filteredBooks.filter(b => b.testament === 'NT').map((book) => (
                    <BookButton 
                      key={book.id}
                      book={book}
                      isSelected={selectedBook?.id === book.id}
                      onClick={() => handleBookSelect(book)}
                    />
                  ))}
                </div>
              </section>
            </nav>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
              <button
                onClick={() => setView('books')}
                className="p-2 hover:bg-bg-hover rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div>
                <h2 className="font-bold text-lg">{selectedBook?.name}</h2>
                <p className="text-xs text-muted">انتخاب فصل</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-5 gap-2 content-start" dir="ltr">
              {Array.from({ length: selectedBook?.chapters || 0 }, (_, i) => i + 1).map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-all
                    ${selectedChapter === chapter 
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                      : 'border-sidebar-border text-foreground hover:border-accent hover:text-accent'}
                  `}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function BookButton({ book, isSelected, onClick }: { book: BibleBook, isSelected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        w-full text-right px-4 py-3 rounded-xl flex items-center justify-between transition-all group
        ${isSelected 
          ? 'bg-accent/10 text-accent font-bold' 
          : 'hover:bg-bg-hover text-foreground/80 hover:text-foreground'}
      `}
    >
      <span>{book.name}</span>
      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`} />
    </button>
  );
}