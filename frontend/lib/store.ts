/**
 * Zustand store for global state management
 * 
 * Manages:
 * - Symbol file upload and storage
 * - Segment selection
 * - Scraped data
 * - Processing state
 * - System logs
 * - Grid filters and column visibility
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Segment = 'NSE_CASH' | 'NSE_FO' | 'MCX';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export interface ColumnFilter {
  field: string;
  values: string[];
}

export interface SegmentStatus {
  segment: Segment;
  status: 'updated' | 'pending';
  lastUpdate?: Date;
}

interface AppState {
  // Symbol management
  symbols: string[];
  symbolCount: number;
  uploadSymbols: (file: File) => Promise<void>;
  
  // Segment selection
  selectedSegments: Set<Segment>;
  toggleSegment: (segment: Segment) => void;
  
  // Date selection
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  // Data management
  scrapedData: Record<Segment, any[]>;
  filteredData: Record<Segment, any[]>;
  setScrapedData: (segment: Segment, data: any[]) => void;
  datesUsed: Record<Segment, string>;
  setDatesUsed: (dates: Record<Segment, string>) => void;
  
  // Processing state
  isProcessing: boolean;
  setProcessing: (value: boolean) => void;
  
  // Logs
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string) => void;
  clearLogs: () => void;
  
  // Grid state
  columnFilters: Record<Segment, ColumnFilter[]>;
  hiddenColumns: Record<Segment, string[]>;
  updateFilters: (segment: Segment, filters: ColumnFilter[]) => void;
  updateHiddenColumns: (segment: Segment, columns: string[]) => void;
  
  // Segment status
  segmentStatuses: SegmentStatus[];
  updateSegmentStatus: (segment: Segment, status: 'updated' | 'pending', lastUpdate?: Date) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      symbols: [],
      symbolCount: 0,
      selectedSegments: new Set<Segment>(['NSE_FO']), // Default to NSE F&O
      selectedDate: new Date(), // Default to today's date
      scrapedData: {} as Record<Segment, any[]>,
      filteredData: {} as Record<Segment, any[]>,
      datesUsed: {} as Record<Segment, string>,
      isProcessing: false,
      logs: [],
      columnFilters: {} as Record<Segment, ColumnFilter[]>,
      hiddenColumns: {} as Record<Segment, string[]>,
      segmentStatuses: [
        { segment: 'NSE_CASH', status: 'pending' },
        { segment: 'NSE_FO', status: 'pending' },
        { segment: 'MCX', status: 'pending' },
      ],

      // Symbol management
      uploadSymbols: async (file: File) => {
        try {
          const text = await file.text();
          const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
          
          // Remove header if present
          const symbols = lines[0].toUpperCase().includes('SYMBOL') 
            ? lines.slice(1) 
            : lines;
          
          set({ 
            symbols: symbols.map(s => s.toUpperCase()),
            symbolCount: symbols.length 
          });
          
          get().addLog('success', `Loaded ${symbols.length} symbols from ${file.name}`);
        } catch (error) {
          get().addLog('error', `Failed to load symbol file: ${error}`);
          throw error;
        }
      },

      // Segment selection
      toggleSegment: (segment: Segment) => {
        const { selectedSegments } = get();
        const newSegments = new Set(selectedSegments);
        
        if (newSegments.has(segment)) {
          newSegments.delete(segment);
        } else {
          newSegments.add(segment);
        }
        
        set({ selectedSegments: newSegments });
      },

      // Date selection
      setSelectedDate: (date: Date) => {
        set({ selectedDate: date });
      },

      // Data management
      setScrapedData: (segment: Segment, data: any[]) => {
        set(state => ({
          scrapedData: { ...state.scrapedData, [segment]: data },
          filteredData: { ...state.filteredData, [segment]: data },
        }));
      },

      setDatesUsed: (dates: Record<Segment, string>) => {
        set({ datesUsed: dates });
      },

      // Processing state
      setProcessing: (value: boolean) => {
        set({ isProcessing: value });
      },

      // Logs
      addLog: (level: LogEntry['level'], message: string) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        set(state => ({
          logs: [...state.logs, { timestamp, level, message }]
        }));
      },

      clearLogs: () => {
        set({ logs: [] });
      },

      // Grid state
      updateFilters: (segment: Segment, filters: ColumnFilter[]) => {
        set(state => ({
          columnFilters: { ...state.columnFilters, [segment]: filters }
        }));
      },

      updateHiddenColumns: (segment: Segment, columns: string[]) => {
        set(state => ({
          hiddenColumns: { ...state.hiddenColumns, [segment]: columns }
        }));
      },

      // Segment status
      updateSegmentStatus: (segment: Segment, status: 'updated' | 'pending', lastUpdate?: Date) => {
        set(state => ({
          segmentStatuses: state.segmentStatuses.map(s =>
            s.segment === segment ? { segment, status, lastUpdate } : s
          )
        }));
      },
    }),
    {
      name: 'bhavcopy-storage',
      partialize: (state) => ({
        selectedSegments: Array.from(state.selectedSegments),
        symbols: state.symbols,
        symbolCount: state.symbolCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Set
          if (Array.isArray(state.selectedSegments)) {
            state.selectedSegments = new Set(state.selectedSegments as Segment[]);
          }
          
          // Force NSE_FO to be selected if nothing is selected
          if (state.selectedSegments.size === 0) {
            state.selectedSegments = new Set(['NSE_FO']);
          }
        }
      },
    }
  )
);
