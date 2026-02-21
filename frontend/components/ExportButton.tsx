'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { exportExcel } from '@/lib/api';

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { scrapedData, columnFilters, hiddenColumns, addLog } = useStore();

  const hasData = Object.values(scrapedData).some(data => data && data.length > 0);

  const handleExport = async () => {
    if (!hasData) return;

    setIsExporting(true);
    addLog('info', 'Starting Excel export...');

    try {
      const blob = await exportExcel({
        data: scrapedData,
        filters: columnFilters,
        hidden_columns: hiddenColumns,
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const date = new Date();
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '');
      link.download = `bhavcopy_${dateStr}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addLog('success', 'Excel file downloaded successfully');
    } catch (error: any) {
      addLog('error', `Export failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!hasData || isExporting}
      className={`
        px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
        ${hasData && !isExporting
          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50'
          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }
      `}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </>
      )}
    </button>
  );
}
