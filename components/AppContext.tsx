import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { OfficerRecord, View, EstablishmentRecord, StructuredCorporatePlan } from '../types';
import { DataAggregator, AggregatedData } from '../services/DataAggregator';

// Enhanced types for the context
export interface BaselineData {
  agencyName: string;
  kpis: {
    establishmentGap: number;
    baselineScore: number;
    criticalSkillGaps: number;
    trainingCompletion: number;
  };
}

export interface AppState {
  // Core data
  officers: OfficerRecord[];
  establishmentData: EstablishmentRecord[];
  corporatePlanData: StructuredCorporatePlan | null;
  baselineData: BaselineData | null;
  aggregatedData: AggregatedData | null;

  // UI state
  currentView: View;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Record<string, unknown>;

  // Import state
  importProgress: number;
  importStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

  // Cache state
  isDataCached: boolean;
  lastUpdated: Date | null;
}

export type AppAction =
  | { type: 'SET_OFFICERS'; payload: OfficerRecord[] }
  | { type: 'SET_ESTABLISHMENT_DATA'; payload: EstablishmentRecord[] }
  | { type: 'SET_CORPORATE_PLAN_DATA'; payload: StructuredCorporatePlan | null }
  | { type: 'SET_BASELINE_DATA'; payload: BaselineData | null }
  | { type: 'SET_AGGREGATED_DATA'; payload: AggregatedData | null }
  | { type: 'SET_CURRENT_VIEW'; payload: View }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, unknown> }
  | { type: 'SET_IMPORT_PROGRESS'; payload: number }
  | { type: 'SET_IMPORT_STATUS'; payload: AppState['importStatus'] }
  | { type: 'LOAD_CACHED_DATA'; payload: Partial<AppState> }
  | { type: 'CLEAR_CACHE' }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  officers: [],
  establishmentData: [],
  corporatePlanData: null,
  baselineData: null,
  aggregatedData: null,
  currentView: 'dashboard',
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {},
  importProgress: 0,
  importStatus: 'idle',
  isDataCached: false,
  lastUpdated: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_OFFICERS':
      return { ...state, officers: action.payload, lastUpdated: new Date() };
    case 'SET_ESTABLISHMENT_DATA':
      return { ...state, establishmentData: action.payload, lastUpdated: new Date() };
    case 'SET_CORPORATE_PLAN_DATA':
      return { ...state, corporatePlanData: action.payload, lastUpdated: new Date() };
    case 'SET_BASELINE_DATA':
      return { ...state, baselineData: action.payload };
    case 'SET_AGGREGATED_DATA':
      return { ...state, aggregatedData: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_IMPORT_PROGRESS':
      return { ...state, importProgress: action.payload };
    case 'SET_IMPORT_STATUS':
      return { ...state, importStatus: action.payload };
    case 'LOAD_CACHED_DATA':
      return { ...state, ...action.payload, isDataCached: true };
    case 'CLEAR_CACHE':
      localStorage.removeItem('cnas_app_data');
      return { ...initialState };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setCurrentView: (view: View) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  updateImportProgress: (progress: number) => void;
  setImportStatus: (status: AppState['importStatus']) => void;
  loadCachedData: () => void;
  saveToCache: () => void;
  clearCache: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setCurrentView = (view: View) => dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const setSearchQuery = (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const setFilters = (filters: Record<string, unknown>) => dispatch({ type: 'SET_FILTERS', payload: filters });
  const updateImportProgress = (progress: number) => dispatch({ type: 'SET_IMPORT_PROGRESS', payload: progress });
  const setImportStatus = (status: AppState['importStatus']) => dispatch({ type: 'SET_IMPORT_STATUS', payload: status });

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem('cnas_app_data');
      if (cached) {
        const parsedData = JSON.parse(cached);
        dispatch({ type: 'LOAD_CACHED_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  };

  const saveToCache = () => {
    try {
      const dataToCache = {
        officers: state.officers,
        establishmentData: state.establishmentData,
        corporatePlanData: state.corporatePlanData,
        baselineData: state.baselineData,
        lastUpdated: state.lastUpdated,
      };
      localStorage.setItem('cnas_app_data', JSON.stringify(dataToCache));
    } catch (error) {
      console.error('Failed to save data to cache:', error);
    }
  };

  const clearCache = () => dispatch({ type: 'CLEAR_CACHE' });

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  // Compute aggregated data when source data changes
  useEffect(() => {
    if (state.officers.length > 0 && state.establishmentData.length > 0) {
      const aggregated = DataAggregator.process(state.officers, state.establishmentData, state.corporatePlanData || undefined);
      dispatch({ type: 'SET_AGGREGATED_DATA', payload: aggregated });
    } else {
      dispatch({ type: 'SET_AGGREGATED_DATA', payload: null });
    }
  }, [state.officers, state.establishmentData, state.corporatePlanData]);

  // Save to cache when data changes
  useEffect(() => {
    if (state.officers.length > 0 || state.establishmentData.length > 0 || state.corporatePlanData) {
      saveToCache();
    }
  }, [state.officers, state.establishmentData, state.corporatePlanData, state.aggregatedData]);

  const value: AppContextType = {
    state,
    dispatch,
    setCurrentView,
    setLoading,
    setError,
    setSearchQuery,
    setFilters,
    updateImportProgress,
    setImportStatus,
    loadCachedData,
    saveToCache,
    clearCache,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
