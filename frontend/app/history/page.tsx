'use client';

export const dynamic = 'force-dynamic';

import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function HistoryPage() {
  const { logs, clearLogs } = useStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-emerald-400">
              History
            </h1>
          </div>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear All History
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No activity yet</p>
              <p className="text-sm mt-2">Your download and processing history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    log.level === 'error' ? 'bg-red-900/20 border-red-800' :
                    log.level === 'warning' ? 'bg-yellow-900/20 border-yellow-800' :
                    log.level === 'success' ? 'bg-green-900/20 border-green-800' :
                    'bg-zinc-800 border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-zinc-500 font-mono">
                      {log.timestamp}
                    </span>
                    <span className={`text-xs font-semibold uppercase ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warning' ? 'text-yellow-400' :
                      log.level === 'success' ? 'text-green-400' :
                      'text-blue-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="flex-1 text-sm text-zinc-300">
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
