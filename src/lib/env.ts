export const ENV = {
    NEWS_API_KEY: (process.env.NEWS_API_KEY || '').trim(),
    NEWS_DATA_KEY: (process.env.NEWS_DATA_KEY || '').trim(),
    GOOGLE_MAPS_KEY: (process.env.GOOGLE_MAPS_KEY || '').trim(),
    OPENWEATHER_KEY: (process.env.OPENWEATHER_KEY || '').trim(),
    OPENAI_API_KEY: (process.env.OPENAI_API_KEY || '').trim(),
    SUPABASE_URL: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
    SUPABASE_ANON_KEY: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
    SUPABASE_SERVICE_ROLE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
};

