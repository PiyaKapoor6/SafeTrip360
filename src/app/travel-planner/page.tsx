"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { getSafetyColor, getSafetyLabel } from "@/app/data/safetyData";
import { MapPin, Calendar, Users, Plane, Shield, AlertTriangle, CheckCircle, Info, Loader2, Globe, TrendingUp, ArrowRight, ArrowLeftRight, CloudRain, Activity } from "lucide-react";

type TripType = "Solo" | "Couple" | "Family" | "Business" | "Adventure";
const TRIP_TYPES: TripType[] = ["Solo", "Couple", "Family", "Business", "Adventure"];

function ScoreGauge({ score, label, size = 96 }: { score: number; label: string; size?: number }) {
    const color = getSafetyColor(score);
    const r = (size * 0.4);
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${color}44)` }}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                    style={{ fill: color, fontSize: size * 0.22, fontStretch: "condensed", fontWeight: 900, transform: "rotate(90deg)", transformOrigin: "center" }}>
                    {score}
                </text>
            </svg>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">{label}</p>
        </div>
    );
}

function CityPod({ data, title }: { data: any; title: string }) {
    if (!data) return null;
    const color = getSafetyColor(data.safetyScore);

    return (
        <div className="rounded-[2.5rem] p-8 border border-white/5 bg-[#0c0e16]/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <img src={data.flag} alt={data.country} className="w-20 h-auto grayscale" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">{title}</p>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{data.city}</h3>
                        <p className="text-xs text-slate-500 font-medium">{data.country} · {data.region}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weather</span>
                        </div>
                        <p className="text-lg font-black text-white">{data.weather?.main?.temp ?? "N/A"}°C</p>
                        <p className="text-[10px] text-slate-600 font-medium capitalize">{data.weather?.weather?.[0]?.description ?? "Unknown"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-3.5 h-3.5" style={{ color }} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index</span>
                        </div>
                        <p className="text-lg font-black text-white" style={{ color }}>{data.safetyScore}</p>
                        <p className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{getSafetyLabel(data.safetyScore)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">
                        <span>Urban Safety Indicators</span>
                        <span>Pulse</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        <ScoreGauge score={data.disasterRisk} label="Disaster" size={60} />
                        <ScoreGauge score={data.airQuality} label="Atmosphere" size={60} />
                        <ScoreGauge score={data.crimeLevel} label="Security" size={60} />
                        <ScoreGauge score={data.politicalUnrest} label="Stability" size={60} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TravelPlannerPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [dates, setDates] = useState({ start: "", end: "" });
    const [tripType, setTripType] = useState<TripType>("Solo");
    const [result, setResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!from || !to) return;
        setLoading(true);
        try {
            const [originRes, destRes] = await Promise.all([
                fetch(`/api/city-intelligence?city=${encodeURIComponent(from)}`),
                fetch(`/api/city-intelligence?city=${encodeURIComponent(to)}`)
            ]);

            const originData = await originRes.json();
            const destData = await destRes.json();

            // Calculate Travel Verdict
            const scoreDelta = destData.safetyScore - originData.safetyScore;
            let verdict = "Stability Parity";
            let verdictColor = "#ffaa00";

            if (scoreDelta > 15) {
                verdict = "Significant Safety Upgrade";
                verdictColor = "#00ff88";
            } else if (scoreDelta > 0) {
                verdict = "Marginal Safety Improvement";
                verdictColor = "#00ff88";
            } else if (scoreDelta < -15) {
                verdict = "High Alert: Security Decline";
                verdictColor = "#ff3333";
            } else if (scoreDelta < 0) {
                verdict = "Caution: Stability Decrease";
                verdictColor = "#ff3333";
            }

            setResult({
                origin: originData,
                dest: destData,
                delta: scoreDelta,
                verdict,
                verdictColor,
                days: dates.start && dates.end
                    ? Math.max(1, Math.ceil((new Date(dates.end).getTime() - new Date(dates.start).getTime()) / 86400000))
                    : 7
            });
        } catch (err) {
            console.error("City Intelligence Analysis failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* ── Header ── */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Activity className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                            Real-Time City Intelligence
                        </span>
                    </div>
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-none">City to City Planner</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Compare granular safety metrics, live weather, and news pulse between any two cities on Earth.</p>
                </div>

                {/* ── Input Form ── */}
                <div
                    className="rounded-[3rem] p-1.5 border shadow-2xl relative overflow-hidden mb-20"
                    style={{ background: "rgba(12,14,22,0.4)", borderColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex flex-col lg:flex-row items-stretch gap-1">
                        <div className="flex-1 p-8 rounded-[2.8rem] bg-white/[0.02] border border-white/5 transition-all focus-within:bg-white/[0.04]">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Origin City</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" value={from} onChange={(e) => setFrom(e.target.value)}
                                    placeholder="Enter origin city (e.g. Mumbai)"
                                    className="bg-transparent flex-1 text-2xl font-black text-white outline-none placeholder-slate-700 tracking-tight uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center -mx-4 z-10 hidden lg:flex">
                            <div className="w-12 h-12 rounded-full bg-[#00ff88] text-[#0a0a0f] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                                <ArrowLeftRight className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="flex-1 p-8 rounded-[2.8rem] bg-white/[0.02] border border-white/5 transition-all focus-within:bg-white/[0.04]">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Destination City</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
                                    <Globe className="w-5 h-5 text-[#00ff88]" />
                                </div>
                                <input
                                    type="text" value={to} onChange={(e) => setTo(e.target.value)}
                                    placeholder="Enter destination city (e.g. London)"
                                    className="bg-transparent flex-1 text-2xl font-black text-white outline-none placeholder-slate-700 tracking-tight uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 grid md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Planned Window</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border bg-white/[0.02] border-white/5">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    <input
                                        type="date" value={dates.start} onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))}
                                        className="bg-transparent flex-1 text-sm font-bold text-white outline-none"
                                        style={{ colorScheme: "dark" }}
                                    />
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-700" />
                                <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border bg-white/[0.02] border-white/5">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    <input
                                        type="date" value={dates.end} onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
                                        className="bg-transparent flex-1 text-sm font-bold text-white outline-none"
                                        style={{ colorScheme: "dark" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Travel Persona</label>
                            <div className="flex flex-wrap gap-2">
                                {TRIP_TYPES.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTripType(t)}
                                        className={`px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${tripType === t
                                                ? "border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]"
                                                : "border-white/5 bg-white/[0.01] text-slate-600"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !from || !to}
                            className="w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 hover:scale-[1.01] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                            style={{
                                background: "linear-gradient(135deg, #00ff88, #0088ff)",
                                color: "#0a0a0f",
                                boxShadow: !loading && from && to ? "0 12px 48px rgba(0,255,136,0.3)" : "none",
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Synchronizing Intelligence…
                                </>
                            ) : "Execute Comparison Flow"}
                        </button>
                    </div>
                </div>

                {/* ── Analysis Result ── */}
                {result && !loading && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">

                        {/* Comparison Verdict */}
                        <div className="flex flex-col items-center">
                            <div className="w-1 h-20 bg-gradient-to-b from-[#00ff88] to-transparent mb-8" />
                            <div className="rounded-full px-8 py-3 bg-white/5 border border-white/10 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Travel Status Verdict</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight uppercase text-center mb-4" style={{ color: result.verdictColor }}>
                                {result.verdict}
                            </h2>
                            <p className="text-slate-400 font-medium text-lg uppercase tracking-widest">{result.delta > 0 ? '+' : ''}{result.delta} Stability Points Difference</p>
                        </div>

                        {/* Dual Column Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <CityPod data={result.origin} title="Reference Origin" />
                            <CityPod data={result.dest} title="Primary Destination" />
                        </div>

                        {/* Summary & News Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 rounded-[2.5rem] p-10 border border-white/5 bg-white/[0.01]">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Journey Intelligence</h4>
                                <div className="space-y-6">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase">Trip Duration</p>
                                        <p className="text-xl font-black text-white">{result.days} Cycle Units</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase">Safety Grade</p>
                                        <p className="text-xl font-black uppercase" style={{ color: result.verdictColor }}>{getSafetyLabel(result.dest.safetyScore)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 rounded-[2.5rem] p-10 border border-[#00ff88]/10 bg-[#00ff88]/[0.02]">
                                <div className="flex items-center gap-3 mb-8">
                                    <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                                    <h4 className="text-[10px] font-bold text-[#00ff88] uppercase tracking-widest">Real-Time News Pulse · {result.dest.city}</h4>
                                </div>
                                <div className="space-y-4">
                                    {result.dest.news?.length > 0 ? (
                                        result.dest.news.slice(0, 3).map((article: any, i: number) => (
                                            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <p className="text-sm font-bold text-white leading-tight line-clamp-2">{article.title}</p>
                                                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-[#00ff88] transition-colors flex-shrink-0" />
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{article.source?.name} · {new Date(article.publishedAt).toLocaleDateString()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm font-medium italic">No critical news fragments detected in the current sector.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
