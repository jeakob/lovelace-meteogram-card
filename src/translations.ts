import enLocale from "./translations/en.json";
import nbLocale from "./translations/nb.json";
import esLocale from "./translations/es.json";
import itLocale from "./translations/it.json";
import deLocale from "./translations/de.json";
import frLocale from "./translations/fr.json";
import hrLocale from "./translations/hr.json";

// Array of supported locales and their language codes
const locales: Array<{ code: string; data: Record<string, string> }> = [
    { code: "en", data: enLocale },
    { code: "nb", data: nbLocale },
    { code: "es", data: esLocale },
    { code: "it", data: itLocale },
    { code: "de", data: deLocale },
    { code: "fr", data: frLocale },
    { code: "hr", data: hrLocale },
];

export function trnslt(hass: any, key: string, fallback?: string, lang?: string): string {
    // Determine the language to use, prioritizing the provided 'lang' parameter
    // then hass.language, then defaulting to 'en'
    const effectiveLang = lang || (hass && hass.language) || "en";

    // Try hass.localize (used by HA frontend)
    // We pass the effectiveLang to hass.localize if it supports it directly
    if (hass && typeof hass.localize === "function") {
        // hass.localize might take a specific language as the first argument, or assume it from hass.language
        // For now, we assume it uses hass.language, but we could make this more robust if needed
        const result = hass.localize(key); // Assumes hass.localize uses hass.language internally
        if (result && result !== key) return result;
    }

    // Try hass.resources (used by HA backend)
    if (hass && hass.resources && typeof hass.resources === "object") {
        const res = hass.resources[effectiveLang]?.[key];
        if (res) return res;
    }
    
    // Try local translation files (our custom locales array)
    // Find the best matching locale by prefix
    const localeObj =
        locales.find(l => effectiveLang.toLowerCase().startsWith(l.code)) ||
        locales.find(l => "en".startsWith(l.code)) || // Fallback to English specifically from our local files
        locales[0]; // Default to first available if English is somehow missing

    const localRes = localeObj.data[key];

    if (localRes) return localRes;
    // Return fallback if provided, otherwise the key
    return fallback !== undefined ? fallback : key;
}
