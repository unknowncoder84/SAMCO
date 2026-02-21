'use client';

import { useStore, type Segment } from '@/lib/store';

const SEGMENTS: { id: Segment; label: string; description: string }[] = [
  { id: 'NSE_CASH', label: 'NSE Cash', description: 'Equity cash market' },
  { id: 'NSE_FO', label: 'NSE F&O', description: 'Futures & Options' },
  { id: 'MCX', label: 'MCX', description: 'Commodity market' },
];

export default function SegmentSelector() {
  const { selectedSegments, toggleSegment } = useStore();

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Select Segments</h3>
      <div className="space-y-3">
        {SEGMENTS.map((segment) => (
          <label
            key={segment.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedSegments.has(segment.id)}
              onChange={() => toggleSegment(segment.id)}
              className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
            />
            <div className="flex-1">
              <p className="text-zinc-100 font-medium">{segment.label}</p>
              <p className="text-sm text-zinc-500">{segment.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
