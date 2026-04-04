import { WeatherData } from "@/types";
import { countryBaseScores, BaseScore } from "./countryBaseScores";

export function calculateWeatherRisk(temp: number, windSpeed: number, condition: string): number {
    let risk = 20; // Base normal risk as per PRD
    const conditionLower = condition.toLowerCase();

    // Condition checks
    if (conditionLower.includes('storm') || conditionLower.includes('tornado') || conditionLower.includes('hurricane') || conditionLower.includes('cyclone')) {
        return 95; // Critical
    }

    if (conditionLower.includes('snow') || conditionLower.includes('rain') || conditionLower.includes('thunder')) {
        risk += 15;
    }

    // Extreme temp checks (>40 or <0) as per PRD
    if (temp < 0 || temp > 40) {
        risk += 40;
    } else if (temp < 5 || temp > 35) {
        risk += 15;
    }

    // Wind speed check (>50kmh = 13.8 m/s)
    const windKmh = windSpeed * 3.6;
    if (windKmh > 50) {
        risk += 30;
    } else if (windKmh > 30) {
        risk += 10;
    }

    return Math.min(risk, 100);
}

export const KEYWORDS_BULL = ["peace", "stable", "safe", "tourism", "development", "growth", "agreement", "ceasefire", "recovery"];
export const KEYWORDS_BEAR = ["war", "conflict", "attack", "bomb", "protest", "riot", "flood", "earthquake", "tsunami", "hurricane", "epidemic", "explosion", "shooting", "terror"];

export function calculatePoliticalSentiment(articles: any[]): { score: number; hasCritical: boolean } {
    let score = 70; // Base political score as per PRD
    let hasCritical = false;

    articles.forEach((article: any) => {
        const text = `${article.title} ${article.description}`.toLowerCase();

        KEYWORDS_BULL.forEach(kw => {
            if (text.includes(kw)) score += 2;
        });

        KEYWORDS_BEAR.forEach(kw => {
            if (text.includes(kw)) {
                score -= 3;
                if (["war", "tsunami", "earthquake", "terror"].includes(kw)) {
                    hasCritical = true;
                }
            }
        });
    });

    return {
        score: Math.max(0, Math.min(100, score)),
        hasCritical
    };
}

export function calculateOverallSafetyScore(
    disasterRisk: number,
    crimeLevel: number,
    airQuality: number,
    politicalRisk: number,
    weatherRisk: number,
    hasCriticalNews: boolean
): number {
    const disasterContribution = (100 - disasterRisk) * 0.25;
    const crimeContribution = crimeLevel * 0.25;
    const airContribution = airQuality * 0.20;
    const politicalContribution = politicalRisk * 0.20;
    const weatherContribution = (100 - weatherRisk) * 0.10;

    let total = disasterContribution + crimeContribution + airContribution + politicalContribution + weatherContribution;

    if (hasCriticalNews) {
        total = Math.min(total, 40);
    }

    return Math.round(Math.max(0, Math.min(100, total)));
}

const REGIONAL_AVERAGES: Record<string, BaseScore> = {
    "Africa": { overall: 45, disaster: 45, air: 50, crime: 40, political: 40 },
    "Americas": { overall: 65, disaster: 55, air: 70, crime: 55, political: 65 },
    "Asia": { overall: 60, disaster: 50, air: 45, crime: 65, political: 60 },
    "Europe": { overall: 82, disaster: 78, air: 78, crime: 80, political: 85 },
    "Oceania": { overall: 85, disaster: 65, air: 88, crime: 85, political: 90 },
};

export async function getCountryScore(code: string, region?: string): Promise<BaseScore> {
    const base = countryBaseScores[code.toUpperCase()];
    if (base) return base;

    // Fallback to regional average
    if (region && REGIONAL_AVERAGES[region]) {
        return REGIONAL_AVERAGES[region];
    }

    // Default global average if everything else fails
    return { overall: 60, disaster: 50, air: 60, crime: 60, political: 60 };
}
