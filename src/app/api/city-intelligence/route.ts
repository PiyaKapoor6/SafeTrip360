import { NextResponse } from 'next/server';
import { getCountryScore, calculateWeatherRisk, calculatePoliticalSentiment, calculateOverallSafetyScore } from '@/lib/safetyCalculator';

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
                if (weatherRes.ok) {
                    weather = await weatherRes.json();
                } else {
                    console.error("OpenWeather API error:", weatherRes.statusText);
                }
            } catch (e) { console.error("Weather fetch failed", e); }
        }

        if (!weather || !weather.main) {
            weather = {
                main: { temp: 22, humidity: 50 },
                weather: [{ main: "Clear", description: "clear sky" }],
                wind: { speed: 5 }
            };
        }

        // 3. Fetch Live News for City
        let news = [];
        if (NEWS_API_KEY) {
            try {
                const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(cityName)}+safety+travel&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`);
                if (newsRes.ok) {
                    const newsData = await newsRes.json();
                    news = newsData.articles || [];
                } else {
                    console.error("News API error:", newsRes.statusText);
                }
            } catch (e) { console.error("News fetch failed", e); }
        }

        // 4. Calculate Live Actionable Modifiers
        let liveAirQuality = baseScore.air;
        let weatherRisk = 20;

        if (weather && weather.coord && OPENWEATHER_KEY) {
            try {
                const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${OPENWEATHER_KEY}`);
                if (aqiRes.ok) {
                    const aqiData = await aqiRes.json();
                    const aqi = aqiData.list?.[0]?.main?.aqi;
                    if (aqi) {
                        const aqiMap: Record<number, number> = { 1: 95, 2: 80, 3: 60, 4: 40, 5: 20 };
                        liveAirQuality = aqiMap[aqi] || baseScore.air;
                    }
                }
            } catch (e) {
                console.error("AQI fetch failed", e);
            }
            const temp = weather.main?.temp ?? 22;
            const wind = weather.wind?.speed ?? 5;
            const cond = weather.weather?.[0]?.main ?? "Clear";
            weatherRisk = calculateWeatherRisk(temp, wind, cond);
        }

        const { score: newsSentiment, hasCritical } = calculatePoliticalSentiment(news);
        const livePoliticalUnrest = Math.max(0, Math.min(100, Math.round((baseScore.political * 0.6) + (newsSentiment * 0.4))));
        const liveDisasterRisk = Math.max(10, Math.min(100, Math.round(baseScore.disaster - (weatherRisk * 0.3))));
        const liveSafetyScore = calculateOverallSafetyScore(liveDisasterRisk, baseScore.crime, liveAirQuality, livePoliticalUnrest, weatherRisk, hasCritical);

        return NextResponse.json({
            city: cityName,
            country: country.name.common,
            iso: country.cca2,
            flag: country.flags.svg || country.flags.png,
            region: country.region,
            timezone: country.timezones?.[0] || 'UTC',
            safetyScore: liveSafetyScore,
            disasterRisk: liveDisasterRisk,
            airQuality: liveAirQuality,
            crimeLevel: baseScore.crime,
            politicalUnrest: livePoliticalUnrest,
            news,
            weather
        });

    } catch (error: any) {
        console.error("City Intelligence API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
