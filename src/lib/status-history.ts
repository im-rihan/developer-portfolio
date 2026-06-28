import type { LinkStatus } from "@/lib/status-check";

const STORAGE_KEY = "rm-status-history";
const MAX_ENTRIES = 48;

export interface StatusHistorySnapshot {
    name: string;
    status: LinkStatus;
    responseMs: number | null;
}

export interface StatusHistoryEntry {
    timestamp: number;
    results: StatusHistorySnapshot[];
}

export function readStatusHistory(): StatusHistoryEntry[] {
    if (typeof localStorage === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as StatusHistoryEntry[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function appendStatusHistory(results: StatusHistorySnapshot[]): StatusHistoryEntry[] {
    if (typeof localStorage === "undefined") return [];
    const entry: StatusHistoryEntry = { timestamp: Date.now(), results };
    const next = [entry, ...readStatusHistory()].slice(0, MAX_ENTRIES);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* quota exceeded — ignore */
    }
    return next;
}

/** Uptime % from recent history (online + slow count as up). */
export function computeLinkUptime(name: string, history: StatusHistoryEntry[]): number | null {
    if (history.length === 0) return null;
    let seen = 0;
    let up = 0;
    for (const entry of history) {
        const hit = entry.results.find((r) => r.name === name);
        if (!hit) continue;
        seen++;
        if (hit.status === "online" || hit.status === "slow") up++;
    }
    if (seen === 0) return null;
    return Math.round((up / seen) * 100);
}

/** Sparkline values (1 = up, 0 = down) for last N checks, oldest first. */
export function linkUptimeSparkline(name: string, history: StatusHistoryEntry[], points = 12): number[] {
    const slice = [...history].reverse().slice(-points);
    return slice.map((entry) => {
        const hit = entry.results.find((r) => r.name === name);
        if (!hit) return 0.5;
        return hit.status === "online" || hit.status === "slow" ? 1 : 0;
    });
}

export function formatRelativeTime(timestamp: number): string {
    const sec = Math.floor((Date.now() - timestamp) / 1000);
    if (sec < 10) return "just now";
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
}
