import { NextResponse } from 'next/server';
import { getIso2 } from '@/lib/countries';
import { calculatePoliticalSentiment, calculateOverallSafetyScore } from '@/lib/safetyCalculator';

const BASE_DISASTER_RISK = 30;
const BASE_CRIME_SAFETY = 70;
const BASE_AIR_QUALITY = 80;

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url);
        const rawCountry = searchParams.get('country') || 'us';
        const country = getIso2(rawCountry);
        const city = searchParams.get('city') || 'New York';

        // 1. Fetch Weather
        const weatherUrl = `${origin}/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) console.error(`[safety-score] Weather sub-call failed (${weatherRes.status}): ${weatherUrl}`);
        const weatherData = weatherRes.ok ? await weatherRes.json() : { weatherRisk: 50 };

        // 2. Fetch News
        const newsUrl = `${origin}/api/news?country=${encodeURIComponent(country)}&q=safety OR conflict`;
        const newsRes = await fetch(newsUrl);
        if (!newsRes.ok) console.error(`[safety-score] News sub-call failed (${newsRes.status}): ${newsUrl}`);
        const newsData = newsRes.ok ? await newsRes.json() : { articles: [] };
        const articles = newsData.articles || [];

        // 3. Analyze News Sentiment (Political Risk)
        const { score: politicalScore, hasCritical: hasCriticalNews } = calculatePoliticalSentiment(articles);

        // 4. Combine Signals using the established Formula
        // We use some base values for disaster/crime/air if they aren't provided by other APIs yet
        const overallSafetyScore = calculateOverallSafetyScore(
            BASE_DISASTER_RISK,
            BASE_CRIME_SAFETY,
            BASE_AIR_QUALITY,
            politicalScore,
            weatherData.weatherRisk,
            hasCriticalNews
        );

        // AI Insight generation (Simplified version of section 4.1 in PRD)
        let aiInsight = "Conditions are stable. Favorable environment for travel.";
        if (hasCriticalNews) aiInsight = "WARNING: Critical events detected in regional news. Travel not recommended.";
        else if (weatherData.weatherRisk > 70) aiInsight = "Caution advised due to severe weather conditions in the area.";
        else if (politicalScore < 50) aiInsight = "Increased civil or geopolitical tensions found in recent reports. Remain vigilant.";

        // Output matching PRD Section 4.1
        return NextResponse.json({
            overall: overallSafetyScore,
            disaster: Math.round(100 - BASE_DISASTER_RISK), // Score out of 100
            airQuality: BASE_AIR_QUALITY,
            crime: BASE_CRIME_SAFETY,
            political: politicalScore,
            weather: Math.round(100 - weatherData.weatherRisk),
            newsAlerts: articles.slice(0, 3),
            weatherData,
            lastUpdated: new Date().toISOString(),
            aiInsight
        });

    } catch (error) {
        console.error("Safety Score API Error:", error);
        return NextResponse.json({ error: 'Failed to calculate safety score' }, { status: 500 });
    }
}
