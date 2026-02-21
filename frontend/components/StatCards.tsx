'use client';

import { useStore } from '@/lib/store';

export default function StatCards() {
  const { segmentStatuses } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {segmentStatuses.map((status) => (
        <div
          key={status.segment}
          className="bg-zinc-900 rounded-lg border border-zinc-800 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-zinc-100">
              {status.segment.replace('_', ' ')}
            </h4>
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${status.status === 'updated'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-800 text-zinc-500'
                }
              `}
            >
              {status.status === 'updated' ? '✓ Updated' : 'Pending'}
            </span>
          </div>
          {status.lastUpdate && (
            <p className="text-sm text-zinc-500">
              Last updated: {status.lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
