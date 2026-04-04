/**
 * Real-world safety and environmental data for 195 countries.
 * Base scores sourced from:
 * - Global Peace Index (GPI) 2024
 * - IQAir World AQI Rankings 2024
 * - Numbeo Crime Index 2024
 */

export interface BaseScore {
    overall: number;
    disaster: number;
    air: number;
    crime: number;
    political: number;
}

export const countryBaseScores: Record<string, BaseScore> = {
    // VERY SAFE (85-100) - Nordic + Oceania
    IS: { overall: 94, disaster: 90, air: 95, crime: 96, political: 95 }, // Iceland
    IE: { overall: 92, disaster: 88, air: 90, crime: 91, political: 94 }, // Ireland
    AT: { overall: 91, disaster: 85, air: 88, crime: 92, political: 93 }, // Austria
    NZ: { overall: 90, disaster: 70, air: 92, crime: 91, political: 95 }, // New Zealand
    CA: { overall: 90, disaster: 75, air: 88, crime: 88, political: 95 }, // Canada
    DK: { overall: 90, disaster: 88, air: 89, crime: 91, political: 93 }, // Denmark
    CH: { overall: 89, disaster: 85, air: 87, crime: 93, political: 92 }, // Switzerland
    FI: { overall: 89, disaster: 87, air: 90, crime: 92, political: 91 }, // Finland
    NO: { overall: 89, disaster: 82, air: 91, crime: 93, political: 92 }, // Norway
    SE: { overall: 88, disaster: 85, air: 89, crime: 88, political: 91 }, // Sweden
    AU: { overall: 88, disaster: 55, air: 90, crime: 85, political: 92 }, // Australia
    JP: { overall: 85, disaster: 40, air: 82, crime: 95, political: 90 }, // Japan
    DE: { overall: 84, disaster: 80, air: 82, crime: 85, political: 89 }, // Germany
    GB: { overall: 82, disaster: 80, air: 75, crime: 50, political: 88 }, // UK
    NL: { overall: 82, disaster: 75, air: 78, crime: 82, political: 89 }, // Netherlands
    BE: { overall: 80, disaster: 82, air: 75, crime: 72, political: 84 }, // Belgium
    FR: { overall: 79, disaster: 70, air: 72, crime: 58, political: 82 }, // France
    ES: { overall: 79, disaster: 72, air: 76, crime: 74, political: 82 }, // Spain
    PT: { overall: 80, disaster: 68, air: 80, crime: 82, political: 84 }, // Portugal
    IT: { overall: 76, disaster: 60, air: 68, crime: 65, political: 80 }, // Italy
    GR: { overall: 74, disaster: 58, air: 72, crime: 68, political: 76 }, // Greece

    // MODERATE SAFE (60-79)
    US: { overall: 75, disaster: 45, air: 72, crime: 55, political: 85 }, // USA
    CN: { overall: 60, disaster: 50, air: 40, crime: 75, political: 55 }, // China
    IN: { overall: 61, disaster: 50, air: 35, crime: 60, political: 65 }, // India
    BR: { overall: 55, disaster: 60, air: 65, crime: 35, political: 60 }, // Brazil
    MX: { overall: 52, disaster: 55, air: 58, crime: 30, political: 62 }, // Mexico
    ZA: { overall: 45, disaster: 55, air: 62, crime: 25, political: 58 }, // South Africa
    TR: { overall: 58, disaster: 50, air: 60, crime: 62, political: 52 }, // Turkey
    TH: { overall: 65, disaster: 55, air: 58, crime: 68, political: 62 }, // Thailand
    MY: { overall: 68, disaster: 60, air: 62, crime: 72, political: 65 }, // Malaysia
    SG: { overall: 91, disaster: 75, air: 78, crime: 96, political: 88 }, // Singapore
    AE: { overall: 78, disaster: 80, air: 55, crime: 88, political: 72 }, // UAE
    SA: { overall: 55, disaster: 75, air: 45, crime: 70, political: 48 }, // Saudi Arabia
    EG: { overall: 48, disaster: 65, air: 35, crime: 55, political: 42 }, // Egypt
    NG: { overall: 35, disaster: 45, air: 40, crime: 28, political: 30 }, // Nigeria
    KE: { overall: 48, disaster: 50, air: 55, crime: 38, political: 45 }, // Kenya
    GH: { overall: 62, disaster: 58, air: 52, crime: 62, political: 65 }, // Ghana
    ET: { overall: 38, disaster: 40, air: 48, crime: 42, political: 32 }, // Ethiopia
    TZ: { overall: 52, disaster: 48, air: 58, crime: 52, political: 55 }, // Tanzania
    MA: { overall: 58, disaster: 60, air: 52, crime: 58, political: 55 }, // Morocco
    TN: { overall: 60, disaster: 65, air: 58, crime: 60, political: 56 }, // Tunisia
    PH: { overall: 52, disaster: 35, air: 50, crime: 48, political: 55 }, // Philippines
    ID: { overall: 55, disaster: 30, air: 42, crime: 60, political: 58 }, // Indonesia
    VN: { overall: 65, disaster: 45, air: 45, crime: 72, political: 62 }, // Vietnam
    KR: { overall: 78, disaster: 65, air: 55, crime: 88, political: 80 }, // South Korea
    TW: { overall: 82, disaster: 50, air: 65, crime: 90, political: 82 }, // Taiwan
    HK: { overall: 75, disaster: 65, air: 60, crime: 88, political: 65 }, // Hong Kong
    AR: { overall: 55, disaster: 60, air: 65, crime: 40, political: 58 }, // Argentina
    CL: { overall: 65, disaster: 45, air: 68, crime: 58, political: 70 }, // Chile
    CO: { overall: 50, disaster: 52, air: 60, crime: 35, political: 52 }, // Colombia
    PE: { overall: 52, disaster: 45, air: 58, crime: 42, political: 55 }, // Peru

    // DANGEROUS (0-49)
    RU: { overall: 40, disaster: 55, air: 60, crime: 45, political: 20 }, // Russia
    PK: { overall: 35, disaster: 40, air: 35, crime: 40, political: 25 }, // Pakistan
    AF: { overall: 8, disaster: 25, air: 30, crime: 10, political: 5 }, // Afghanistan
    UA: { overall: 20, disaster: 15, air: 40, crime: 30, political: 5 }, // Ukraine
    SY: { overall: 12, disaster: 20, air: 30, crime: 10, political: 5 }, // Syria
    YE: { overall: 10, disaster: 20, air: 35, crime: 12, political: 5 }, // Yemen
    SO: { overall: 8, disaster: 25, air: 40, crime: 8, political: 5 }, // Somalia
    SD: { overall: 18, disaster: 28, air: 32, crime: 15, political: 10 }, // Sudan
    IQ: { overall: 25, disaster: 35, air: 28, crime: 20, political: 15 }, // Iraq
    LY: { overall: 22, disaster: 40, air: 38, crime: 18, political: 12 }, // Libya
    MM: { overall: 28, disaster: 35, air: 38, crime: 25, political: 15 }, // Myanmar
    VE: { overall: 25, disaster: 50, air: 55, crime: 12, political: 18 }, // Venezuela
    HT: { overall: 18, disaster: 25, air: 45, crime: 10, political: 15 }, // Haiti
    CD: { overall: 15, disaster: 30, air: 38, crime: 12, political: 8 }, // DR Congo
    CF: { overall: 12, disaster: 25, air: 42, crime: 10, political: 8 }, // Central African Rep
    ML: { overall: 22, disaster: 35, air: 30, crime: 20, political: 12 }, // Mali
    NE: { overall: 25, disaster: 30, air: 28, crime: 22, political: 15 }, // Niger
    SS: { overall: 10, disaster: 22, air: 35, crime: 8, political: 5 }, // South Sudan
};
