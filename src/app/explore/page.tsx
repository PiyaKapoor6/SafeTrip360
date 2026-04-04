"use client";

import { useState, useMemo, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import CountryCard from "@/components/CountryCard";
import SidePanel from "@/components/SidePanel";
import { Search, Globe, Filter, Loader2, Compass, TrendingUp, Info } from "lucide-react";

type SafetyFilter = "all" | "safe" | "moderate" | "dangerous";
type RegionFilter = "all" | "Asia" | "Europe" | "Americas" | "Oceania" | "Africa";

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>("all");
    const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch('/api/country-scores');
                if (res.ok) {
                    const data = await res.json();
                    setCountries(data);
                }
            } catch (err) {
                console.error("Failed to fetch country scores", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const filteredCountries = useMemo(() => {
        return countries.filter((c: any) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.iso.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;

            if (safetyFilter === "safe" && c.safetyScore < 80) return false;
            if (safetyFilter === "moderate" && (c.safetyScore < 50 || c.safetyScore >= 80)) return false;
            if (safetyFilter === "dangerous" && c.safetyScore >= 50) return false;

            if (regionFilter !== "all" && c.region !== regionFilter) return false;

            return true;
        }).sort((a, b) => b.safetyScore - a.safetyScore);
    }, [search, safetyFilter, regionFilter, countries]);

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* ── Header & Search ── */}
                <div className="mb-12">
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                <Compass className="w-5 h-5 text-green-400" />
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Intelligence Discovery</h1>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Info className="w-4 h-4 text-slate-500" />
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">
                                Data Source: GPI 2024 + IQAir + Numbeo
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-[2rem] shadow-2xl">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search continents, countries, or codes..."
                                className="w-full bg-transparent pl-14 pr-6 py-5 text-white outline-none placeholder-slate-600 font-medium"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-spin" />
                            )}
                        </div>

                        <div className="flex items-center gap-2 p-2 w-full lg:w-auto">
                            <select
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value as RegionFilter)}
                                className="bg-white/5 text-slate-300 text-sm font-bold py-3 px-5 rounded-2xl border border-white/5 outline-none hover:bg-white/10 transition-colors w-full lg:w-40 appearance-none"
                            >
                                <option value="all">Everywhere</option>
                                <option value="Asia">Asia</option>
                                <option value="Europe">Europe</option>
                                <option value="Americas">Americas</option>
                                <option value="Africa">Africa</option>
                                <option value="Oceania">Oceania</option>
                            </select>

                            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                                {(["all", "safe", "moderate", "dangerous"] as SafetyFilter[]).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setSafetyFilter(f)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${safetyFilter === f ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Reach</span>
                        </div>
                        <p className="text-2xl font-black text-white">{countries.length || "..."} Countries</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">REST Countries + Real Intelligence</p>
                    </div>
                    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Safest Region</span>
                        </div>
                        <p className="text-2xl font-black text-white text-green-400">Northern Europe</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">Average Index: 88.4</p>
                    </div>
                    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3 mb-2">
                            <Filter className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Results Found</span>
                        </div>
                        <p className="text-2xl font-black text-white">{filteredCountries.length} Results</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">Based on active filters</p>
                    </div>
                </div>

                {/* ── Country Grid ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-green-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Gathering Intelligence...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
                        {filteredCountries.map((country) => (
                            <CountryCard
                                key={country.iso}
                                country={country}
                                onClick={() => setSelectedCountry(country)}
                            />
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="col-span-full py-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
                                <Globe className="w-16 h-16 text-slate-800 mx-auto mb-6 animate-pulse" />
                                <h3 className="text-2xl font-bold text-slate-500 mb-2">No matching intelligence found</h3>
                                <p className="text-slate-600 font-medium">Try broadening your search or adjusting filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <SidePanel
                country={selectedCountry}
                onClose={() => setSelectedCountry(null)}
            />
        </PageLayout>
    );
}
