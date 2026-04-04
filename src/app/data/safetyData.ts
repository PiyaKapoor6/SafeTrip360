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

const rawCountries: CountryData[] = [
  {
    name: "United States",
    iso: "USA",
    flag: "🇺🇸",
    capital: "Washington D.C.",
    region: "Americas",
    population: "331M",
    timezone: "UTC-5 to UTC-10",
    safetyScore: 75,
    disasterRisk: 45,
    airQuality: 72,
    crimeLevel: 55,
    politicalUnrest: 85,
    weatherRisk: 60,
    cities: [
      { name: "New York", score: 68, pop: "8.3M", risk: "Crime" },
      { name: "Los Angeles", score: 65, pop: "3.9M", risk: "Earthquake" },
      { name: "Chicago", score: 62, pop: "2.7M", risk: "Crime" },
      { name: "Miami", score: 71, pop: "442K", risk: "Hurricane" },
      { name: "San Francisco", score: 70, pop: "874K", risk: "Earthquake" },
    ],
  },
  {
    name: "India",
    iso: "IND",
    flag: "🇮🇳",
    capital: "New Delhi",
    region: "Asia",
    population: "1.4B",
    timezone: "UTC+5:30",
    safetyScore: 61,
    disasterRisk: 50,
    airQuality: 35,
    crimeLevel: 60,
    politicalUnrest: 65,
    weatherRisk: 55,
    cities: [
      { name: "Mumbai", score: 58, pop: "20.6M", risk: "Flooding" },
      { name: "Delhi", score: 45, pop: "32M", risk: "Air Quality" },
      { name: "Bangalore", score: 65, pop: "12M", risk: "Traffic" },
      { name: "Chennai", score: 60, pop: "7.1M", risk: "Cyclone" },
      { name: "Kolkata", score: 55, pop: "14.8M", risk: "Flooding" },
    ],
  },
  {
    name: "United Kingdom",
    iso: "GBR",
    flag: "🇬🇧",
    capital: "London",
    region: "Europe",
    population: "67.2M",
    timezone: "UTC+0",
    safetyScore: 82,
    disasterRisk: 80,
    airQuality: 75,
    crimeLevel: 50,
    politicalUnrest: 88,
    weatherRisk: 70,
    cities: [
      { name: "London", score: 74, pop: "9M", risk: "Crime" },
      { name: "Manchester", score: 78, pop: "553K", risk: "Crime" },
      { name: "Birmingham", score: 72, pop: "1.1M", risk: "Crime" },
      { name: "Edinburgh", score: 85, pop: "524K", risk: "Weather" },
      { name: "Bristol", score: 80, pop: "467K", risk: "Flooding" },
    ],
  },
  {
    name: "Japan",
    iso: "JPN",
    flag: "🇯🇵",
    capital: "Tokyo",
    region: "Asia",
    population: "125M",
    timezone: "UTC+9",
    safetyScore: 85,
    disasterRisk: 40,
    airQuality: 82,
    crimeLevel: 95,
    politicalUnrest: 90,
    weatherRisk: 65,
    cities: [
      { name: "Tokyo", score: 84, pop: "13.9M", risk: "Earthquake" },
      { name: "Osaka", score: 83, pop: "2.7M", risk: "Earthquake" },
      { name: "Kyoto", score: 87, pop: "1.4M", risk: "Typhoon" },
      { name: "Hiroshima", score: 85, pop: "1.1M", risk: "Earthquake" },
      { name: "Sapporo", score: 82, pop: "1.9M", risk: "Snowstorm" },
    ],
  },
  {
    name: "Australia",
    iso: "AUS",
    flag: "🇦🇺",
    capital: "Canberra",
    region: "Oceania",
    population: "25.7M",
    timezone: "UTC+8 to UTC+11",
    safetyScore: 88,
    disasterRisk: 55,
    airQuality: 90,
    crimeLevel: 85,
    politicalUnrest: 92,
    weatherRisk: 60,
    cities: [
      { name: "Sydney", score: 86, pop: "5.3M", risk: "Bushfire" },
      { name: "Melbourne", score: 87, pop: "5M", risk: "Heatwave" },
      { name: "Brisbane", score: 83, pop: "2.5M", risk: "Flooding" },
      { name: "Perth", score: 89, pop: "2.1M", risk: "Bushfire" },
      { name: "Adelaide", score: 88, pop: "1.3M", risk: "Heatwave" },
    ],
  },
  {
    name: "Ukraine",
    iso: "UKR",
    flag: "🇺🇦",
    capital: "Kyiv",
    region: "Europe",
    population: "43.5M",
    timezone: "UTC+2",
    safetyScore: 20,
    disasterRisk: 15,
    airQuality: 40,
    crimeLevel: 30,
    politicalUnrest: 5,
    weatherRisk: 55,
    cities: [
      { name: "Kyiv", score: 18, pop: "2.9M", risk: "Conflict" },
      { name: "Kharkiv", score: 12, pop: "1.4M", risk: "Conflict" },
      { name: "Odessa", score: 22, pop: "1M", risk: "Conflict" },
      { name: "Lviv", score: 35, pop: "721K", risk: "Conflict" },
      { name: "Dnipro", score: 20, pop: "968K", risk: "Conflict" },
    ],
  },
  {
    name: "Syria",
    iso: "SYR",
    flag: "🇸🇾",
    capital: "Damascus",
    region: "Middle East",
    population: "21.3M",
    timezone: "UTC+3",
    safetyScore: 12,
    disasterRisk: 20,
    airQuality: 30,
    crimeLevel: 10,
    politicalUnrest: 5,
    weatherRisk: 60,
    cities: [
      { name: "Damascus", score: 15, pop: "2.3M", risk: "Conflict" },
      { name: "Aleppo", score: 10, pop: "1.8M", risk: "Conflict" },
      { name: "Homs", score: 12, pop: "652K", risk: "Conflict" },
      { name: "Latakia", score: 20, pop: "383K", risk: "Conflict" },
      { name: "Hama", score: 11, pop: "696K", risk: "Conflict" },
    ],
  },
  {
    name: "Canada",
    iso: "CAN",
    flag: "🇨🇦",
    capital: "Ottawa",
    region: "Americas",
    population: "38M",
    timezone: "UTC-3:30 to UTC-8",
    safetyScore: 90,
    disasterRisk: 75,
    airQuality: 88,
    crimeLevel: 88,
    politicalUnrest: 95,
    weatherRisk: 65,
    cities: [
      { name: "Toronto", score: 88, pop: "2.9M", risk: "Winter Storm" },
      { name: "Vancouver", score: 87, pop: "675K", risk: "Earthquake" },
      { name: "Montreal", score: 86, pop: "1.7M", risk: "Winter Storm" },
      { name: "Calgary", score: 89, pop: "1.3M", risk: "Hailstorm" },
      { name: "Ottawa", score: 90, pop: "994K", risk: "Winter Storm" },
    ],
  },
  {
    name: "France",
    iso: "FRA",
    flag: "🇫🇷",
    capital: "Paris",
    region: "Europe",
    population: "67.4M",
    timezone: "UTC+1",
    safetyScore: 79,
    disasterRisk: 75,
    airQuality: 72,
    crimeLevel: 68,
    politicalUnrest: 78,
    weatherRisk: 72,
    cities: [
      { name: "Paris", score: 74, pop: "2.2M", risk: "Terrorism" },
      { name: "Lyon", score: 79, pop: "515K", risk: "Flooding" },
      { name: "Marseille", score: 68, pop: "861K", risk: "Crime" },
      { name: "Toulouse", score: 80, pop: "479K", risk: "Flooding" },
      { name: "Nice", score: 78, pop: "342K", risk: "Earthquake" },
    ],
  },
  {
    name: "Brazil",
    iso: "BRA",
    flag: "🇧🇷",
    capital: "Brasília",
    region: "Americas",
    population: "214M",
    timezone: "UTC-3",
    safetyScore: 55,
    disasterRisk: 48,
    airQuality: 58,
    crimeLevel: 30,
    politicalUnrest: 60,
    weatherRisk: 52,
    cities: [
      { name: "São Paulo", score: 48, pop: "12.3M", risk: "Crime" },
      { name: "Rio de Janeiro", score: 42, pop: "6.7M", risk: "Crime" },
      { name: "Brasília", score: 62, pop: "3.1M", risk: "Crime" },
      { name: "Salvador", score: 45, pop: "2.9M", risk: "Crime" },
      { name: "Fortaleza", score: 44, pop: "2.6M", risk: "Crime" },
    ],
  },
  {
    name: "China",
    iso: "CHN",
    flag: "🇨🇳",
    capital: "Beijing",
    region: "Asia",
    population: "1.4B",
    timezone: "UTC+8",
    safetyScore: 60,
    disasterRisk: 55,
    airQuality: 30,
    crimeLevel: 75,
    politicalUnrest: 55,
    weatherRisk: 58,
    cities: [
      { name: "Beijing", score: 55, pop: "21.5M", risk: "Air Quality" },
      { name: "Shanghai", score: 62, pop: "24.1M", risk: "Flooding" },
      { name: "Guangzhou", score: 60, pop: "16M", risk: "Typhoon" },
      { name: "Shenzhen", score: 64, pop: "17.5M", risk: "Flooding" },
      { name: "Chengdu", score: 58, pop: "9.1M", risk: "Earthquake" },
    ],
  },
  {
    name: "Pakistan",
    iso: "PAK",
    flag: "🇵🇰",
    capital: "Islamabad",
    region: "Asia",
    population: "225M",
    timezone: "UTC+5",
    safetyScore: 35,
    disasterRisk: 28,
    airQuality: 22,
    crimeLevel: 32,
    politicalUnrest: 30,
    weatherRisk: 45,
    cities: [
      { name: "Karachi", score: 30, pop: "14.9M", risk: "Crime" },
      { name: "Lahore", score: 35, pop: "11.1M", risk: "Air Quality" },
      { name: "Islamabad", score: 42, pop: "1.1M", risk: "Political" },
      { name: "Rawalpindi", score: 37, pop: "2.1M", risk: "Crime" },
      { name: "Faisalabad", score: 33, pop: "3.6M", risk: "Flooding" },
    ],
  },
  {
    name: "Russia",
    iso: "RUS",
    flag: "🇷🇺",
    capital: "Moscow",
    region: "Europe",
    population: "144M",
    timezone: "UTC+2 to UTC+12",
    safetyScore: 40,
    disasterRisk: 38,
    airQuality: 42,
    crimeLevel: 45,
    politicalUnrest: 28,
    weatherRisk: 50,
    cities: [
      { name: "Moscow", score: 42, pop: "12.5M", risk: "Political" },
      { name: "Saint Petersburg", score: 44, pop: "5.4M", risk: "Political" },
      { name: "Novosibirsk", score: 40, pop: "1.6M", risk: "Cold" },
      { name: "Yekaterinburg", score: 39, pop: "1.5M", risk: "Cold" },
      { name: "Kazan", score: 41, pop: "1.2M", risk: "Political" },
    ],
  },
];

export const safetyData: CountryData[] = rawCountries;

export const safetyDataMap = new Map<string, CountryData>(
  safetyData.map((d) => [d.iso, d])
);

export function getSafetyColor(score: number): string {
  if (score >= 80) return "#6EE7F9";
  if (score >= 50) return "#F6C177";
  return "#FF4D6D";
}

export function getSafetyLabel(score: number): string {
  if (score >= 80) return "Safe";
  if (score >= 50) return "Moderate";
  return "Dangerous";
}

export function getAlternatives(iso: string): CountryData[] {
  const country = safetyDataMap.get(iso);
  if (!country) return [];
  return safetyData
    .filter((c) => c.iso !== iso && c.safetyScore > country.safetyScore)
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .slice(0, 3);
}
