"use client";

import { useState } from "react";
import { Send, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface ReviewFormProps {
    countryCode: string;
    countryName: string;
    onSuccess?: () => void;
}

export default function ReviewForm({ countryCode, countryName, onSuccess }: ReviewFormProps) {
    const [status, setStatus] = useState<'safe' | 'threat'>('safe');
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            setMessage({ type: 'error', text: "You must be signed in to submit a review." });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('reviews')
                .insert([
                    {
                        user_id: session.user.id,
                        user_email: session.user.email,
                        country_code: countryCode,
                        country_name: countryName,
                        status: status,
                        content: review,
                        created_at: new Date().toISOString(),
                    }
                ]);

            if (error) throw error;

            setMessage({ type: 'success', text: "Your review has been shared with the community!" });
            setReview("");
            onSuccess?.();
        } catch (err: any) {
            console.error("Review submission error", err);
            setMessage({ type: 'error', text: err.message || "Failed to submit review. Ensure the database table exists." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live User Journey</span>
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setStatus('safe')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${status === 'safe'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.1)]'
                            : 'bg-white/5 border-white/5 text-slate-500'
                        }`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Place is Safe
                </button>
                <button
                    type="button"
                    onClick={() => setStatus('threat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${status === 'threat'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]'
                            : 'bg-white/5 border-white/5 text-slate-500'
                        }`}
                >
                    <ShieldAlert className="w-4 h-4" />
                    Report Threat
                </button>
            </div>

            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={status === 'safe' ? "What made your trip safe? (e.g. friendly locals, high police presence)" : "Describe the threat you encountered..."}
                required
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00ff88]/30 transition-colors resize-none"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00ff88] text-[#0a0a0f] text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Share Review
            </button>

            {message && (
                <p className={`text-center text-xs font-medium py-2 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                    {message.text}
                </p>
            )}
        </form>
    );
}
