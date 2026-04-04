import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City not found" });
  }

  const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  let airQuality = 50; // Fallback value
  let pollution = "Unknown";
  let teleportScore = null;
  let statsCategories = [];

  // Fetch from OpenWeather for Air Quality
  if (OPENWEATHER_KEY) {
    try {
      // First get coordinates
      const geoRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${OPENWEATHER_KEY}`
      );
      
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.coord) {
          // Then get pollution data
          const aqiRes = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${geoData.coord.lat}&lon=${geoData.coord.lon}&appid=${OPENWEATHER_KEY}`
          );
          
          if (aqiRes.ok) {
            const aqiData = await aqiRes.json();
            const aqi = aqiData.list?.[0]?.main?.aqi;
            
            if (aqi) {
              const pollutionMap: Record<number, { score: number; label: string }> = {
                1: { score: 95, label: "Good" },
                2: { score: 80, label: "Fair" },
                3: { score: 60, label: "Moderate" },
                4: { score: 40, label: "Poor" },
                5: { score: 20, label: "High" },
              };

              if (pollutionMap[aqi]) {
                airQuality = pollutionMap[aqi].score;
                pollution = pollutionMap[aqi].label;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("OpenWeather API error in cityStats:", error);
    }
  }

  // Fetch Teleport API for quality of life scores
  try {
    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); // Slugify city name
    const teleportRes = await fetch(
      `https://api.teleport.org/api/urban_areas/slug:${slug}/scores/`
    );

    if (teleportRes.ok) {
      const teleportData = await teleportRes.json();
      teleportScore = teleportData.teleport_city_score;
      statsCategories = teleportData.categories;
    }
  } catch (error) {
    console.error("Teleport API error in cityStats:", error);
  }

  return NextResponse.json({
    city,
    airQuality,
    pollution,
    teleportScore,
    statsCategories,
  });
}
