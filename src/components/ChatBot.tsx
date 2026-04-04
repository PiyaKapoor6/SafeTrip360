"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Minus, Maximize2 } from "lucide-react";
import { ChatMessage } from "@/types";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "assistant", content: "Hello! I'm SafeTrip360 AI. How can I help you safely plan your next journey today?", timestamp: new Date().toISOString() }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isMinimized]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = { role: "user", content: input, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!res.ok) throw new Error("Failed to chat");

            const data = await res.json();
            const aiMsg: ChatMessage = {
                role: "assistant",
                content: data.response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error("Chat error", err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm having trouble connecting to my intelligence network. Please check your connection and try again.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl group"
                style={{
                    background: "linear-gradient(135deg, #00ff88, #0088ff)",
                    boxShadow: "0 8px 32px rgba(0,255,136,0.25)"
                }}
            >
                <MessageSquare className="w-6 h-6 text-slate-900 group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div
            className={`fixed right-6 z-50 transition-all duration-300 ease-out shadow-2xl flex flex-col border border-white/10 ${isMinimized ? "bottom-6 h-16 w-72" : "bottom-6 h-[500px] w-[380px]"
                }`}
            style={{
                background: "rgba(10,12,20,0.95)",
                backdropFilter: "blur(24px)",
                borderRadius: "24px",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-none">SafeTrip360 AI</p>
                        <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Online Intelligence
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${m.role === "user" ? "bg-blue-500/10 border-blue-500/30" : "bg-green-500/10 border-green-500/30"
                                        }`}>
                                        {m.role === "user" ? <User className="w-4 h-4 text-blue-400" /> : <Bot className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                            ? "bg-blue-500/10 text-blue-50 text-right rounded-tr-none"
                                            : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border bg-green-500/10 border-green-500/30">
                                        <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                                    </div>
                                    <div className="p-3 rounded-2xl text-sm bg-white/5 text-slate-500 rounded-tl-none border border-white/5 flex items-center gap-2 italic">
                                        Analyzing intelligence...
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1 focus-within:border-green-500/50 transition-colors">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about safety..."
                                className="flex-1 bg-transparent text-sm text-white outline-none py-2 placeholder-slate-600"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-1.5 rounded-lg text-slate-900 transition-all duration-200 disabled:opacity-30 disabled:grayscale"
                                style={{ background: "linear-gradient(135deg, #00ff88, #0088ff)" }}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[9px] text-slate-600 text-center mt-3 uppercase tracking-widest font-medium">
                            Powered by SafeTrip360 Safety Intelligence
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
