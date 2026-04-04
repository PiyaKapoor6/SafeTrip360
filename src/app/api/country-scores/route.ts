import { NextResponse } from 'next/server';
import { getCountryScore } from '@/lib/safetyCalculator';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    try {
        // Fetch all countries from REST Countries API
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital,region,population,timezones');
        const countries = await response.json();

        if (code) {
            const country = countries.find((c: any) => c.cca2.toUpperCase() === code.toUpperCase());
            if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });

            const baseScore = await getCountryScore(country.cca2, country.region);

            // Fetch live news
            let news = [];
            if (NEWS_API_KEY) {
                try {
                    const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(country.name.common)}+safety+travel&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`);
                    const newsData = await newsRes.json();
                    news = newsData.articles || [];
                } catch (e) { console.error("News fetch failed", e); }
            }

            // Fetch live weather
            let weather = null;
            if (OPENWEATHER_KEY && country.capital?.[0]) {
                try {
                    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(country.capital[0])},${country.cca2}&units=metric&appid=${OPENWEATHER_KEY}`);
                    weather = await weatherRes.json();
                } catch (e) { console.error("Weather fetch failed", e); }
            }

            return NextResponse.json({
                ...country,
                name: country.name.common,
                iso: country.cca2,
                flag: country.flags.svg || country.flags.png,
                capital: country.capital?.[0] || 'N/A',
                safetyScore: baseScore.overall,
                disasterRisk: baseScore.disaster,
                airQuality: baseScore.air,
                crimeLevel: baseScore.crime,
                politicalUnrest: baseScore.political,
                news,
                weather
            });
        }

        // Return all 195 countries with base scores
        const enrichedCountries = await Promise.all(countries.map(async (c: any) => {
            const score = await getCountryScore(c.cca2, c.region);
            return {
                name: c.name.common,
                iso: c.cca2,
                flag: c.flags.svg || c.flags.png,
                capital: c.capital?.[0] || 'N/A',
                region: c.region,
                population: c.population.toLocaleString(),
                timezone: c.timezones?.[0] || 'UTC',
                safetyScore: score.overall,
                disasterRisk: score.disaster,
                airQuality: score.air,
                crimeLevel: score.crime,
                politicalUnrest: score.political,
            };
        }));

        return NextResponse.json(enrichedCountries);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const revalidate = 3600; // Cache for 1 hour
