import React from 'react';
import { EstablishmentType, OccupancyType, SearchParams } from '../types';
import { ESTABLISHMENT_TYPES, OCCUPANCY_TYPES } from '../constants';

interface SearchFormProps {
  params: SearchParams;
  setParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ params, setParams, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = params.establishmentType && params.area && params.occupancyType;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Inspection Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type of Establishment</label>
          <select
            name="establishmentType"
            value={params.establishmentType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            disabled={isLoading}
          >
            <option value="" disabled>Select Type</option>
            {ESTABLISHMENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Floor Area (SQM)</label>
          <input
            type="number"
            name="area"
            value={params.area}
            onChange={handleChange}
            placeholder="e.g. 150"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type of Occupancy Application</label>
          <select
            name="occupancyType"
            value={params.occupancyType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            disabled={isLoading}
          >
            <option value="" disabled>Select Occupancy Type</option>
            {OCCUPANCY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all 
            ${!isFormValid || isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Fire Code...
            </span>
          ) : (
            'Generate Inspection Requirements'
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;