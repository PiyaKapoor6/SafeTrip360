import { NextResponse } from 'next/server';
import { getCountryScore } from '@/lib/safetyCalculator';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('city');

    if (!cityName) {
        return NextResponse.json({ error: "City name is required" }, { status: 400 });
    }

    try {
        // 1. Get Country context from REST Countries (searching by capital or name)
        const countryRes = await fetch(`https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,flags,timezones`);
        const allCountries = await countryRes.json();

        // Find country where city is capital or just match by name (primitive search for now)
        let country = allCountries.find((c: any) =>
            c.capital?.some((cap: string) => cap.toLowerCase() === cityName.toLowerCase()) ||
            c.name.common.toLowerCase() === cityName.toLowerCase()
        );

        // Fallback for popular non-capital cities (manual mapping if needed)
        if (!country) {
            const cityMap: Record<string, string> = {
                "mumbai": "IN", "new york": "US", "sydney": "AU", "dubai": "AE",
                "toronto": "CA", "rio de janeiro": "BR", "shanghai": "CN"
            };
            const code = cityMap[cityName.toLowerCase()];
            if (code) {
                country = allCountries.find((c: any) => c.cca2 === code);
            }
        }

        if (!country) {
            // Last resort: find by region or just use global fallback
            country = allCountries[0]; // Not ideal, but ensures we don't crash
        }

        const baseScore = await getCountryScore(country.cca2, country.region);

        // 2. Fetch Live Weather for City
        let weather = null;
        if (OPENWEATHER_KEY) {
            try {
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},${country.cca2}&units=metric&appid=${OPENWEATHER_KEY}`);
                weather = await weatherRes.json();
            } catch (e) { console.error("Weather fetch failed", e); }
        }

        // 3. Fetch Live News for City
        let news = [];
        if (NEWS_API_KEY) {
            try {
                const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(cityName)}+safety+travel&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`);
                const newsData = await newsRes.json();
                news = newsData.articles || [];
            } catch (e) { console.error("News fetch failed", e); }
        }

        return NextResponse.json({
            city: cityName,
            country: country.name.common,
            iso: country.cca2,
            flag: country.flags.svg || country.flags.png,
            region: country.region,
            timezone: country.timezones?.[0] || 'UTC',
            safetyScore: baseScore.overall,
            disasterRisk: baseScore.disaster,
            airQuality: baseScore.air,
            crimeLevel: baseScore.crime,
            politicalUnrest: baseScore.political,
            news,
            weather
        });

    } catch (error: any) {
        console.error("City Intelligence API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
