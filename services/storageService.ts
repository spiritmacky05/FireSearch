
import { SavedReport, User } from '../types';

const REPORTS_KEY_PREFIX = 'fire_search_reports_';

export const storageService = {
  // Reports
  saveReport: (email: string, report: SavedReport) => {
    try {
      const key = `${REPORTS_KEY_PREFIX}${email}`;
      const reports = JSON.parse(localStorage.getItem(key) || '[]');
      reports.unshift(report); // Add to top
      localStorage.setItem(key, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save report locally', e);
    }
  },

  getReports: (email: string): SavedReport[] => {
    try {
      const key = `${REPORTS_KEY_PREFIX}${email}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  },

  // Legacy stubs for compatibility
  getCurrentUser: () => null,
  
  // Updated login stub with correct signature to fix AuthForms.tsx error
  login: (email: string, password: string) => {
    // Basic stub implementation for testing credentials mentioned in UI
    if (email === 'inspector@bfp.gov.ph' && password === 'admin') {
      return { email, name: 'Lead Inspector' };
    }
    return null;
  },
  
  // Updated register stub with correct signature to fix AuthForms.tsx error
  register: (user: User) => {
    return true;
  },
  
  logout: () => {}
};
