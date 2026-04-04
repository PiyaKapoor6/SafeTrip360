"use client";

import { useState } from "react";

export default function DatePicker({ onDateChange }: { onDateChange?: (d: string) => void }) {
  const [date, setDate] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setDate(selected);
    onDateChange?.(selected);

    const today = new Date().toISOString().split("T")[0];

    if (selected < today) {
      alert("Selected date is in the past");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 select-none">
        Select Travel Date
      </label>
      <input
        type="date"
        value={date}
        onChange={handleChange}
        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-[#00ff88]/30 transition-colors caret-transparent select-none cursor-pointer [color-scheme:dark]"
      />
    </div>
  );
}
