import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';
import { getIso2 } from '@/lib/countries';
import { calculateWeatherRisk } from '@/lib/safetyCalculator';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const rawCountry = searchParams.get('country');
        const country = rawCountry ? getIso2(rawCountry) : null;

        if (!city || !country) {
            return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
        }

        if (!ENV.OPENWEATHER_KEY) {
            return NextResponse.json({
                temperature: 25,
                humidity: 60,
                windSpeed: 10,
                condition: "Clear",
                description: "clear sky",
                weatherRisk: 20 // Based on PRD base
            });
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${ENV.OPENWEATHER_KEY}&units=metric`,
            { next: { revalidate: 1800 } } // 30 minutes cache as per PRD
        );

        if (!res.ok) {
            throw new Error(`OpenWeather API error: ${res.statusText}`);
        }

        const data = await res.json();

        const temp = data.main?.temp ?? 25;
        const humidity = data.main?.humidity ?? 50;
        const windSpeed = data.wind?.speed ?? 0;
        const weatherArray = data.weather || [];
        const condition = weatherArray[0]?.main || "Clear";
        const description = weatherArray[0]?.description || "clear sky";

        const weatherRisk = calculateWeatherRisk(temp, windSpeed, condition);

        return NextResponse.json({
            temperature: temp,
            humidity,
            windSpeed,
            condition,
            description,
            weatherRisk,
            city,
            country
        });

    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json({
            temperature: 22,
            humidity: 50,
            windSpeed: 5,
            condition: "Unknown",
            description: "weather data unavailable",
            weatherRisk: 50 // PRD fallback
        });
    }
}
