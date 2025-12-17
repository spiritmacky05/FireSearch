import { User, SavedReport } from '../types';

const USERS_KEY = 'fire_search_users';
const CURRENT_USER_KEY = 'fire_search_current_user';
const REPORTS_KEY_PREFIX = 'fire_search_reports_';

// Initialize a default user for testing purposes if storage is empty
const initializeDefaults = () => {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      const defaultUser: User = {
        email: 'inspector@bfp.gov.ph',
        name: 'Inspector Juan',
        password: 'admin'
      };
      localStorage.setItem(USERS_KEY, JSON.stringify({ [defaultUser.email]: defaultUser }));
    }
  } catch (e) {
    console.error('LocalStorage access failed', e);
  }
};

initializeDefaults();

export const storageService = {
  // Auth
  register: (user: User): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (users[user.email]) {
        return false; // User exists
      }
      users[user.email] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (e) {
      return false;
    }
  },

  login: (email: string, password: string): User | null => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      const user = users[email];
      if (user && user.password === password) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { email: user.email, name: user.name };
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Reports
  saveReport: (email: string, report: SavedReport) => {
    try {
      const key = `${REPORTS_KEY_PREFIX}${email}`;
      const reports = JSON.parse(localStorage.getItem(key) || '[]');
      reports.unshift(report); // Add to top
      localStorage.setItem(key, JSON.stringify(reports));
    } catch (e) {}
  },

  getReports: (email: string): SavedReport[] => {
    try {
      const key = `${REPORTS_KEY_PREFIX}${email}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }
};