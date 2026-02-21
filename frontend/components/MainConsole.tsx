'use client';

import { useCallback, useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { healthCheck } from '@/lib/api';

export default function MainConsole() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { 
    selectedSegments,
    selectedDate, 
    isProcessing, 
    setProcessing,
    addLog
  } = useStore();

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('online');
      } catch (error) {
        setBackendStatus('offline');
        addLog('error', 'Backend is not responding. Please ensure it is running on http://localhost:8000');
      }
    };
    
    checkBackend();
  }, [addLog]);

  const handleDirectDownload = useCallback(async () => {
    if (selectedSegments.size === 0) {
      addLog('warning', 'Please select at least one segment');
      return;
    }

    setProcessing(true);
    addLog('info', 'Starting direct CSV download...');

    try {
      // Format date as YYYY-MM-DD using local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Create download URL
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = `${API_BASE_URL}/api/download-csv`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          segments: Array.from(selectedSegments),
          date: dateStr,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Download failed');
      }

      // Get filename from header or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${dateStr.replace(/-/g, '')}.csv`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
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
      addLog('error', `Download failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }, [selectedSegments, selectedDate, setProcessing, addLog]);

  const canRunMagic = selectedSegments.size > 0 && !isProcessing;

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-100">Download CSV Data</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            backendStatus === 'online' ? 'bg-green-500' : 
            backendStatus === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`} />
          <span className="text-xs text-zinc-500">
            {backendStatus === 'online' ? 'Backend Online' : 
             backendStatus === 'offline' ? 'Backend Offline' : 
             'Checking...'}
          </span>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDirectDownload}
        disabled={!canRunMagic}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all
          ${canRunMagic
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Downloading...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV File
          </span>
        )}
      </button>

      {selectedSegments.size === 0 ? (
        <p className="text-sm text-zinc-500 text-center mt-4">
          Select at least one segment to continue
        </p>
      ) : (
        <p className="text-sm text-zinc-400 text-center mt-4">
          Will download {Array.from(selectedSegments).join(', ')} data for{' '}
          {selectedDate.getDate()}-{selectedDate.toLocaleString('en-US', { month: 'short' })}-{selectedDate.getFullYear()}
        </p>
      )}
    </div>
  );
}
