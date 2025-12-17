import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onHistoryClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onHistoryClick, onHomeClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
          <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-xl font-bold">🔥</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">FIRECODE SEARCH</h1>
            <p className="text-xs text-blue-200 font-medium tracking-wider hidden sm:block">FIRE SAFETY INSPECTOR AI ASSISTANT</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <span className="text-xs bg-blue-800 py-1 px-3 rounded-full border border-blue-700">
              RA 9514 (RIRR 2019) Enabled
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-blue-700">
              <button onClick={onHomeClick} className="text-sm font-medium hover:text-orange-300">New</button>
              <button onClick={onHistoryClick} className="text-sm font-medium hover:text-orange-300">History</button>
              <div className="relative group">
                 <button className="flex items-center gap-2 text-sm font-semibold hover:text-blue-200">
                   <span>{user.name.split(' ')[0]}</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-slate-800 hidden group-hover:block border border-slate-200">
                   <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-red-600">
                     Sign out
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;