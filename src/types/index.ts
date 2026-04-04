export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    type: string;
    source: string;
    url: string;
    publishedAt: string;
    urlToImage?: string | null;
    location?: string;
    affectedLocation?: string;
}

export interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
    weatherRisk: number;
}

export interface SafetyScore {
    overall: number;
    disaster: number;
    airQuality: number;
    crime: number;
    political: number;
    weather: number;
    lastUpdated: string;
    aiInsight: string;
    newsAlerts?: any[];
    weatherData?: WeatherData;
}

export interface CityData {
    name: string;
    score: number;
    pop: string;
    risk: string;
}

export interface CountryData {
    name: string;
    iso: string;
    flag: string;
    capital: string;
    region: string;
    population: string;
    timezone: string;
    safetyScore: number;
    disasterRisk: number;
    airQuality: number;
    crimeLevel: number;
    politicalUnrest: number;
    weatherRisk: number;
    cities: CityData[];
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}
