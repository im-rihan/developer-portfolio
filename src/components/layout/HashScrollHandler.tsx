"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll-to-section";

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path;
}

export function HashScrollHandler() {
    const pathname = normalizePath(usePathname());

    useEffect(() => {
        if (pathname !== "/") return;

        const run = () => {
            const hash = window.location.hash.replace(/^#/, "");
            if (hash) scrollToSection(hash);
        };

        run();
        const t = window.setTimeout(run, 120);
        return () => window.clearTimeout(t);
    }, [pathname]);

    return null;
}
