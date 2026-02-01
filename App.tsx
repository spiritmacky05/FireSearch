
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryView from './components/HistoryView';
import ChatBox from './components/ChatBox';
import NTCGenerator from './components/NTCGenerator';
import AssistantModal from './components/AssistantModal';
import { SearchParams, User, SavedReport } from './types';
import { generateFireSafetyReport } from './services/geminiService';
import { storageService } from './services/storageService';

type View = 'main' | 'history';

const GUEST_USER: User = {
  email: 'local-user',
  name: 'Inspector'
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const [params, setParams] = useState<SearchParams>({
    establishmentType: '',
    area: '',
    stories: ''
  });
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult('');
    
    try {
      const response = await generateFireSafetyReport(params);
      setResult(response.markdown);
      
      const report: SavedReport = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        params: { ...params },
        result: response.markdown
      };
      storageService.saveReport(GUEST_USER.email, report);
    } catch (err: any) {
      console.error(err);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <Header 
        onHistoryClick={() => setView('history')}
        onHomeClick={() => { setView('main'); setResult(''); setParams({ establishmentType: '', area: '', stories: '' }); }}
      />
      
      <main className="flex-grow">
        {view === 'history' ? (
          <HistoryView 
            reports={storageService.getReports(GUEST_USER.email)} 
            onSelect={handleSelectHistory} 
            onBack={() => setView('main')}
          />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
                    <h3 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                       <span className="text-xl">🛡️</span> Fire Safety Assistant
                    </h3>
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100 mb-2">
                      <p className="text-xs text-blue-900 leading-relaxed font-medium">
                        <strong className="text-blue-950">IMPORTANT DISCLAIMER:</strong> Super FC AI is intended for assistance and guidance only. 
                        AI can make mistakes. This tool does <strong>not</strong> replace official inspection procedures.
                      </p>
                    </div>
                </div>
                <SearchForm 
                  params={params} 
                  setParams={setParams} 
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                />

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hidden lg:block">
                   <h4 className="font-bold text-slate-800 mb-2">Need Expert Help?</h4>
                   <p className="text-xs text-slate-500 mb-4 tracking-tight">Launch our expert assistant to ask deep questions about the Fire Code, specific citations, and penalty amounts.</p>
                   <button 
                     onClick={() => setIsAssistantOpen(true)}
                     className="w-full py-2.5 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm active:scale-95"
                   >
                     Launch Super AI Assistant
                   </button>
                </div>
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
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center">
                      <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold text-slate-500">Ready to inspect</p>
                      <p className="text-sm">Enter establishment data to see legal requirements</p>
                    </div>
                  )
                )}
                
                {isLoading && (
                  <div className="space-y-6 animate-pulse bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                      <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-48 bg-slate-100 rounded"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium">© {new Date().getFullYear()} Super FC AI Assistant. BFP Reference tool.</p>
          <div className="flex justify-center gap-4 mt-4 text-[10px] uppercase tracking-widest opacity-40">
            <span>RA 9514 (RIRR 2019)</span>
            <span>•</span>
            <span>FIREBOipH</span>
          </div>
        </div>
      </footer>

      <AssistantModal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60] flex items-center justify-center border-4 border-white group"
        title="Ask Super AI Assistant"
      >
        <span className="text-3xl group-hover:rotate-12 transition-transform">🤖</span>
      </button>
    </div>
  );
};

export default App;
