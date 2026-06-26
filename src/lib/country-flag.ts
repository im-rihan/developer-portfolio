/** ISO 3166-1 alpha-2 → flag image (4×3 SVG, works in img + map overlays). */
export function countryFlagSrc(code: string): string {
    const c = code.toUpperCase();
    if (!c || c === "XX" || c.length !== 2) return "";
    return `https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/${c.toLowerCase()}.svg`;
}

export function countryFlagEmoji(code: string): string {
    const c = code.toUpperCase();
    if (!c || c === "XX" || c.length !== 2) return "🌍";
    return String.fromCodePoint(
        ...[...c].map((ch) => 0x1f1e6 - 65 + ch.charCodeAt(0))
    );
}
