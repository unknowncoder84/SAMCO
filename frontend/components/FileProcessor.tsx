'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';

interface ColumnInfo {
  name: string;
  selected: boolean;
  sampleValue: string;
}

export default function FileProcessor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [includePE, setIncludePE] = useState(true);
  const [includeCE, setIncludeCE] = useState(true);
  const { addLog } = useStore();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      addLog('error', 'Please upload a CSV file');
      return;
    }

    setUploadedFile(file);
    addLog('info', `Loaded file: ${file.name}`);

    // Parse CSV to get columns
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Get first data row for sample values
      const firstDataRow = lines[1]?.split(',') || [];
      
      const columnInfo: ColumnInfo[] = headers.map((header, index) => ({
        name: header,
        selected: true, // All selected by default
        sampleValue: firstDataRow[index] || ''
      }));
      
      setColumns(columnInfo);
      
      // Parse first 5 rows for preview
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',');
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });
      setPreviewData(preview);
      
      addLog('success', `Found ${headers.length} columns`);
    } catch (error) {
      addLog('error', `Failed to parse CSV: ${error}`);
    }
  }, [addLog]);

  const toggleColumn = useCallback((columnName: string) => {
    setColumns(prev => prev.map(col => 
      col.name === columnName ? { ...col, selected: !col.selected } : col
    ));
  }, []);

  const selectAll = useCallback(() => {
    setColumns(prev => prev.map(col => ({ ...col, selected: true })));
  }, []);

  const deselectAll = useCallback(() => {
    setColumns(prev => prev.map(col => ({ ...col, selected: false })));
  }, []);

  const handleProcessAndDownload = useCallback(async () => {
    if (!uploadedFile) {
      addLog('error', 'Please upload a file first');
      return;
    }

    const selectedColumns = columns.filter(col => col.selected).map(col => col.name);
    if (selectedColumns.length === 0) {
      addLog('error', 'Please select at least one column');
      return;
    }

    setIsProcessing(true);
    addLog('info', 'Processing file and converting to Excel...');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('columns', JSON.stringify(selectedColumns));
      formData.append('include_pe', includePE.toString());
      formData.append('include_ce', includeCE.toString());

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/process-csv-to-excel`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Processing failed');
      }

      // Download the Excel file
      const blob = await response.blob();
      const filename = uploadedFile.name.replace('.csv', '_filtered.xlsx');
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      addLog('success', `Downloaded: ${filename}`);
    } catch (error: any) {
      addLog('error', `Processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, columns, includePE, includeCE, addLog]);

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
        📊 CSV to Excel Converter
      </h2>
      <p className="text-sm text-zinc-400 mb-6">
        Upload a CSV file, select columns to keep, and download as formatted Excel
      </p>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-zinc-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-emerald-500 file:text-white
            hover:file:bg-emerald-600
            file:cursor-pointer cursor-pointer"
        />
        {uploadedFile && (
          <p className="mt-2 text-sm text-emerald-400">
            ✓ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Column Selection */}
      {columns.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-zinc-300">
              Select Columns to Keep ({columns.filter(c => c.selected).length}/{columns.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            {columns.map((column) => (
              <label
                key={column.name}
                className="flex items-start gap-2 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={column.selected}
                  onChange={() => toggleColumn(column.name)}
                  className="mt-1 w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {column.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {column.sampleValue || 'No data'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* PE/CE Filter Options */}
      {uploadedFile && columns.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            🎯 Option Type Filters
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-zinc-950 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includePE}
                onChange={(e) => setIncludePE(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">
                  Include PE (Put Options)
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {includePE ? 'PE rows will be included' : 'PE rows will be excluded'}
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-zinc-950 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeCE}
                onChange={(e) => setIncludeCE(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">
                  Include CE (Call Options)
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {includeCE ? 'CE rows will be included' : 'CE rows will be excluded'}
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Data Preview (First 5 rows)
          </label>
          <div className="overflow-x-auto bg-zinc-950 rounded-lg border border-zinc-800">
            <table className="min-w-full text-xs">
              <thead className="bg-zinc-900">
                <tr>
                  {columns.filter(c => c.selected).map(col => (
                    <th key={col.name} className="px-3 py-2 text-left text-zinc-400 font-medium">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="border-t border-zinc-800">
                    {columns.filter(c => c.selected).map(col => (
                      <td key={col.name} className="px-3 py-2 text-zinc-300">
                        {row[col.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Process Button */}
      {uploadedFile && columns.length > 0 && (
        <button
          onClick={handleProcessAndDownload}
          disabled={isProcessing || columns.filter(c => c.selected).length === 0}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold transition-all
            ${isProcessing || columns.filter(c => c.selected).length === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Converting to Excel...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Convert to Excel & Download
            </span>
          )}
        </button>
      )}
    </div>
  );
}
