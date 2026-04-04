"use client";

import { useState, useEffect } from "react";
import { X, Shield, AlertTriangle, Wind, Users, Flag, CloudRain, MapPin, ChevronRight, Loader2, MessageSquare, History, Plus } from "lucide-react";
import { CountryData, getSafetyColor, getSafetyLabel, getAlternatives } from "@/app/data/safetyData";
import { getSeverityColor, AlertSeverity } from "@/app/data/alertsData";
import ReviewForm from "./ReviewForm";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface SidePanelProps {
    country: CountryData | null;
    onClose: () => void;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${value}%`, background: color }}
            />
        </div>
    );
}

export default function SidePanel({ country, onClose }: SidePanelProps) {
    const [liveData, setLiveData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    useEffect(() => {
        if (!country) {
            setLiveData(null);
            return;
        }

        async function fetchLiveIntelligence() {
            setLoading(true);
            try {
                const res = await fetch(`/api/country-scores?code=${country?.iso}`);
                if (res.ok) {
                    const data = await res.json();
                    setLiveData(data);
                }
            } catch (err) {
                console.error("Failed to fetch live safety data", err);
            } finally {
                setLoading(false);
            }
        }

        fetchLiveIntelligence();
    }, [country]);

    if (!country) return null;

    const currentScore = liveData?.safetyScore ?? country.safetyScore;
    const safetyColor = getSafetyColor(currentScore);
    const safetyLabel = getSafetyLabel(currentScore);
    const alternatives = getAlternatives(country.iso);
    const newsAlerts = liveData?.news || [];

    const indicators = [
        { label: "Disaster Risk", value: liveData?.disasterRisk ?? country.disasterRisk, icon: <AlertTriangle className="w-3.5 h-3.5" />, desc: "Natural disaster exposure" },
        { label: "Air Quality", value: liveData?.airQuality ?? country.airQuality, icon: <Wind className="w-3.5 h-3.5" />, desc: "Ambient air quality index" },
        { label: "Crime Safety", value: liveData?.crimeLevel ?? country.crimeLevel, icon: <Users className="w-3.5 h-3.5" />, desc: "Public safety from crime" },
        { label: "Political Stability", value: liveData?.politicalUnrest ?? country.politicalUnrest, icon: <Flag className="w-3.5 h-3.5" />, desc: "Government and civil stability" },
    ];

    return (
        <div
            className="fixed top-0 right-0 h-full z-40 side-panel-enter flex flex-col"
            style={{
                width: "420px",
                background: "linear-gradient(160deg, rgba(14,18,30,0.98) 0%, rgba(10,10,18,0.99) 100%)",
                backdropFilter: "blur(28px)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "-24px 0 80px rgba(0,0,0,0.6)",
            }}
        >
            {/* ── HEADER ── */}
            <div className="flex-shrink-0 px-6 pt-20 pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-md overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                            {country.flag?.startsWith('http') ? (
                                <img src={country.flag} alt={country.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl filter drop-shadow-md flex items-center justify-center h-full">{country.flag}</span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight line-clamp-1">{country.name}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span className="text-xs text-slate-500">{country.capital} · {country.region}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border border-white/5 hover:border-white/15"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                    {[
                        { label: "Pop", value: country.population },
                        { label: "TZ", value: country.timezone?.split(" ")[0] || "N/A" },
                        { label: "Live", value: loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enabled" },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <span className="text-slate-500">{label}:</span>
                            <span className="text-slate-300 font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Overall score */}
                <div
                    className="rounded-2xl p-4 border relative overflow-hidden mb-6"
                    style={{
                        background: `linear-gradient(135deg, ${safetyColor}0d 0%, ${safetyColor}05 100%)`,
                        borderColor: `${safetyColor}30`,
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: `${safetyColor}1a`, border: `1px solid ${safetyColor}40` }}
                            >
                                <Shield className="w-4.5 h-4.5" style={{ color: safetyColor }} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Overall Safety</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold" style={{ color: safetyColor }}>
                                        {currentScore}
                                    </span>
                                    <span className="text-slate-500 text-sm">/ 100</span>
                                </div>
                            </div>
                        </div>
                        <span
                            className="text-sm font-semibold px-3 py-1.5 rounded-full border"
                            style={{ color: safetyColor, borderColor: `${safetyColor}44`, background: `${safetyColor}11` }}
                        >
                            {safetyLabel}
                        </span>
                    </div>
                    <ProgressBar value={currentScore} color={safetyColor} />
                </div>

                {/* ── TABS NATIVE NAVIGATION ── */}
                <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/5">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview'
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Shield className="w-3.5 h-3.5" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'reviews'
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Live Reviews
                    </button>
                </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {activeTab === 'overview' ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* AI Insights */}
                        {liveData?.aiInsight && (
                            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">AI Safety Intelligence</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "{liveData.aiInsight}"
                                </p>
                            </div>
                        )}

                        {/* Live Weather Indicator */}
                        {liveData?.weather && (
                            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <CloudRain className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Live Weather</p>
                                        <p className="text-sm font-bold text-white">
                                            {liveData.weather.main.temp}°C · {liveData.weather.weather[0]?.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wind Speed</p>
                                    <p className="text-xs font-bold text-slate-300">{(liveData.weather.wind.speed * 3.6).toFixed(1)} km/h</p>
                                </div>
                            </div>
                        )}

                        {/* SECTION: Quick Action for Review */}
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20 group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5 text-[#00ff88]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">Share Your Journey</p>
                                    <p className="text-[11px] text-slate-500">Contribute to SafeTrip360</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* SECTION: Safety Breakdown */}
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Real-Time Indicators</p>
                            <div className="space-y-3">
                                {indicators.map((ind) => {
                                    const c = getSafetyColor(ind.value);
                                    return (
                                        <div
                                            key={ind.label}
                                            className="rounded-xl p-3.5 border transition-colors"
                                            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.025)" }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span style={{ color: c }}>{ind.icon}</span>
                                                    <span className="text-sm font-medium text-slate-300">{ind.label}</span>
                                                </div>
                                                <span className="text-sm font-bold" style={{ color: c }}>{ind.value}/100</span>
                                            </div>
                                            <ProgressBar value={ind.value} color={c} />
                                            <p className="text-xs text-slate-600 mt-1.5">{ind.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SECTION: Backend News Alerts */}
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Intelligence Feed</p>
                            {newsAlerts.length === 0 ? (
                                <div
                                    className="rounded-xl p-3.5 text-center border"
                                    style={{ borderColor: "rgba(0,255,136,0.1)", background: "rgba(0,255,136,0.03)" }}
                                >
                                    <p className="text-sm text-slate-400">✅ No critical alerts found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {newsAlerts.map((article: any, i: number) => (
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            key={i}
                                            className="block transition-all hover:translate-x-1"
                                        >
                                            <div
                                                className="rounded-xl p-3.5 border border-white/5 bg-white/2 hover:bg-white/5"
                                            >
                                                <div className="flex justify-between items-start gap-3 mb-2">
                                                    <p className="text-[13px] font-semibold text-white leading-tight line-clamp-2">
                                                        {article.title}
                                                    </p>
                                                    <span className="text-[10px] text-slate-600 whitespace-nowrap">{article.source?.name}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 mb-2 font-light">
                                                    {article.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-700">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                                    <ChevronRight className="w-3 h-3 text-slate-700" />
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        {user ? (
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-bold text-white">Authenticated Traveler</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">Your review will be shared live with the community.</p>
                                </div>
                                <ReviewForm
                                    countryCode={country.iso}
                                    countryName={country.name}
                                    onSuccess={() => setActiveTab('overview')}
                                />
                            </div>
                        ) : (
                            <div className="p-8 rounded-3xl border border-dashed border-white/10 text-center bg-white/[0.01]">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <History className="w-8 h-8 text-slate-500" />
                                </div>
                                <p className="text-white font-bold mb-2">Share Your Journey</p>
                                <p className="text-slate-500 text-xs mb-8 leading-relaxed">
                                    Sign in or create an account to share real-time safety updates and help other travelers navigate safely.
                                </p>
                                <Link
                                    href="/login?mode=signup"
                                    className="w-full inline-block px-8 py-3.5 rounded-xl bg-[#00ff88] text-[#0a0a0f] text-sm font-bold transition-all hover:scale-[1.02]"
                                >
                                    Get Started Free
                                </Link>
                                <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                                    Verified Contributions Only
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Recent Community Feed</h4>
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">Local Feed · Verified</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic font-medium leading-relaxed">
                                        &ldquo;Quiet and safe in the tourist districts. Public transport is running smoothly.&rdquo;
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0088ff]" />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">Expert Tip</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic font-medium leading-relaxed">
                                        &ldquo;Always use official taxi apps when traveling between venues at night.&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
