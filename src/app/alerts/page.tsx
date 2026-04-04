"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import AlertCard from "@/components/AlertCard";
import { Bell, BellRing, Loader2, Globe, Filter } from "lucide-react";
import { Alert } from "@/types";

const CATEGORIES = ["Disaster", "Weather", "Political", "Health", "Crime"];
type TabFilter = "All" | "Disaster" | "Weather" | "Political" | "Health" | "Crime";

export default function AlertsPage() {
    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        async function fetchAlerts() {
            setLoading(true);
            try {
                const res = await fetch("/api/alerts");
                if (res.ok) {
                    const data = await res.json();
                    setAlerts(data.alerts || []);
                }
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();

        // Auto refresh every 5 minutes as per PRD Section 5.3
        const interval = setInterval(fetchAlerts, 300000);
        return () => clearInterval(interval);
    }, []);

    const filtered = activeTab === "All"
        ? alerts
        : alerts.filter((a) => a.type === activeTab);

    const counts = {
        CRITICAL: alerts.filter(a => a.severity === 'CRITICAL').length,
        HIGH: alerts.filter(a => a.severity === 'HIGH').length,
        MEDIUM: alerts.filter(a => a.severity === 'MEDIUM').length,
        LOW: alerts.filter(a => a.severity === 'LOW').length,
    };

    return (
        <PageLayout>
            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* ── Header ── */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <BellRing className="w-5 h-5 animate-bounce" style={{ color: "#ff3333" }} />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#ff3333" }}>
                            Live Intelligence Feed
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">Global Threats</h1>
                            <p className="text-slate-400 text-lg font-light max-w-xl">
                                Real-time disaster, weather, and security alerts aggregated from global sensors and international news networks.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff3333]" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>
                </div>

                {/* ── Summary bar ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Critical", count: counts.CRITICAL, color: "#ff3333" },
                        { label: "High Risk", count: counts.HIGH, color: "#ff6600" },
                        { label: "Advisories", count: counts.MEDIUM, color: "#ffaa00" },
                        { label: "Watches", count: counts.LOW, color: "#0088ff" },
                    ].map(({ label, count, color }) => (
                        <div
                            key={label}
                            className="rounded-3xl p-6 border transition-all hover:bg-white/[0.02]"
                            style={{ background: "#0c0e16", borderColor: `${color}25` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                                    style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                                >
                                    {count}
                                </div>
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</div>
                            </div>
                            <p className="text-3xl font-black text-white">{count}</p>
                        </div>
                    ))}
                </div>

                {/* ── Filter & Tabs ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 py-6 border-y border-white/5">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {(["All", ...CATEGORIES] as TabFilter[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border uppercase tracking-wider"
                                style={{
                                    borderColor: activeTab === tab ? "rgba(255,255,255,0.2)" : "transparent",
                                    background: activeTab === tab ? "rgba(255,255,255,0.08)" : "transparent",
                                    color: activeTab === tab ? "#fff" : "#475569",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Showing {filtered.length} recent events</span>
                    </div>
                </div>

                {/* ── Alert Feed ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500/50" />
                        <p className="text-sm text-slate-500 font-medium tracking-widest uppercase">Fetching Global Intelligence...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {filtered.length > 0 ? (
                            filtered.map((alert) => (
                                <AlertCard key={alert.id} alert={alert} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
                                <Globe className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No alerts found for the selected category.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Subscribe ── */}
                <div
                    className="relative rounded-[2.5rem] p-12 border overflow-hidden group"
                    style={{ background: "#0c0e16", borderColor: "rgba(0,136,255,0.15)" }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Stay Informed</h2>
                        </div>
                        <p className="text-slate-400 text-lg mb-8 font-light italic">
                            Receive real-time critical security alerts directly in your inbox as they happen.
                        </p>

                        {subscribed ? (
                            <div
                                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border bg-green-500/5 border-green-500/20"
                            >
                                <span className="text-green-500 font-bold">✓ Subscribed!</span>
                                <p className="text-sm text-slate-400">Monitoring global intelligence for you.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 rounded-2xl border bg-white/[0.03] border-white/10 outline-none text-white placeholder-slate-600 focus:border-blue-500/50 transition-all font-medium"
                                />
                                <button
                                    onClick={() => email && setSubscribed(true)}
                                    className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10"
                                    style={{
                                        background: "linear-gradient(135deg, #0088ff, #0055cc)",
                                        color: "#fff",
                                    }}
                                >
                                    Subscribe
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </PageLayout>
    );
}
