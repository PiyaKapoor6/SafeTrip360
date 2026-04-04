"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface PageLayoutProps {
    children: React.ReactNode;
    /** Extra classes for the main content container */
    className?: string;
}

/**
 * Shared layout for all inner pages (Explore, Travel Planner, Alerts, About).
 * Provides: star-field background, sticky Navbar, scrollable body.
 */
export default function PageLayout({ children, className = "" }: PageLayoutProps) {
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const newStars = Array.from({ length: 120 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            opacity: Math.random() * 0.5 + 0.1,
            duration: `${Math.random() * 4 + 2}s`,
            delay: `${Math.random() * 6}s`,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
            {/* Star field */}
            {mounted && (
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="star"
                            style={{
                                left: star.left,
                                top: star.top,
                                width: star.width,
                                height: star.height,
                                opacity: star.opacity,
                                "--twinkle-duration": star.duration,
                                "--twinkle-delay": star.delay,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            )}

            {/* Subtle radial glow */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(110,231,249,0.04) 0%, transparent 70%)",
                }}
            />

            <Navbar />

            {/* Scrollable main content — starts below navbar */}
            <main className={`relative z-10 pt-16 ${className}`}>
                {children}
            </main>
        </div>
    );
}
