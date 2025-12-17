import React from 'react';
import { SavedReport } from '../types';

interface HistoryViewProps {
  reports: SavedReport[];
  onSelect: (report: SavedReport) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ reports, onSelect, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Inspection History</h2>
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Search
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow border border-slate-200 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 text-lg">No saved inspections yet.</p>
          <button onClick={onBack} className="mt-4 text-blue-600 font-medium hover:underline">Start a new inspection</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => onSelect(report)}
              className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-900">
                    {report.params.establishmentType}
                  </h3>
                  <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p>Occupancy: {report.params.occupancyType}</p>
                    <p>Area: {report.params.area} SQM</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </span>
                  <div className="mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Report →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
