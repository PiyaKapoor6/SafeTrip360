"use client";

import { useEffect, useState } from "react";
import { User, Settings, Shield, History, MapPin, ShieldAlert, CheckCircle2, Loader2, LogOut } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { createClient } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Review {
    id: string;
    country_name: string;
    status: 'safe' | 'threat';
    content: string;
    created_at: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            // Fetch reviews
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (!error) setReviews(data || []);
            setLoading(false);
        };

        checkUser();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-[300px_1fr] gap-8">

                    {/* Sidebar Profile Card */}
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-white/10 p-8 text-center"
                            style={{ background: "#111118" }}>
                            <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-tr from-[#00ff88] to-[#0088ff] p-1 shadow-[0_0_32px_rgba(0,255,136,0.2)]">
                                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-slate-500" />
                                    )}
                                </div>
                            </div>
                            <h1 className="text-xl font-bold text-white mb-1">{user?.user_metadata?.full_name || 'Anonymous User'}</h1>
                            <p className="text-sm text-slate-500 mb-8">{user?.email}</p>

                            <div className="flex flex-col gap-2">
                                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 text-white text-sm font-medium border border-white/5 transition-colors hover:bg-white/10 text-left">
                                    <Settings className="w-4 h-4 text-slate-500" />
                                    Account Settings
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500/5 text-red-500 text-sm font-semibold border border-red-500/10 transition-colors hover:bg-red-500/10 text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Safety Score Card */}
                        <div className="rounded-3xl border border-white/10 p-6 flex items-center gap-4"
                            style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,136,255,0.05) 100%)" }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}>
                                <Shield className="w-6 h-6 text-[#00ff88]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">Expert</p>
                                <p className="text-xs text-[#00ff88] font-bold tracking-widest uppercase">Safe Traveler Status</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">My Live Journeys</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Your personal history of safety reviews and reported encounters across the globe.
                                </p>
                            </div>
                            <Link href="/">
                                <button className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-[#0a0a0f] text-sm font-bold shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all hover:scale-105 active:scale-95">
                                    Add New Review
                                </button>
                            </Link>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((item) => (
                                    <div key={item.id} className="rounded-2xl border border-white/10 p-6 bg-[#111118] transition-all hover:border-white/20">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'safe' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {item.status === 'safe' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 text-slate-500" />
                                                        <p className="font-bold text-white">{item.country_name}</p>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                                                        {new Date(item.created_at).toLocaleDateString()} · Live Update
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'safe' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {item.status} REPORT
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">
                                            &ldquo;{item.content}&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-white/10 p-20 text-center">
                                <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium mb-1">No journeys reported yet.</p>
                                <p className="text-slate-600 text-sm">Start your journey by clicking a country on the map!</p>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </PageLayout>
    );
}
