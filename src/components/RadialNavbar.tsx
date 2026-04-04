"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Map, Bell, Info, User } from "lucide-react";

const NAV_ITEMS = [
    { id: "home", label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { id: "explore", label: "Explore", href: "/explore", icon: <Compass className="w-5 h-5" /> },
    { id: "planner", label: "Planner", href: "/travel-planner", icon: <Map className="w-5 h-5" /> },
    { id: "alerts", label: "Alerts", href: "/alerts", icon: <Bell className="w-5 h-5" /> },
    { id: "about", label: "About", href: "/about", icon: <Info className="w-5 h-5" /> },
    { id: "auth", label: "Get Started", href: "/login?mode=signup", icon: <User className="w-5 h-5" /> },
];

export default function RadialNavbar() {
    const pathname = usePathname();

    // Radius of the orbit
    const radius = 320; // px
    
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            {NAV_ITEMS.map((item, index) => {
                const isActive = pathname === item.href;
                // Calculate position on a circle
                // We offset by -90deg (or -Math.PI / 2) to start from the top
                const angle = (index / NAV_ITEMS.length) * 2 * Math.PI - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x, y }}
                        transition={{ 
                            delay: index * 0.1, 
                            duration: 0.8, 
                            type: "spring", 
                            stiffness: 70 
                        }}
                        className="absolute pointer-events-auto"
                        style={{ marginLeft: -32, marginTop: -32 }} // Center the 64x64 item
                    >
                        <Link href={item.href} className="group relative flex flex-col items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.15, boxShadow: "0 0 25px rgba(110,231,249,0.5)" }}
                                whileTap={{ scale: 0.9 }}
                                className="w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors"
                                style={{
                                    background: isActive ? "rgba(110,231,249,0.15)" : "rgba(17,17,24,0.7)",
                                    borderColor: isActive ? "rgba(110,231,249,0.5)" : "rgba(255,255,255,0.1)",
                                    color: isActive ? "#6EE7F9" : "#94a3b8",
                                    boxShadow: isActive ? "0 0 20px rgba(110,231,249,0.2)" : "none",
                                }}
                            >
                                {item.icon}
                            </motion.div>
                            {/* Label */}
                            <span 
                                className="absolute top-full mt-2 text-xs font-bold tracking-widest uppercase transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap"
                                style={{ color: isActive ? "#6EE7F9" : "#e2e8f0", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
