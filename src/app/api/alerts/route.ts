import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

const DUMMY_ALERTS = [
    {
        id: "alert-1",
        title: "Severe Storm Watch",
        description: "A severe storm watch is in effect for the Great Lakes region.",
        severity: "MEDIUM",
        type: "Weather",
        source: "Global Weather Network",
        url: "https://safetrip360.example.com",
        publishedAt: "2024-01-01T12:00:00Z",
        urlToImage: null,
        affectedLocation: "Great Lakes"
    },
    {
        id: "alert-2",
        title: "Global Safety Index Released",
        description: "Recent stability surveys show improvement in northern regions.",
        severity: "LOW",
        type: "Political",
        source: "SafeTrip360 Intelligence",
        url: "https://safetrip360.example.com",
        publishedAt: "2024-01-01T14:30:00Z",
        urlToImage: null,
        affectedLocation: "Global"
    }
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');

        if (!ENV.NEWS_API_KEY) {
            return NextResponse.json({ alerts: DUMMY_ALERTS });
        }

        let query = 'disaster OR flood OR earthquake OR hurricane OR conflict OR tsunami OR wildfire';
        if (country) {
            query = `(${query}) AND ${country}`;
        }

        const res = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${ENV.NEWS_API_KEY}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            console.error(`[alerts] NewsAPI rejected the key — HTTP ${res.status}:`, JSON.stringify(errBody));
            throw new Error(`NewsAPI error ${res.status}: ${errBody?.message || 'unknown'}`);
        }

        const data = await res.json();
        const articles = data.articles || [];

        const formattedAlerts = articles.map((article: any, index: number) => {
            const text = `${article.title} ${article.description}`.toLowerCase();
            let severity = "LOW";
            let type = "Weather";

            // PRD Severity Classification Rules
            if (text.includes('war') || text.includes('tsunami') || text.includes('magnitude 7') || text.includes('nuclear')) {
                severity = "CRITICAL";
            } else if (text.includes('flood') || text.includes('hurricane') || text.includes('conflict') || text.includes('outbreak') || text.includes('cyclone')) {
                severity = "HIGH";
            } else if (text.includes('protest') || text.includes('storm') || text.includes('wildfire') || text.includes('unrest')) {
                severity = "MEDIUM";
            }

            // Type Determination
            if (text.includes('war') || text.includes('conflict') || text.includes('protest')) {
                type = "Political";
            } else if (text.includes('outbreak') || text.includes('virus')) {
                type = "Health";
            } else if (text.includes('crime') || text.includes('shooting')) {
                type = "Crime";
            } else if (text.includes('earthquake') || text.includes('tsunami') || text.includes('wildfire') || text.includes('flood')) {
                type = "Disaster";
            }

            return {
                id: `alert-${index}`,
                title: article.title || "Unknown Alert",
                description: article.description || "",
                severity,
                type,
                source: article.source?.name || "Global News",
                url: article.url,
                publishedAt: article.publishedAt,
                urlToImage: article.urlToImage,
                affectedLocation: country || "Global"
            };
        });

        return NextResponse.json({ alerts: formattedAlerts });

    } catch (error) {
        console.error("Alerts API Error:", error);
        return NextResponse.json({ alerts: DUMMY_ALERTS });
    }
}
