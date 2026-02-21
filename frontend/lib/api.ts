/**
 * API client for backend communication
 */

import axios from 'axios';
import type { Segment, ColumnFilter } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds for large exports
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request/Response types
export interface ScrapeRequest {
  segments: string[];
  symbols?: string[];
  date?: string; // Format: YYYY-MM-DD
}

export interface ScrapeResponse {
  success: boolean;
  data: Record<string, any[]>;
  dates_used: Record<string, string>;
  message: string;
  logs: string[];
}

export interface ExportRequest {
  data: Record<string, any[]>;
  filters?: Record<string, ColumnFilter[]>;
  hidden_columns?: Record<string, string[]>;
}

// API functions
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get('/api/health');
  return response.data;
};

export const scrapeData = async (request: ScrapeRequest): Promise<ScrapeResponse> => {
  const response = await api.post<ScrapeResponse>('/api/scrape', request);
  return response.data;
};

export const exportExcel = async (request: ExportRequest): Promise<Blob> => {
  const response = await api.post('/api/export', request, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
