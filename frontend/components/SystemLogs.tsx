'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export default function SystemLogs() {
  const { logs, clearLogs } = useStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-rose-400';
      case 'warning':
        return 'text-amber-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">System Logs</h3>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-zinc-600 text-center py-8">
            No logs yet. Start by uploading a symbol file and running the scraper.
          </p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-zinc-600">[{log.timestamp}]</span>
                <span className={getLevelColor(log.level)}>
                  {getLevelIcon(log.level)}
                </span>
                <span className={getLevelColor(log.level)}>{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
