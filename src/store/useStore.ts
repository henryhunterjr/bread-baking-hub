import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Symptom {
  id: string;
  labels: string[];
  category: string;
  quickFix: string;
  deepDive: string;
  images: {
    before: string;
    after: string;
  };
}

interface Filters {
  searchTerm: string;
  category: string;
}

interface ScanRecord {
  timestamp: number;
  symptomIds: string[];
}

interface TroubleshootingStore {
  // State
  symptoms: Symptom[];
  filters: Filters;
  history: ScanRecord[];
  
  // Actions
  loadSymptoms: (symptomsArray: Symptom[]) => void;
  setSearchTerm: (term: string) => void;
  setCategory: (cat: string) => void;
  recordScan: (symptomIds: string[]) => void;
}

export const useStore = create<TroubleshootingStore>()(
  persist(
    (set) => ({
  // Initial state
  symptoms: [],
  filters: {
    searchTerm: '',
    category: '',
  },
  history: [],

  // Actions
  loadSymptoms: (symptomsArray) =>
    set(() => ({
      symptoms: symptomsArray,
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      filters: {
        ...state.filters,
        searchTerm: term,
      },
    })),

  setCategory: (cat) =>
    set((state) => ({
      filters: {
        ...state.filters,
        category: cat,
      },
    })),

      recordScan: (symptomIds) =>
        set((state) => ({
          history: [
            ...state.history,
            {
              timestamp: Date.now(),
              symptomIds,
            },
          ],
        })),
    }),
    {
      name: 'troubleshooting-store', // name of the item in localStorage
      partialize: (state) => ({ history: state.history }), // only persist history
    }
  )
);