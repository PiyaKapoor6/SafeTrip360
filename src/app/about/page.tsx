"use client";

import PageLayout from "@/components/PageLayout";
import { Shield, Globe, Database, Cpu, Users, Zap } from "lucide-react";

const STATS = [
    { label: "Countries Monitored", value: "195", icon: <Globe className="w-5 h-5" /> },
    { label: "Cities Tracked", value: "10,000+", icon: <Shield className="w-5 h-5" /> },
    { label: "Safety Datasets", value: "8+", icon: <Database className="w-5 h-5" /> },
    { label: "Live Sensors", value: "25,000+", icon: <Zap className="w-5 h-5" /> },
];

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Real-Time Data Collection",
        desc: "We continuously pull data from NASA EONET disaster feeds, USGS seismic sensors, OpenAQ air quality monitors, and NewsAPI for geopolitical events — all updated every 5 minutes.",
        color: "#8B5CF6",
        icon: "📡",
    },
    {
        step: "02",
        title: "Weighted Safety Algorithm",
        desc: "Our proprietary algorithm calculates composite safety scores using weighted factors: Disaster (25%) + Crime (25%) + Air Quality (20%) + Political (20%) + Weather (10%) = final score.",
        color: "#6EE7F9",
        icon: "⚙️",
    },
    {
        step: "03",
        title: "AI-Powered Recommendations",
        desc: "Using OpenAI's models, SafeTrip360 generates personalized travel alternatives, risk assessments, and dynamic safety checklists tailored to your trip type and destination.",
        color: "#F6C177",
        icon: "🤖",
    },
];

const SCORE_WEIGHTS = [
    { label: "Disaster Risk", pct: 25, color: "#FF4D6D" },
    { label: "Crime Index", pct: 25, color: "#FF4D6D" },
    { label: "Air Quality", pct: 20, color: "#6EE7F9" },
    { label: "Political Stability", pct: 20, color: "#8B5CF6" },
    { label: "Weather Risk", pct: 10, color: "#F6C177" },
];

export default function AboutPage() {
    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* ── Hero ── */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                        style={{ borderColor: "rgba(110,231,249,0.25)", background: "rgba(110,231,249,0.06)" }}>
                        <Shield className="w-4 h-4" style={{ color: "#6EE7F9" }} />
                        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6EE7F9" }}>Safety Intelligence Platform</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4">About SafeTrip360</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        SafeTrip360 aggregates real-time data from NASA, USGS, global news APIs, and air quality networks
                        to provide the most comprehensive travel safety intelligence platform ever built.
                    </p>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
                    {STATS.map(({ label, value, icon }) => (
                        <div
                            key={label}
                            className="rounded-2xl p-6 border text-center transition-all hover:scale-[1.03]"
                            style={{ background: "#111118", borderColor: "#222230" }}
                        >
                            <div className="flex justify-center mb-3 text-slate-500">{icon}</div>
                            <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>

                {/* ── How It Works ── */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-10">How SafeTrip360 Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {HOW_IT_WORKS.map(({ step, title, desc, color, icon }) => (
                            <div
                                key={step}
                                className="rounded-3xl p-8 border relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                                style={{ background: "#111118", borderColor: `${color}25` }}
                            >
                                {/* Big step number in background */}
                                <div
                                    className="absolute top-4 right-5 text-7xl font-black opacity-[0.05] pointer-events-none"
                                    style={{ color }}
                                >
                                    {step}
                                </div>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                                >
                                    {icon}
                                </div>
                                <div
                                    className="text-xs font-bold tracking-widest uppercase mb-2"
                                    style={{ color }}
                                >
                                    Step {step}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Score Methodology ── */}
                <div className="rounded-3xl p-10 border mb-20" style={{ background: "#111118", borderColor: "#222230" }}>
                    <h2 className="text-3xl font-bold text-white mb-2">Safety Score Methodology</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        Our composite score is derived from five independently researched data streams, each weighted by
                        statistical impact on traveller safety outcomes.
                    </p>

                    <div className="flex flex-col gap-4 mb-8">
                        {SCORE_WEIGHTS.map(({ label, pct, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-slate-300 font-medium">{label}</span>
                                    <span className="font-bold" style={{ color }}>{pct}%</span>
                                </div>
                                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${pct * 4}%`, background: color, boxShadow: `0 0 10px ${color}44` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual total */}
                    <div
                        className="flex flex-wrap gap-2 p-4 rounded-xl border"
                        style={{ borderColor: "rgba(110,231,249,0.2)", background: "rgba(110,231,249,0.04)" }}
                    >
                        {SCORE_WEIGHTS.map(({ label, pct, color }) => (
                            <div key={label} className="flex items-center gap-1.5 text-xs">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                <span className="text-slate-400">{label} ({pct}%)</span>
                                <span className="text-slate-600">+</span>
                            </div>
                        ))}
                        <span className="text-xs font-bold" style={{ color: "#6EE7F9" }}>= Safety Score / 100</span>
                    </div>
                </div>

            </div>
        </PageLayout>
    );
}
