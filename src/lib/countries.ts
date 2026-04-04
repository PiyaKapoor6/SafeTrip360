// Comprehensive ISO 3166-1 Alpha-3 → Alpha-2 mapping (all UN member states + common territories)
export const ISO_3_TO_2: Record<string, string> = {
    // A
    'AFG': 'af', 'ALB': 'al', 'DZA': 'dz', 'AND': 'ad', 'AGO': 'ao',
    'ATG': 'ag', 'ARG': 'ar', 'ARM': 'am', 'AUS': 'au', 'AUT': 'at',
    'AZE': 'az',
    // B
    'BHS': 'bs', 'BHR': 'bh', 'BGD': 'bd', 'BRB': 'bb', 'BLR': 'by',
    'BEL': 'be', 'BLZ': 'bz', 'BEN': 'bj', 'BTN': 'bt', 'BOL': 'bo',
    'BIH': 'ba', 'BWA': 'bw', 'BRA': 'br', 'BRN': 'bn', 'BGR': 'bg',
    'BFA': 'bf', 'BDI': 'bi',
    // C
    'CPV': 'cv', 'KHM': 'kh', 'CMR': 'cm', 'CAN': 'ca', 'CAF': 'cf',
    'TCD': 'td', 'CHL': 'cl', 'CHN': 'cn', 'COL': 'co', 'COM': 'km',
    'COD': 'cd', 'COG': 'cg', 'CRI': 'cr', 'CIV': 'ci', 'HRV': 'hr',
    'CUB': 'cu', 'CYP': 'cy', 'CZE': 'cz',
    // D
    'DNK': 'dk', 'DJI': 'dj', 'DMA': 'dm', 'DOM': 'do',
    // E
    'ECU': 'ec', 'EGY': 'eg', 'SLV': 'sv', 'GNQ': 'gq', 'ERI': 'er',
    'EST': 'ee', 'ETH': 'et', 'SWZ': 'sz',
    // F
    'FJI': 'fj', 'FIN': 'fi', 'FRA': 'fr',
    // G
    'GAB': 'ga', 'GMB': 'gm', 'GEO': 'ge', 'DEU': 'de', 'GHA': 'gh',
    'GRC': 'gr', 'GRD': 'gd', 'GTM': 'gt', 'GIN': 'gn', 'GNB': 'gw',
    'GUY': 'gy',
    // H
    'HTI': 'ht', 'HND': 'hn', 'HUN': 'hu',
    // I
    'ISL': 'is', 'IND': 'in', 'IDN': 'id', 'IRN': 'ir', 'IRQ': 'iq',
    'IRL': 'ie', 'ISR': 'il', 'ITA': 'it',
    // J
    'JAM': 'jm', 'JPN': 'jp', 'JOR': 'jo',
    // K
    'KAZ': 'kz', 'KEN': 'ke', 'KIR': 'ki', 'PRK': 'kp', 'KOR': 'kr',
    'KWT': 'kw', 'KGZ': 'kg',
    // L
    'LAO': 'la', 'LVA': 'lv', 'LBN': 'lb', 'LSO': 'ls', 'LBR': 'lr',
    'LBY': 'ly', 'LIE': 'li', 'LTU': 'lt', 'LUX': 'lu',
    // M
    'MDG': 'mg', 'MWI': 'mw', 'MYS': 'my', 'MDV': 'mv', 'MLI': 'ml',
    'MLT': 'mt', 'MHL': 'mh', 'MRT': 'mr', 'MUS': 'mu', 'MEX': 'mx',
    'FSM': 'fm', 'MDA': 'md', 'MCO': 'mc', 'MNG': 'mn', 'MNE': 'me',
    'MAR': 'ma', 'MOZ': 'mz', 'MMR': 'mm',
    // N
    'NAM': 'na', 'NRU': 'nr', 'NPL': 'np', 'NLD': 'nl', 'NZL': 'nz',
    'NIC': 'ni', 'NER': 'ne', 'NGA': 'ng', 'MKD': 'mk', 'NOR': 'no',
    // O
    'OMN': 'om',
    // P
    'PAK': 'pk', 'PLW': 'pw', 'PAN': 'pa', 'PNG': 'pg', 'PRY': 'py',
    'PER': 'pe', 'PHL': 'ph', 'POL': 'pl', 'PRT': 'pt',
    // Q
    'QAT': 'qa',
    // R
    'ROU': 'ro', 'RUS': 'ru', 'RWA': 'rw',
    // S
    'KNA': 'kn', 'LCA': 'lc', 'VCT': 'vc', 'WSM': 'ws', 'SMR': 'sm',
    'STP': 'st', 'SAU': 'sa', 'SEN': 'sn', 'SRB': 'rs', 'SYC': 'sc',
    'SLE': 'sl', 'SGP': 'sg', 'SVK': 'sk', 'SVN': 'si', 'SLB': 'sb',
    'SOM': 'so', 'ZAF': 'za', 'SSD': 'ss', 'ESP': 'es', 'LKA': 'lk',
    'SDN': 'sd', 'SUR': 'sr', 'SWE': 'se', 'CHE': 'ch', 'SYR': 'sy',
    // T
    'TWN': 'tw', 'TJK': 'tj', 'TZA': 'tz', 'THA': 'th', 'TLS': 'tl',
    'TGO': 'tg', 'TON': 'to', 'TTO': 'tt', 'TUN': 'tn', 'TUR': 'tr',
    'TKM': 'tm', 'TUV': 'tv',
    // U
    'UGA': 'ug', 'UKR': 'ua', 'ARE': 'ae', 'GBR': 'gb', 'USA': 'us',
    'URY': 'uy', 'UZB': 'uz',
    // V
    'VUT': 'vu', 'VEN': 've', 'VNM': 'vn',
    // Y
    'YEM': 'ye',
    // Z
    'ZMB': 'zm', 'ZWE': 'zw',
};

export function getIso2(iso3OrIso2: string): string {
    const upper = iso3OrIso2.toUpperCase();

    // Already a 2-letter code — return lowercase as-is
    if (upper.length === 2) return upper.toLowerCase();

    // Look up 3-letter code in the comprehensive table
    const code = ISO_3_TO_2[upper];
    if (code) return code;

    // Safe fallback — do NOT slice because e.g. "ARE" → "AR" = Argentina (wrong)
    // Return 'us' as a neutral news/weather fallback
    console.warn(`[countries] Unknown ISO code: "${iso3OrIso2}" — falling back to "us"`);
    return 'us';
}
