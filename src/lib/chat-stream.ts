export type StreamOptions = {
    charsPerTick?: number;
    delayMs?: number;
};

const DEFAULTS: Required<StreamOptions> = {
    charsPerTick: 2,
    delayMs: 16,
};

/** Simulates token streaming for a client-side assistant reply. */
export async function streamText(
    text: string,
    onChunk: (partial: string) => void,
    signal?: AbortSignal,
    options: StreamOptions = {}
): Promise<boolean> {
    const { charsPerTick, delayMs } = { ...DEFAULTS, ...options };
    let i = 0;

    while (i < text.length) {
        if (signal?.aborted) {
            onChunk(text.slice(0, i));
            return false;
        }

        i = Math.min(text.length, i + charsPerTick);
        onChunk(text.slice(0, i));
        await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }

    return true;
}

export function formatMessageTime(ts: number): string {
    if (ts <= 0) return "";
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(ts));
}
