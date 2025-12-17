import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import AuthForms from './components/AuthForms';
import HistoryView from './components/HistoryView';
import ChatBox from './components/ChatBox';
import NTCGenerator from './components/NTCGenerator';
import { SearchParams, User, SavedReport } from './types';
import { generateFireSafetyReport } from './services/geminiService';
import { storageService } from './services/storageService';

type View = 'auth' | 'main' | 'history';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('auth');
  
  const [params, setParams] = useState<SearchParams>({
    establishmentType: '',
    area: '',
    occupancyType: ''
  });
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('main');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('main');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setResult('');
    setParams({ establishmentType: '', area: '', occupancyType: '' });
    setView('auth');
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult('');
    
    try {
      const response = await generateFireSafetyReport(params);
      setResult(response.markdown);
      
      // Auto-save result if user is logged in
      if (user) {
        const report: SavedReport = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          params: { ...params },
          result: response.markdown
        };
        storageService.saveReport(user.email, report);
      }
    } catch (err: any) {
      console.error(err);
      // Display the specific error message if available (e.g. API Key missing)
      setError(err instanceof Error ? err.message : "Unable to generate report. Please check your connection and API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (report: SavedReport) => {
    setParams(report.params);
    setResult(report.result);
    setView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render logic
  if (!user || view === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <AuthForms onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onHistoryClick={() => setView('history')}
        onHomeClick={() => { setView('main'); setResult(''); setParams({ establishmentType: '', area: '', occupancyType: '' }); }}
      />
      
      <main className="flex-grow">
        {view === 'history' ? (
          <HistoryView 
            reports={storageService.getReports(user.email)} 
            onSelect={handleSelectHistory} 
            onBack={() => setView('main')}
          />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <h3 className="text-blue-900 font-semibold mb-2">Welcome, {user.name}</h3>
                    <p className="text-sm text-blue-800">
                      Generate a new inspection checklist below. Past inspections are saved in History.
                    </p>
                </div>
                <SearchForm 
                  params={params} 
                  setParams={setParams} 
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Results & Chat */}
              <div className="lg:col-span-8 space-y-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {result ? (
                  <div className="animate-fade-in-up space-y-8">
                    <ResultDisplay content={result} />
                    <ChatBox reportContext={result} />
                    <NTCGenerator params={params} />
                  </div>
                ) : (
                  !isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Ready to inspect</p>
                      <p className="text-sm">Enter details to generate Fire Code requirements</p>
                    </div>
                  )
                )}
                
                {isLoading && (
                  <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-32 bg-slate-200 rounded"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Bureau of Fire Protection Assistant. All rights reserved.</p>
          <p className="text-xs mt-2">Reference: RA 9514 Revised Implementing Rules and Regulations (2019)</p>
        </div>
      </footer>
    </div>
  );
};

export default App;