import type { StatusTarget } from "@/data/status-targets";

export type LinkStatus = "online" | "slow" | "offline" | "unknown";

export interface StatusResult {
    name: string;
    url: string;
    status: LinkStatus;
    responseMs: number | null;
    note?: string;
}

export async function checkLink(target: StatusTarget): Promise<StatusResult> {
    // External profiles (LinkedIn, GitHub) block browser HEAD probes (LinkedIn → 999).
    if (target.type === "external") {
        return {
            name: target.name,
            url: target.url,
            status: "online",
            responseMs: null,
            note: "Profile link — open to verify",
        };
    }

    const start = performance.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        await fetch(target.url, {
            method: "HEAD",
            mode: "no-cors",
            signal: controller.signal,
            cache: "no-store",
        });
        clearTimeout(timeout);
        const ms = Math.round(performance.now() - start);

        return {
            name: target.name,
            url: target.url,
            status: ms > 2000 ? "slow" : "online",
            responseMs: ms,
        };
    } catch {
        return {
            name: target.name,
            url: target.url,
            status: "offline",
            responseMs: null,
        };
    }
}

export async function checkAllLinks(targets: StatusTarget[]): Promise<StatusResult[]> {
    return Promise.all(targets.map(checkLink));
}
