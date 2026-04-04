"use client";

import { AlertTriangle, Clock, MapPin, ExternalLink, ShieldAlert } from "lucide-react";
import { Alert } from "@/types";
import { getSeverityColor } from "@/app/data/alertsData";

interface AlertCardProps {
    alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
    const color = getSeverityColor(alert.severity as any);
    const date = new Date(alert.publishedAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div
            className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:border-white/20"
            style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: `${color}20`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.3)`
            }}
        >
            {/* Severity side accent */}
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: color }} />

            <div className="p-5 pl-7">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                            {alert.severity === 'CRITICAL' ? (
                                <ShieldAlert className="w-4 h-4" style={{ color }} />
                            ) : (
                                <AlertTriangle className="w-4 h-4" style={{ color }} />
                            )}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color }}>
                            {alert.severity} · {alert.type}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">#{alert.id.split('-')[1]}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-slate-200 transition-colors">
                    {alert.title}
                </h3>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2 font-light leading-relaxed">
                    {alert.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location || alert.affectedLocation || "Global"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-auto">
                        <span className="font-medium text-[10px] uppercase truncate max-w-[120px]">{alert.source}</span>
                    </div>
                </div>

                {alert.url && (
                    <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 p-2 rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
}
