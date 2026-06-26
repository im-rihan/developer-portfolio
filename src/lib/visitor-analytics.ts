import { countryNames } from "@/data/country-coordinates";

export interface VisitRecord {
    id: string;
    countryCode: string;
    countryName: string;
    city: string;
    region: string;
    deviceType: "desktop" | "mobile" | "tablet" | "unknown";
    deviceLabel: string;
    browser: string;
    os: string;
    page: string;
    timestamp: string;
}

export interface CountryStat {
    code: string;
    name: string;
    count: number;
}

export interface DeviceStat {
    type: VisitRecord["deviceType"];
    label: string;
    count: number;
}

export interface VisitorStats {
    total: number;
    globalTotal: number | null;
    countries: CountryStat[];
    devices: DeviceStat[];
    recent: VisitRecord[];
    current: VisitRecord | null;
}

const STORAGE_KEY = "rm-portfolio-visits";
const SESSION_KEY = "rm-portfolio-tracked";
const SEEN_COUNTRIES_KEY = "rm-seen-countries";
const COUNTAPI_NS = "im-rihan-portfolio";

export const VISITOR_UPDATE_EVENT = "rm-visitor-update";

async function countApiHit(key: string): Promise<void> {
    try {
        await fetch(`https://api.countapi.xyz/hit/${COUNTAPI_NS}/${key}`);
    } catch {
        /* optional */
    }
}

async function countApiGet(key: string): Promise<number> {
    try {
        const res = await fetch(`https://api.countapi.xyz/get/${COUNTAPI_NS}/${key}`);
        if (!res.ok) return 0;
        const data = (await res.json()) as { value?: number };
        return data.value ?? 0;
    } catch {
        return 0;
    }
}

function addSeenCountry(code: string): void {
    try {
        const seen: string[] = JSON.parse(localStorage.getItem(SEEN_COUNTRIES_KEY) || "[]");
        if (!seen.includes(code)) {
            seen.push(code);
            localStorage.setItem(SEEN_COUNTRIES_KEY, JSON.stringify(seen));
        }
    } catch {
        /* ignore */
    }
}

function getSeenCountries(): string[] {
    try {
        return JSON.parse(localStorage.getItem(SEEN_COUNTRIES_KEY) || "[]") as string[];
    } catch {
        return [];
    }
}

interface GeoResponse {
    success?: boolean;
    country_code?: string;
    country?: string;
    city?: string;
    region?: string;
}

function parseDevice(ua: string): Pick<VisitRecord, "deviceType" | "deviceLabel" | "browser" | "os"> {
    const lower = ua.toLowerCase();
    let deviceType: VisitRecord["deviceType"] = "desktop";
    if (/ipad|tablet/.test(lower)) deviceType = "tablet";
    else if (/mobile|android|iphone|ipod/.test(lower)) deviceType = "mobile";

    let browser = "Browser";
    if (lower.includes("edg/")) browser = "Edge";
    else if (lower.includes("chrome/")) browser = "Chrome";
    else if (lower.includes("firefox/")) browser = "Firefox";
    else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";

    let os = "Unknown";
    if (lower.includes("windows")) os = "Windows";
    else if (lower.includes("mac os")) os = "macOS";
    else if (lower.includes("android")) os = "Android";
    else if (/iphone|ipad|ipod/.test(lower)) os = "iOS";
    else if (lower.includes("linux")) os = "Linux";

    const deviceLabel =
        deviceType === "mobile" ? `Mobile · ${os}` :
        deviceType === "tablet" ? `Tablet · ${os}` :
        `Desktop · ${os}`;

    return { deviceType, deviceLabel, browser, os };
}

function readVisits(): VisitRecord[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as VisitRecord[]) : [];
    } catch {
        return [];
    }
}

function writeVisits(visits: VisitRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits.slice(-500)));
}

async function fetchGeo(): Promise<GeoResponse | null> {
    try {
        const res = await fetch("https://ipwho.is/", { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as GeoResponse;
        return data.success === false ? null : data;
    } catch {
        return null;
    }
}

function getSupabaseConfig(): { url: string; key: string } | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return { url, key };
}

export interface SupabaseProbeResult {
    configured: boolean;
    ok: boolean;
    message: string;
}

function supabaseHeaders(key: string): HeadersInit {
    return {
        apikey: key,
        Authorization: `Bearer ${key}`,
    };
}

function parseSupabaseError(status: number, body: string): string {
    try {
        const json = JSON.parse(body) as { code?: string; message?: string };
        if (json.code === "PGRST205") {
            return "Table public.visits is missing. Run supabase/visits.sql in Supabase → SQL Editor.";
        }
        if (status === 401 || status === 403) {
            return "Auth failed — check NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or anon key) in .env.local.";
        }
        return json.message ?? body;
    } catch {
        return body || `HTTP ${status}`;
    }
}

/** Health check for Supabase analytics backend. */
export async function probeSupabase(): Promise<SupabaseProbeResult> {
    const config = getSupabaseConfig();
    if (!config) {
        return { configured: false, ok: false, message: "Supabase env vars not set" };
    }

    try {
        const res = await fetch(
            `${config.url}/rest/v1/visits?select=id&limit=1`,
            { headers: supabaseHeaders(config.key), cache: "no-store" }
        );
        if (res.ok) {
            return { configured: true, ok: true, message: "Connected — public.visits table ready" };
        }
        const body = await res.text();
        return {
            configured: true,
            ok: false,
            message: parseSupabaseError(res.status, body),
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        return { configured: true, ok: false, message: msg };
    }
}

async function fetchSupabaseVisits(): Promise<VisitRecord[] | null> {
    const config = getSupabaseConfig();
    if (!config) return null;
    const { url, key } = config;

    try {
        const res = await fetch(
            `${url}/rest/v1/visits?select=*&order=timestamp.desc&limit=200`,
            {
                headers: supabaseHeaders(key),
                cache: "no-store",
            }
        );
        if (!res.ok) {
            const body = await res.text();
            if (process.env.NODE_ENV === "development") {
                console.warn("[analytics] Supabase read failed:", parseSupabaseError(res.status, body));
            }
            return null;
        }
        return (await res.json()) as VisitRecord[];
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[analytics] Supabase read error:", err);
        }
        return null;
    }
}

async function pushSupabaseVisit(visit: VisitRecord): Promise<boolean> {
    const config = getSupabaseConfig();
    if (!config) return false;
    const { url, key } = config;

    try {
        const res = await fetch(`${url}/rest/v1/visits`, {
            method: "POST",
            headers: {
                ...supabaseHeaders(key),
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify(visit),
        });
        if (!res.ok) {
            const body = await res.text();
            if (process.env.NODE_ENV === "development") {
                console.warn("[analytics] Supabase insert failed:", parseSupabaseError(res.status, body));
            }
            return false;
        }
        return true;
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[analytics] Supabase insert error:", err);
        }
        return false;
    }
}

function aggregate(visits: VisitRecord[], current: VisitRecord | null): Omit<VisitorStats, "globalTotal"> {
    const countryMap = new Map<string, CountryStat>();
    const deviceMap = new Map<string, DeviceStat>();

    for (const v of visits) {
        const cKey = v.countryCode || "XX";
        const existing = countryMap.get(cKey);
        if (existing) existing.count += 1;
        else countryMap.set(cKey, { code: cKey, name: v.countryName || "Unknown", count: 1 });

        const dKey = v.deviceType;
        const dExisting = deviceMap.get(dKey);
        if (dExisting) dExisting.count += 1;
        else deviceMap.set(dKey, { type: dKey, label: v.deviceLabel, count: 1 });
    }

    return {
        total: visits.length,
        countries: [...countryMap.values()].sort((a, b) => b.count - a.count),
        devices: [...deviceMap.values()].sort((a, b) => b.count - a.count),
        recent: visits.slice(-8).reverse(),
        current,
    };
}

export async function trackVisit(page: string): Promise<VisitRecord | null> {
    if (typeof window === "undefined") return null;
    if (sessionStorage.getItem(SESSION_KEY)) return null;
    sessionStorage.setItem(SESSION_KEY, "1");

    const geo = await fetchGeo();
    const device = parseDevice(navigator.userAgent);

    const visit: VisitRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        countryCode: geo?.country_code ?? "XX",
        countryName: geo?.country ?? "Unknown",
        city: geo?.city ?? "",
        region: geo?.region ?? "",
        deviceType: device.deviceType,
        deviceLabel: device.deviceLabel,
        browser: device.browser,
        os: device.os,
        page,
        timestamp: new Date().toISOString(),
    };

    const visits = readVisits();
    visits.push(visit);
    writeVisits(visits);
    await pushSupabaseVisit(visit);

    const code = visit.countryCode.toLowerCase();
    addSeenCountry(visit.countryCode);
    await Promise.all([
        countApiHit("visits"),
        countApiHit(`country-${code}`),
        countApiHit(`device-${visit.deviceType}`),
    ]);

    window.dispatchEvent(new CustomEvent(VISITOR_UPDATE_EVENT));
    return visit;
}

async function fetchGlobalStats(localVisits: VisitRecord[]): Promise<{
    globalTotal: number | null;
    countries: CountryStat[];
    devices: DeviceStat[];
}> {
    const globalTotal = await countApiGet("visits");
    const seenCodes = new Set([
        ...getSeenCountries(),
        ...localVisits.map((v) => v.countryCode),
    ]);

    const countryStats: CountryStat[] = [];
    for (const code of seenCodes) {
        const count = await countApiGet(`country-${code.toLowerCase()}`);
        if (count > 0) {
            const name =
                localVisits.find((v) => v.countryCode === code)?.countryName ??
                countryNames[code.toUpperCase()] ??
                code;
            countryStats.push({ code, name, count });
        }
    }

    const deviceTypes = ["desktop", "mobile", "tablet", "unknown"] as const;
    const deviceStats: DeviceStat[] = [];
    for (const type of deviceTypes) {
        const count = await countApiGet(`device-${type}`);
        if (count > 0) {
            const label =
                type === "mobile" ? "Mobile" :
                type === "tablet" ? "Tablet" :
                type === "desktop" ? "Desktop" : "Unknown";
            deviceStats.push({ type, label, count });
        }
    }

    return {
        globalTotal: globalTotal > 0 ? globalTotal : null,
        countries: countryStats.sort((a, b) => b.count - a.count),
        devices: deviceStats.sort((a, b) => b.count - a.count),
    };
}

function isLocalhost(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/** True when localhost should show sample analytics (use ?live=1 to disable). */
export function shouldUseDemoAnalytics(): boolean {
    if (typeof window === "undefined") return false;
    if (!isLocalhost()) return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("live") === "1") return false;
    return params.get("demo") === "1" || params.get("demo") !== "0";
}

export function getDemoVisitorStats(): VisitorStats & { source: "demo"; isDemo: true } {
    const now = Date.now();
    const ago = (hours: number) => new Date(now - hours * 3600_000).toISOString();

    const recent: VisitRecord[] = [
        { id: "d1", countryCode: "US", countryName: "United States", city: "San Francisco", region: "California", deviceType: "desktop", deviceLabel: "Desktop · macOS", browser: "Chrome", os: "macOS", page: "/", timestamp: ago(1) },
        { id: "d2", countryCode: "IN", countryName: "India", city: "Bengaluru", region: "Karnataka", deviceType: "mobile", deviceLabel: "Mobile · Android", browser: "Chrome", os: "Android", page: "/github", timestamp: ago(3) },
        { id: "d3", countryCode: "GB", countryName: "United Kingdom", city: "London", region: "England", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Edge", os: "Windows", page: "/chat", timestamp: ago(5) },
        { id: "d4", countryCode: "DE", countryName: "Germany", city: "Berlin", region: "Berlin", deviceType: "desktop", deviceLabel: "Desktop · Linux", browser: "Firefox", os: "Linux", page: "/", timestamp: ago(8) },
        { id: "d5", countryCode: "SG", countryName: "Singapore", city: "Singapore", region: "", deviceType: "mobile", deviceLabel: "Mobile · iOS", browser: "Safari", os: "iOS", page: "/gallery", timestamp: ago(12) },
        { id: "d6", countryCode: "CA", countryName: "Canada", city: "Toronto", region: "Ontario", deviceType: "tablet", deviceLabel: "Tablet · iOS", browser: "Safari", os: "iOS", page: "/status", timestamp: ago(18) },
        { id: "d7", countryCode: "AU", countryName: "Australia", city: "Sydney", region: "NSW", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Chrome", os: "Windows", page: "/", timestamp: ago(24) },
        { id: "d8", countryCode: "IN", countryName: "India", city: "Puri", region: "Odisha", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Chrome", os: "Windows", page: "/status", timestamp: ago(0.2) },
    ];

    return {
        total: 847,
        globalTotal: 847,
        countries: [
            { code: "US", name: "United States", count: 312 },
            { code: "IN", name: "India", count: 156 },
            { code: "GB", name: "United Kingdom", count: 89 },
            { code: "DE", name: "Germany", count: 67 },
            { code: "CA", name: "Canada", count: 45 },
            { code: "AU", name: "Australia", count: 38 },
            { code: "SG", name: "Singapore", count: 22 },
            { code: "FR", name: "France", count: 18 },
            { code: "NL", name: "Netherlands", count: 14 },
            { code: "JP", name: "Japan", count: 11 },
        ],
        devices: [
            { type: "desktop", label: "Desktop", count: 520 },
            { type: "mobile", label: "Mobile", count: 278 },
            { type: "tablet", label: "Tablet", count: 49 },
        ],
        recent,
        current: recent[recent.length - 1],
        source: "demo",
        isDemo: true,
    };
}

export async function getVisitorStats(_forceRefresh = false): Promise<
    VisitorStats & {
        source: "supabase" | "local" | "global" | "merged" | "demo";
        isDemo?: boolean;
        supabase?: SupabaseProbeResult;
    }
> {
    if (shouldUseDemoAnalytics()) {
        return getDemoVisitorStats();
    }

    const supabase = await probeSupabase();
    const local = readVisits();
    const remoteVisits = supabase.ok ? await fetchSupabaseVisits() : null;

    const visits = remoteVisits && remoteVisits.length > 0 ? remoteVisits : local;
    const current = local[local.length - 1] ?? visits[visits.length - 1] ?? null;
    const localAgg = aggregate(visits.length > 0 ? visits : local, current);
    const global = await fetchGlobalStats(local.length > 0 ? local : visits);

    const countries = mergeCountryStats(localAgg.countries, global.countries);
    const devices = global.devices.length > 0 ? global.devices : localAgg.devices;
    const total = global.globalTotal ?? Math.max(localAgg.total, visits.length);

    const source =
        remoteVisits && remoteVisits.length > 0
            ? global.globalTotal
                ? "merged"
                : "supabase"
            : global.globalTotal
              ? "merged"
              : "local";

    return {
        total,
        globalTotal: global.globalTotal,
        countries,
        devices,
        recent: localAgg.recent,
        current,
        source,
        supabase: supabase.configured ? supabase : undefined,
    };
}

function mergeCountryStats(local: CountryStat[], global: CountryStat[]): CountryStat[] {
    const map = new Map<string, CountryStat>();
    for (const c of [...local, ...global]) {
        const key = c.code.toUpperCase();
        const existing = map.get(key);
        if (existing) {
            existing.count = Math.max(existing.count, c.count);
        } else {
            map.set(key, { ...c, code: key });
        }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
}
