"use client";

import { useStore } from "@/lib/store";

export default function DatePicker() {
  const { selectedDate, setSelectedDate } = useStore();

  // Format date for input (YYYY-MM-DD) - use local timezone
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date for max date
  const today = new Date();
  const maxDate = formatDateForInput(today);

  // Set minimum date to January 1, 2020
  const minDate = "2020-01-01";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value; // YYYY-MM-DD format
    // Parse date in local timezone to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const newDate = new Date(year, month - 1, day); // month is 0-indexed
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Select Date</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-2">
            Trading Date
          </label>
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            min={minDate}
            max={maxDate}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="text-xs text-zinc-500">
          <p>📅 Historical: Jan 2020 - May 2024</p>
          <p className="mt-1 text-emerald-400">
            ✨ Current: 2025-2026 (After market close)
          </p>
          <p className="mt-2 text-amber-400">
            ⏰ Today's data available after 6:00 PM IST
          </p>
          <p className="mt-2">
            Selected: {selectedDate.getDate()}-{selectedDate.toLocaleString('en-US', { month: 'short' })}-{selectedDate.getFullYear()}, {selectedDate.toLocaleString('en-US', { weekday: 'short' })}
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
            }}
            className="w-full text-xs text-emerald-400 hover:text-emerald-300 transition-colors text-left"
          >
            📍 Today ({new Date().getDate()}-{new Date().toLocaleString('en-US', { month: 'short' })}-{new Date().getFullYear()})
          </button>
          <button
            onClick={() => {
              const feb13 = new Date(2026, 1, 13); // Feb 13, 2026 (month is 0-indexed)
              setSelectedDate(feb13);
            }}
            className="w-full text-xs text-zinc-400 hover:text-zinc-300 transition-colors text-left"
          >
            🕐 Feb 13, 2026 (Latest with F&O Data)
          </button>
        </div>
      </div>
    </div>
  );
}
