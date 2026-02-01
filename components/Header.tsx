
import React from 'react';

interface HeaderProps {
  onHistoryClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, onHomeClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
          <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-xl font-bold">🔥</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Super FC AI</h1>
            <p className="text-xs text-blue-200 font-medium tracking-wider hidden sm:block uppercase">Reference Tool</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block mr-2">
            <span className="text-[10px] bg-blue-800 py-1 px-3 rounded-full border border-blue-700 font-bold uppercase tracking-widest">
              RA 9514 (RIRR 2019)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 border-l border-blue-700 pl-4">
            <button 
              type="button"
              onClick={onHomeClick} 
              className="text-xs sm:text-sm font-bold uppercase tracking-wider hover:text-orange-300 transition-colors"
            >
              New Search
            </button>
            <button 
              type="button"
              onClick={onHistoryClick} 
              className="text-xs sm:text-sm font-bold uppercase tracking-wider hover:text-orange-300 transition-colors"
            >
              Saved History
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
