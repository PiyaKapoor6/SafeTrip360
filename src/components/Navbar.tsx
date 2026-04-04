"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Travel Planner", href: "/travel-planner" },
    { label: "Alerts", href: "/alerts" },
    { label: "About", href: "/about" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [timeStr, setTimeStr] = useState("");
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        };
        update();
        const id = setInterval(update, 30_000);

        // Auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            clearInterval(id);
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setMobileOpen(false);
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
            style={{ background: "rgba(10,10,15,0.82)", backdropFilter: "blur(24px)" }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{
                            background: "linear-gradient(135deg, rgba(110,231,249,0.15), rgba(139,92,246,0.1))",
                            border: "1px solid rgba(110,231,249,0.3)",
                            boxShadow: "0 0 20px rgba(110,231,249,0.12)",
                        }}
                    >
                        <Shield className="absolute w-5 h-5" style={{ color: "#6EE7F9" }} />
                        <Globe
                            className="absolute w-3 h-3 opacity-60"
                            style={{ color: "#8B5CF6", marginTop: 6, marginLeft: 6 }}
                        />
                    </div>
                    <span
                        className="text-lg font-bold tracking-tight bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(90deg, #6EE7F9, #8B5CF6)" }}
                    >
                        SafeTrip360
                    </span>
                </Link>

                {/* ── Desktop Nav ── */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/5 group"
                                        style={{ color: isActive ? "#6EE7F9" : "#94a3b8" }}
                                    >
                                        {link.label}
                                        <span
                                            className="absolute bottom-1 left-4 right-4 h-px transition-transform duration-300 origin-left"
                                            style={{
                                                background: "#6EE7F9",
                                                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                            }}
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all hover:bg-white/5 whitespace-nowrap"
                                    style={{ borderColor: "rgba(110,231,249,0.3)", color: "#6EE7F9" }}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="text-xs text-slate-500 hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login?mode=signup"
                                className="px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                style={{
                                    background: "linear-gradient(135deg, #6EE7F9, #8B5CF6)",
                                    color: "#0a0a0f",
                                    boxShadow: "0 4px 16px rgba(110,231,249,0.2)",
                                }}
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Mobile toggle ── */}
                <button
                    className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t border-white/5 px-6 py-6 space-y-4"
                    style={{ background: "rgba(10,10,15,0.97)" }}
                >
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center justify-between py-3 text-sm border-b border-white/5 last:border-0 transition-colors"
                                style={{ color: isActive ? "#6EE7F9" : "#94a3b8" }}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EE7F9" }} />
                                )}
                            </Link>
                        );
                    })}

                    {/* Mobile Auth */}
                    <div className="pt-4 space-y-3">
                        {loading ? (
                            <div className="h-10 w-full bg-white/5 animate-pulse rounded-xl" />
                        ) : user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block w-full py-3 text-center rounded-xl border text-[#6EE7F9] text-sm font-bold"
                                    style={{ background: "rgba(110,231,249,0.1)", borderColor: "rgba(110,231,249,0.2)" }}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full py-3 text-center text-slate-500 text-sm font-medium"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login?mode=signup"
                                className="block w-full py-4 text-center rounded-2xl text-sm font-bold"
                                style={{ background: "linear-gradient(135deg, #6EE7F9, #8B5CF6)", color: "#0a0a0f" }}
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
