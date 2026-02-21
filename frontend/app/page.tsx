'use client';

import Sidebar from '@/components/Sidebar';
import MainConsole from '@/components/MainConsole';
import SegmentSelector from '@/components/SegmentSelector';
import DatePicker from '@/components/DatePicker';
import StatCards from '@/components/StatCards';
import DataGrid from '@/components/DataGrid';
import SystemLogs from '@/components/SystemLogs';
import ExportButton from '@/components/ExportButton';
import FileProcessor from '@/components/FileProcessor';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { scrapedData, selectedSegments } = useStore();
  
  // Check if we have any data to display
  const hasData = Object.keys(scrapedData).length > 0;
  // Show grids for segments that have data (not just selected segments)
  const segmentsWithData = Object.keys(scrapedData).filter(
    segment => {
      const data = scrapedData[segment as keyof typeof scrapedData];
      return data && data.length > 0;
    }
  );

  console.log('Home component:', {
    hasData,
    scrapedDataKeys: Object.keys(scrapedData),
    segmentsWithData,
    selectedSegments: Array.from(selectedSegments)
  });

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-zinc-800 text-zinc-100',
          duration: 4000,
        }}
      />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
          <h1 className="text-2xl font-bold text-emerald-400">
            Bhavcopy Pro: Enterprise Edition
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Professional NSE/BSE/MCX Data Extraction & Analysis
          </p>
        </header>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stat Cards */}
          <StatCards />
          
          {/* Download Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MainConsole />
              
              {/* File Processor */}
              <FileProcessor />
            </div>
            
            <div className="space-y-6">
              <DatePicker />
              <SegmentSelector />
            </div>
          </div>
          
          {/* Data Grid - Only show if we have data */}
          {hasData && segmentsWithData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-100">
                  Data Preview
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
                  >
                    ↑ Back to Top
                  </button>
                  <ExportButton />
                </div>
              </div>
              
              {/* Render a grid for each segment with data */}
              {segmentsWithData.map((segment) => {
                return (
                  <div key={segment} className="space-y-2">
                    <h3 className="text-lg font-medium text-emerald-400">
                      {segment.replace('_', ' ')}
                    </h3>
                    <DataGrid segment={segment as any} />
                  </div>
                );
              })}
            </div>
          )}
          
          {/* System Logs */}
          <SystemLogs />
        </div>
      </div>
    </div>
  );
}
