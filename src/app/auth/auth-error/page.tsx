"use client";

import { Shield, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0a0a0f" }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <Link href="/" className="flex items-center gap-3 justify-center mb-12 group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.1))",
                            border: "1px solid rgba(239,68,68,0.3)",
                            boxShadow: "0 0 32px rgba(239,68,68,0.15)",
                        }}>
                        <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">SafeTrip360</span>
                </Link>

                <div className="rounded-3xl border border-white/10 p-8 md:p-10 text-center"
                    style={{ background: "rgba(15,15,20,0.6)", backdropFilter: "blur(24px)" }}>

                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        We couldn't verify your session. This often happens if the authentication session expired or your Supabase credentials in <code className="text-white">.env.local</code> are incorrect.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full block py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold transition-all hover:bg-white/10"
                        >
                            Try Signing In Again
                        </Link>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-slate-500 hover:text-white transition-colors text-sm font-medium group"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                            Back to World Map
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
