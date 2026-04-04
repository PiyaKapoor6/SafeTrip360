"use client";

import { useState, Suspense, useEffect } from "react";
import { Shield, Mail, Chrome, Facebook, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');

    const [loading, setLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(mode === 'signup');
    const [showEmailForm, setShowEmailForm] = useState(mode === 'signup');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = createClient();
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-url") ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === "";

    // Check if user is already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/');
            }
        };
        checkUser();
    }, [supabase.auth, router]);

    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
        if (isPlaceholder) {
            setError("Setup Required: Update NEXT_PUBLIC_SUPABASE_URL in .env.local before signing in.");
            return;
        }
        setLoading(provider);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Auth error", err);
            setError(err.message || "An error occurred during social login.");
            setLoading(null);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isPlaceholder) {
            setError("Setup Required: Update NEXT_PUBLIC_SUPABASE_URL in .env.local before signing in.");
            return;
        }
        setLoading("email");
        setError(null);
        setSuccess(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setSuccess("Success! Check your email for the confirmation link.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    if (error.message.includes("Invalid login credentials")) {
                        throw new Error("Invalid credentials. If you haven't created an account yet, please switch to 'Sign Up' below.");
                    }
                    throw error;
                }

                // Success! Redirect to home page
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || "Failed to authenticate.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0a0a0f" }}>
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 justify-center mb-12 group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                            background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,136,255,0.1))",
                            border: "1px solid rgba(0,255,136,0.3)",
                            boxShadow: "0 0 32px rgba(0,255,136,0.15)",
                        }}>
                        <Shield className="w-6 h-6" style={{ color: "#00ff88" }} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">SafeTrip360</span>
                </Link>

                <div className="rounded-3xl border border-white/10 p-8 md:p-10 transition-all duration-300"
                    style={{ background: "rgba(15,15,20,0.6)", backdropFilter: "blur(24px)" }}>

                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-white mb-2 transition-all">
                            {isSignUp ? "Create Account" : (showEmailForm ? "Email Login" : "Welcome Back")}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {isSignUp ? "Join the community of safe travelers." : (showEmailForm ? "Enter your credentials to continue." : "Sign in to access your personalized safety intelligence.")}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-1">
                            {success}
                        </div>
                    )}

                    {!showEmailForm ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                disabled={!!loading}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-white/5 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                            >
                                {loading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
                                Continue with Google
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('facebook')}
                                disabled={!!loading}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-white/5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-white disabled:opacity-50"
                            >
                                {loading === 'facebook' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5 fill-[#1877F2] text-[#1877F2]" />}
                                Login with Facebook
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0f14] px-4 text-slate-500 tracking-widest font-medium">Or</span></div>
                            </div>

                            <button
                                onClick={() => setShowEmailForm(true)}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                            >
                                <Mail className="w-5 h-5" />
                                Continue with Email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00ff88]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00ff88]/30 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!!loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00ff88] text-[#0a0a0f] text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {loading === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {isSignUp ? "Create My Account" : "Sign In"}
                            </button>

                            <div className="flex flex-col items-center gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError(null);
                                    }}
                                    className="text-xs text-[#00ff88] hover:underline font-medium"
                                >
                                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEmailForm(false);
                                        setIsSignUp(false);
                                        setError(null);
                                    }}
                                    className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest font-bold transition-colors"
                                >
                                    Back to Social Login
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed">
                        By signing in, you agree to our <Link href="#" className="underline hover:text-[#00ff88]">Terms of Service</Link> and <Link href="#" className="underline hover:text-[#00ff88]">Privacy Policy</Link>.
                    </p>
                </div>

                <Link href="/" className="flex items-center gap-2 justify-center mt-8 text-slate-500 hover:text-white transition-colors text-sm font-medium group">
                    <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                    Back to World Map
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
