export interface RankedCity {
    rank: number;
    city: string;
    country: string;
    flag: string;
    overall: number;
    disaster: number;
    air: number;
    crime: number;
    political: number;
    region: string;
}

export const rankedCities: RankedCity[] = [
    { rank: 1, city: "Ottawa", country: "Canada", flag: "🇨🇦", overall: 90, disaster: 75, air: 88, crime: 88, political: 95, region: "Americas" },
    { rank: 2, city: "Perth", country: "Australia", flag: "🇦🇺", overall: 89, disaster: 60, air: 92, crime: 87, political: 92, region: "Oceania" },
    { rank: 3, city: "Calgary", country: "Canada", flag: "🇨🇦", overall: 89, disaster: 78, air: 90, crime: 89, political: 95, region: "Americas" },
    { rank: 4, city: "Adelaide", country: "Australia", flag: "🇦🇺", overall: 88, disaster: 62, air: 91, crime: 86, political: 92, region: "Oceania" },
    { rank: 5, city: "Melbourne", country: "Australia", flag: "🇦🇺", overall: 87, disaster: 65, air: 90, crime: 87, political: 92, region: "Oceania" },
    { rank: 6, city: "Vancouver", country: "Canada", flag: "🇨🇦", overall: 87, disaster: 72, air: 88, crime: 85, political: 95, region: "Americas" },
    { rank: 7, city: "Edinburgh", country: "United Kingdom", flag: "🇬🇧", overall: 85, disaster: 82, air: 78, crime: 84, political: 88, region: "Europe" },
    { rank: 8, city: "Kyoto", country: "Japan", flag: "🇯🇵", overall: 87, disaster: 42, air: 85, crime: 95, political: 90, region: "Asia" },
    { rank: 9, city: "Tokyo", country: "Japan", flag: "🇯🇵", overall: 84, disaster: 40, air: 82, crime: 95, political: 90, region: "Asia" },
    { rank: 10, city: "Sydney", country: "Australia", flag: "🇦🇺", overall: 86, disaster: 58, air: 90, crime: 85, political: 92, region: "Oceania" },
    { rank: 11, city: "Munich", country: "Germany", flag: "🇩🇪", overall: 85, disaster: 80, air: 80, crime: 88, political: 90, region: "Europe" },
    { rank: 12, city: "Zurich", country: "Switzerland", flag: "🇨🇭", overall: 90, disaster: 85, air: 88, crime: 92, political: 95, region: "Europe" },
    { rank: 13, city: "Copenhagen", country: "Denmark", flag: "🇩🇰", overall: 89, disaster: 84, air: 86, crime: 90, political: 94, region: "Europe" },
    { rank: 14, city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", overall: 84, disaster: 80, air: 78, crime: 82, political: 90, region: "Europe" },
    { rank: 15, city: "Wellington", country: "New Zealand", flag: "🇳🇿", overall: 86, disaster: 65, air: 90, crime: 88, political: 93, region: "Oceania" },
];

export const regionStats = [
    { region: "Northern Europe", avg: 87, change: "+2", trend: "up" },
    { region: "Oceania", avg: 85, change: "+1", trend: "up" },
    { region: "North America", avg: 78, change: "0", trend: "flat" },
    { region: "Western Europe", avg: 76, change: "+1", trend: "up" },
    { region: "East Asia", avg: 70, change: "+3", trend: "up" },
    { region: "South America", avg: 52, change: "-1", trend: "down" },
    { region: "South Asia", avg: 48, change: "+2", trend: "up" },
    { region: "Eastern Europe", avg: 45, change: "+5", trend: "up" },
    { region: "Middle East", avg: 28, change: "-2", trend: "down" },
    { region: "Central Africa", avg: 31, change: "-1", trend: "down" },
];

export const worldStats = {
    worldAvg: 61,
    safestRegion: "Northern Europe",
    safestRegionScore: 87,
    mostImproved: "Eastern Europe",
    mostImprovedChange: "+5 this month",
    highestRisk: "Middle East",
    highestRiskScore: 28,
    totalCountries: 195,
    totalCities: 10000,
};

export const popularDestinations = [
    { name: "Paris", country: "France", flag: "🇫🇷", score: 79, highlight: "Culture & History" },
    { name: "Tokyo", country: "Japan", flag: "🇯🇵", score: 84, highlight: "Ultra-safe & Modern" },
    { name: "Dubai", country: "UAE", flag: "🇦🇪", score: 80, highlight: "Luxury & Safety" },
    { name: "New York", country: "United States", flag: "🇺🇸", score: 68, highlight: "Iconic Metropolis" },
    { name: "London", country: "United Kingdom", flag: "🇬🇧", score: 74, highlight: "Heritage & Culture" },
    { name: "Sydney", country: "Australia", flag: "🇦🇺", score: 86, highlight: "Beaches & Nature" },
];
