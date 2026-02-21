'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function SettingsPage() {
  const { clearLogs } = useStore();
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

  const handleClearCache = () => {
    localStorage.clear();
    alert('Cache cleared! Please refresh the page.');
  };

  const handleClearLogs = () => {
    clearLogs();
    alert('Logs cleared successfully!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-emerald-400">
            Settings
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* API Configuration */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Backend API URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="http://localhost:8000"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Current: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                </p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-zinc-200">Clear Browser Cache</h3>
                  <p className="text-sm text-zinc-500">Remove all cached data and reset to defaults</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear Cache
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-zinc-200">Clear Activity Logs</h3>
                  <p className="text-sm text-zinc-500">Remove all activity history</p>
                </div>
                <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>

          {/* Default Segments */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Default Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium text-zinc-200 mb-2">Default Segment</h3>
                <p className="text-sm text-zinc-500 mb-3">Currently set to: NSE F&O</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="segment" value="NSE_FO" defaultChecked className="text-emerald-500" />
                    <span className="text-zinc-300">NSE F&O (Futures & Options)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="segment" value="NSE_CASH" className="text-emerald-500" />
                    <span className="text-zinc-300">NSE Cash (Equity)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="segment" value="MCX" className="text-emerald-500" />
                    <span className="text-zinc-300">MCX (Commodity)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <p><strong className="text-zinc-200">Version:</strong> 1.0.0</p>
              <p><strong className="text-zinc-200">Backend:</strong> FastAPI + Python</p>
              <p><strong className="text-zinc-200">Frontend:</strong> Next.js + React</p>
              <p><strong className="text-zinc-200">Data Source:</strong> Samco Bhavcopy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
