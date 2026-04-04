"use client";
import { useState } from "react";
import MiniBot from "@/components/MiniBot";

export default function TravelCompare() {
  const [from, setFrom] = useState("Chandigarh");
  const [to, setTo] = useState("Chennai");
  const [data, setData] = useState<any>(null);

  const handleCompare = async () => {
    const res = await fetch(`/api/transit-api?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const json = await res.json();
    setData(json);
  };

  return (
    <main className="p-4">
      <MiniBot />

      <div className="flex gap-2 mt-4">
        <input
          className="border p-2 rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCompare}
        >
          Compare
        </button>
      </div>

      {data && (
        <>
          {data.weather && (
            <div className="mt-4 p-4 border rounded shadow bg-blue-50">
              <h2 className="font-bold">Destination Weather ({to})</h2>
              <p>Temp: {data.weather.temp}°C</p>
              <p>Condition: {data.weather.condition} - {data.weather.description}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {["car", "train", "flight"].map((mode) => (
              <div key={mode} className="border p-4 rounded shadow">
                <h2 className="font-bold uppercase">{mode}</h2>
                <p>Time: {data[mode].timeHrs?.toFixed(1)} hrs</p>
                <p>Cost: ₹{data[mode].cost}</p>
                {mode === "car" && <p>Distance: {data[mode].distanceKm?.toFixed(1)} km</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
