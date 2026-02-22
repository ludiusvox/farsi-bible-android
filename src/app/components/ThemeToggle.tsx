import React from 'react';
import { Sun, Moon } from 'lucide-react';

export type Theme = 'light' | 'dark'; // Removed 'sepia'

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ currentTheme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="absolute top-4 left-4 z-50 flex gap-2 bg-bg-surface p-1.5 rounded-full shadow-md border border-border transition-colors duration-300">
      
      {/* Light Mode Button */}
      <button
        onClick={() => onThemeChange('light')}
        className={`p-2 rounded-full transition-all duration-200 ${
          currentTheme === 'light' 
            ? 'bg-gray-200 text-gray-900 shadow-sm' 
            : 'text-text-secondary hover:bg-bg-hover'
        }`}
        title="حالت روز"
      >
        <Sun className="w-5 h-5" />
      </button>

      {/* Dark Mode Button */}
      <button
        onClick={() => onThemeChange('dark')}
        className={`p-2 rounded-full transition-all duration-200 ${
          currentTheme === 'dark' 
            ? 'bg-gray-700 text-gray-100 shadow-sm' 
            : 'text-text-secondary hover:bg-bg-hover'
        }`}
        title="حالت شب"
      >
        <Moon className="w-5 h-5" />
      </button>
      
    </div>
  );
}