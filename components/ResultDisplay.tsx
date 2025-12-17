import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultDisplayProps {
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-900 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inspection Guidelines</h2>
          <p className="text-sm text-slate-500">Generated based on RA 9514 (RIRR 2019)</p>
        </div>
      </div>
      
      <div className="markdown-body prose prose-slate max-w-none prose-headings:text-blue-900 prose-a:text-blue-600">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        Disclaimer: This is an AI-assisted reference tool. Always verify with the official Fire Code of the Philippines.
      </div>
    </div>
  );
};

export default ResultDisplay;
