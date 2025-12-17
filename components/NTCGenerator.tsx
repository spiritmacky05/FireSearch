import React, { useState } from 'react';
import { SearchParams } from '../types';
import { generateNTC } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface NTCGeneratorProps {
  params: SearchParams;
}

const DEFECT_CATEGORIES = [
  {
    title: "Means of Egress",
    items: [
      "Obstruction in exit ways / corridors",
      "Locked exit doors during occupancy",
      "Exit door swings against flow of egress",
      "Insufficient exit width or capacity",
      "Dead-end corridor exceeds limit",
      "Defective or missing panic hardware",
      "Exit discharge not leading to public way"
    ]
  },
  {
    title: "Fire Protection Systems",
    items: [
      "Fire extinguisher expired/depressurized",
      "Fire extinguisher missing/not installed",
      "Fire extinguisher obstructed",
      "Sprinkler system control valve closed",
      "Sprinkler heads obstructed or painted",
      "Fire hose cabinet obstructed/incomplete"
    ]
  },
  {
    title: "Detection, Alarm & Communication",
    items: [
      "Fire alarm control panel in trouble mode",
      "Manual pull station obstructed/defective",
      "Smoke/Heat detectors missing or defective",
      "No integrated fire alarm system",
      "Alarm bell/horn not audible"
    ]
  },
  {
    title: "Illumination & Signs",
    items: [
      "Emergency lights non-functional",
      "Missing or defective exit signs",
      "Exit signs not illuminated",
      "No directional exit signage",
      "Improper placement of exit signs"
    ]
  },
  {
    title: "Electrical & Utilities",
    items: [
      "Octopus connections (Overloading)",
      "Exposed electrical wiring/splices",
      "Uncovered junction boxes",
      "Use of flat cord for permanent wiring",
      "Electrical panel obstructed"
    ]
  },
  {
    title: "General Safety",
    items: [
      "Poor housekeeping",
      "Improper storage of flammable liquids",
      "LPG tanks not secured/improperly stored",
      "No 'No Smoking' signs in hazard areas",
      "Failure to conduct fire drill",
      "No fire safety program/organization"
    ]
  }
];

const NTCGenerator: React.FC<NTCGeneratorProps> = ({ params }) => {
  const [selectedDefects, setSelectedDefects] = useState<Set<string>>(new Set());
  const [otherDefects, setOtherDefects] = useState('');
  const [ntcContent, setNtcContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleDefect = (defect: string) => {
    const newSelected = new Set(selectedDefects);
    if (newSelected.has(defect)) {
      newSelected.delete(defect);
    } else {
      newSelected.add(defect);
    }
    setSelectedDefects(newSelected);
  };

  const handleGenerate = async () => {
    const defectsList = Array.from(selectedDefects);
    if (otherDefects.trim()) {
      defectsList.push(otherDefects.trim());
    }

    if (defectsList.length === 0) {
      setError('Please select at least one defect or add observations.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setNtcContent('');

    const violationsContext = defectsList.map((d, i) => `${i + 1}. ${d}`).join('\n');

    try {
      const result = await generateNTC(params, violationsContext);
      setNtcContent(result);
    } catch (err: any) {
      console.error("NTC Gen Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to generate legal basis list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-red-900 text-white p-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-lg">Generate NTC Details</h3>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
          Select the observed violations from the checklist below to generate the Notice to Comply (NTC) details.
        </p>

        <div className="space-y-6 mb-8">
          {DEFECT_CATEGORIES.map((category, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-200">
                {category.title}
              </div>
              <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group p-1 hover:bg-slate-50 rounded transition-colors">
                    <div className="relative flex items-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm checked:border-red-600 checked:bg-red-600 focus:ring-2 focus:ring-red-500/20 bg-white"
                        checked={selectedDefects.has(item)}
                        onChange={() => toggleDefect(item)}
                      />
                      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className={`text-sm select-none transition-colors ${selectedDefects.has(item) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Other Observations (Optional)
          </label>
          <textarea
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[80px] bg-white"
            placeholder="Type any other defects not listed above..."
            value={otherDefects}
            onChange={(e) => setOtherDefects(e.target.value)}
          ></textarea>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || (selectedDefects.size === 0 && !otherDefects.trim())}
          className="w-full sm:w-auto bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-3 rounded-lg font-bold hover:from-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating NTC Details...
            </>
          ) : (
            'Match Selected Defects to Fire Code'
          )}
        </button>

        {ntcContent && (
          <div className="mt-8 border-t-2 border-slate-100 pt-6 animate-fade-in-up">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-red-600">⚠</span> Defects, Legal Basis & Explanation
            </h4>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 prose prose-slate max-w-none prose-headings:text-red-600 text-sm shadow-inner">
              <ReactMarkdown>{ntcContent}</ReactMarkdown>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {navigator.clipboard.writeText(ntcContent); alert('Copied to clipboard!');}}
                className="flex items-center gap-2 text-sm text-blue-700 font-bold hover:text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m2 4h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NTCGenerator;