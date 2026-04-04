import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';
import { getIso2 } from '@/lib/countries';

const DUMMY_NEWS = [
    {
        title: "Global Safety Index Released",
        description: "The annual global safety report highlights improvements in urban security and disaster preparedness worldwide.",
        url: "https://safetrip360.example.com",
        publishedAt: "2024-01-01T12:00:00Z",
        source: { name: "SafeTrip360 Intelligence" },
        urlToImage: null
    },
    {
        title: "Weather Advisories Updated",
        description: "Meteorological departments have updated regional weather advisories ahead of the changing season.",
        url: "https://safetrip360.example.com/weather",
        publishedAt: "2024-01-01T14:00:00Z",
        source: { name: "Global Weather Network" },
        urlToImage: null
    }
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawCountry = searchParams.get('country') || 'us';
        const country = getIso2(rawCountry);
        const q = searchParams.get('q') || 'safety';

        // 1. Try NewsData.io if key exists (Primary)
        if (ENV.NEWS_DATA_KEY) {
            try {
                const res = await fetch(
                    `https://newsdata.io/api/1/news?apikey=${ENV.NEWS_DATA_KEY}&country=${country}&q=${encodeURIComponent(q)}`,
                    { next: { revalidate: 300 } }
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        return NextResponse.json({
                            articles: data.results.map((a: any) => ({
                                title: a.title,
                                description: a.description,
                                url: a.link,
                                publishedAt: a.pubDate,
                                source: { name: a.source_id },
                                urlToImage: a.image_url
                            }))
                        });
                    }
                }
            } catch (err) {
                console.error("NewsData API Error:", err);
            }
        }

        // 2. Fallback to NewsAPI.org if key exists (Secondary)
        if (ENV.NEWS_API_KEY) {
            try {
                const headlinesRes = await fetch(
                    `https://newsapi.org/v2/top-headlines?country=${country}&q=${encodeURIComponent(q)}&apiKey=${ENV.NEWS_API_KEY}`,
                    { next: { revalidate: 300 } }
                );
                const headlinesData = await headlinesRes.json();
                if (headlinesData.articles && headlinesData.articles.length > 0) {
                    return NextResponse.json({ articles: headlinesData.articles });
                }
            } catch (err) {
                console.error("NewsAPI Error:", err);
            }
        }

        // 3. Last Resort: Dummy Data
        return NextResponse.json({ articles: DUMMY_NEWS });

    } catch (error) {
        console.error("News Route Global Error:", error);
        return NextResponse.json({ articles: DUMMY_NEWS });
    }
}
