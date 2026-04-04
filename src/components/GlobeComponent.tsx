"use client";

import { useEffect, useRef, useCallback } from "react";
import { safetyDataMap, getSafetyColor } from "@/app/data/safetyData";
import { CountryData } from "@/app/data/safetyData";

interface GlobeComponentProps {
    onCountryClick: (country: CountryData) => void;
    onCountryHover: (country: CountryData | null, x: number, y: number) => void;
    sidePanelOpen: boolean;
}

// GeoJSON feature type from the countries dataset
interface GeoFeature {
    type: string;
    properties: {
        // naturalearth properties
        NAME?: string;
        ISO_A3?: string;
        ISO_A3_EH?: string;
        ADMIN?: string;
        // restcountries / other sources
        name?: string;
        iso_a3?: string;
    };
    geometry: object;
}

/** Build a lookup key from any of the ISO fields in the feature */
function getIso(feature: GeoFeature): string {
    return (
        feature.properties.ISO_A3 ||
        feature.properties.ISO_A3_EH ||
        feature.properties.iso_a3 ||
        ""
    ).toUpperCase();
}

/** Get display name */
function getName(feature: GeoFeature): string {
    return (
        feature.properties.ADMIN ||
        feature.properties.NAME ||
        feature.properties.name ||
        "Unknown"
    );
}

export default function GlobeComponent({
    onCountryClick,
    onCountryHover,
    sidePanelOpen,
}: GlobeComponentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeRef = useRef<any>(null);
    const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const getWidth = useCallback(() => {
        const panelWidth = sidePanelOpen ? 340 : 0;
        return window.innerWidth - panelWidth;
    }, [sidePanelOpen]);

    useEffect(() => {
        if (!containerRef.current) return;

        let destroyed = false;

        const initGlobe = async () => {
            // ── 1. Import globe.gl ──────────────────────────────────────────────
            const GlobeModule = (await import("globe.gl")).default;
            if (destroyed) return;

            const width = getWidth();
            const height = window.innerHeight;

            // ── 2. Create globe instance ─────────────────────────────────────────
            const globe = new GlobeModule(containerRef.current!)
                .width(width)
                .height(height)
                .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
                .backgroundImageUrl(null as unknown as string)
                .backgroundColor("rgba(0,0,0,0)")
                .atmosphereColor("#8B5CF6")
                .atmosphereAltitude(0.18);

            globeRef.current = globe;

            // Auto-rotate
            globe.controls().autoRotate = true;
            globe.controls().autoRotateSpeed = 0.5;
            globe.controls().enableZoom = true;
            globe.controls().minDistance = 180;
            globe.controls().maxDistance = 700;

            // ── 3. Load GeoJSON ───────────────────────────────────────────────────
            // Using Natural Earth via geojson.xyz — reliable ISO_A3 properties
            const res = await fetch(
                "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson"
            );
            const geoJson = await res.json();
            if (destroyed) return;

            // ── 4. Bind polygon data ──────────────────────────────────────────────
            globe
                .polygonsData(geoJson.features as GeoFeature[])
                .polygonCapColor((feat: object) => {
                    const f = feat as GeoFeature;
                    const iso = getIso(f);
                    const data = safetyDataMap.get(iso);
                    if (!data) return "rgba(55,65,81,0.55)";
                    const c = getSafetyColor(data.safetyScore);
                    return `${c}cc`; // slight transparency
                })
                .polygonSideColor(() => "rgba(255,255,255,0.03)")
                .polygonStrokeColor(() => "rgba(255,255,255,0.10)")
                .polygonAltitude((feat: object) => {
                    const f = feat as GeoFeature;
                    const iso = getIso(f);
                    return safetyDataMap.has(iso) ? 0.014 : 0.002;
                })
                // ── 5. Hover ──────────────────────────────────────────────────────
                .onPolygonHover(
                    (feat: object | null, _prev: object | null) => {
                        if (!feat) {
                            onCountryHover(null, 0, 0);
                            return;
                        }
                        const f = feat as GeoFeature;
                        const iso = getIso(f);
                        const name = getName(f);
                        const data = safetyDataMap.get(iso);
                        const { x, y } = mousePosRef.current;

                        if (data) {
                            onCountryHover(data, x, y);
                        } else {
                            // Show country with no safety data
                            onCountryHover(
                                {
                                    name,
                                    iso,
                                    flag: "",
                                    capital: "",
                                    region: "",
                                    population: "",
                                    timezone: "",
                                    safetyScore: -1,
                                    disasterRisk: -1,
                                    airQuality: -1,
                                    crimeLevel: -1,
                                    politicalUnrest: -1,
                                    weatherRisk: -1,
                                    cities: [],
                                },
                                x,
                                y
                            );
                        }
                    }
                )
                // ── 6. Click ──────────────────────────────────────────────────────
                .onPolygonClick((feat: object) => {
                    const f = feat as GeoFeature;
                    const iso = getIso(f);
                    const data = safetyDataMap.get(iso);
                    if (data) onCountryClick(data);
                });
        };

        initGlobe().catch(console.error);

        const handleResize = () => {
            if (globeRef.current) {
                globeRef.current.width(getWidth()).height(window.innerHeight);
            }
        };
        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            destroyed = true;
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            globeRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Adjust width when side panel opens/closes
    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.width(getWidth()).height(window.innerHeight);
        }
    }, [sidePanelOpen, getWidth]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0"
            style={{ cursor: "grab" }}
        />
    );
}
