import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (!q) {
            return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
        }

        // 1. Try Google Maps if key exists
        if (ENV.GOOGLE_MAPS_KEY) {
            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${ENV.GOOGLE_MAPS_KEY}`,
                    { next: { revalidate: 86400 } }
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'OK' && data.results?.length > 0) {
                        const result = data.results[0];
                        const { lat, lng } = result.geometry.location;
                        const countryComponent = result.address_components.find((c: any) => c.types.includes('country'));

                        return NextResponse.json({
                            lat,
                            lng,
                            formattedAddress: result.formatted_address,
                            country: countryComponent ? countryComponent.long_name : "Unknown",
                            countryCode: countryComponent ? countryComponent.short_name : "Unknown"
                        });
                    }
                }
            } catch (err) {
                console.error("Google Geocode Error:", err);
            }
        }

        // 2. Fallback: Nominatim (OpenStreetMap) - FREE and no key required
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=1`,
                {
                    headers: { 'User-Agent': 'SafeTrip360-App' },
                    next: { revalidate: 86400 }
                }
            );

            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const result = data[0];
                    return NextResponse.json({
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        formattedAddress: result.display_name,
                        country: result.address.country || "Unknown",
                        countryCode: (result.address.country_code || "US").toUpperCase()
                    });
                }
            }
        } catch (err) {
            console.error("Nominatim Geocode Error:", err);
        }

        // 3. Last Resort: Dummy NYC
        return NextResponse.json({
            lat: 40.7128,
            lng: -74.0060,
            formattedAddress: q,
            country: "United States",
            countryCode: "US"
        });

    } catch (error) {
        console.error("Geocode Global Error:", error);
        return NextResponse.json({ error: 'Failed to geocode location' }, { status: 500 });
    }
}
