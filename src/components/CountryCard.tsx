"use client";

import { Shield, MapPin, ChevronRight } from "lucide-react";
import { getSafetyColor, getSafetyLabel } from "@/app/data/safetyData";

interface CountryCardProps {
    country: any;
    onClick?: () => void;
}

export default function CountryCard({ country, onClick }: CountryCardProps) {
    const safetyColor = getSafetyColor(country.safetyScore);
    const safetyLabel = getSafetyLabel(country.safetyScore);

    return (
        <div
            onClick={onClick}
            className="group relative rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-md overflow-hidden bg-white/5 border border-white/10">
                        {country.flag?.startsWith('http') ? (
                            <img src={country.flag} alt={country.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl filter drop-shadow-md flex items-center justify-center h-full">{country.flag}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors uppercase tracking-tight">
                            {country.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-500">{country.capital} · {country.region}</span>
                        </div>
                    </div>
                </div>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:rotate-12"
                    style={{ background: `${safetyColor}15`, borderColor: `${safetyColor}30` }}
                >
                    <Shield className="w-5 h-5" style={{ color: safetyColor }} />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Safety Index</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black" style={{ color: safetyColor }}>{country.safetyScore}</span>
                        <span className="text-xs text-slate-600 font-medium">/ 100</span>
                    </div>
                    <p className="text-[9px] text-slate-700 mt-2 uppercase font-bold tracking-tighter">GPI + IQAir + Numbeo</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-tighter"
                        style={{ color: safetyColor, borderColor: `${safetyColor}44`, background: `${safetyColor}08` }}
                    >
                        {safetyLabel}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
                </div>
            </div>

            {/* Subtle progress bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
                <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ width: `${country.safetyScore}%`, background: safetyColor }}
                />
            </div>
        </div>
    );
}
