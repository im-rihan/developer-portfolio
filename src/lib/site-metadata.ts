import type { Metadata } from "next";
import { siteMeta } from "@/data/profile";

const siteUrl = "https://im-rihan.github.io";

export function pageTitle(page?: string): string {
    if (!page) return `${siteMeta.name} — ${siteMeta.title}`;
    return `${page} · ${siteMeta.name}`;
}

export function createPageMetadata(page: string, description?: string): Metadata {
    return {
        title: page,
        description: description ?? siteMeta.description,
        metadataBase: new URL(siteUrl),
        icons: {
            icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
            apple: [{ url: "/apple-touch-icon.svg" }],
        },
        openGraph: {
            title: pageTitle(page),
            description: description ?? siteMeta.description,
            url: siteUrl,
            siteName: siteMeta.name,
        },
    };
}

export const rootMetadata: Metadata = {
    ...createPageMetadata(siteMeta.title),
    title: {
        default: pageTitle(),
        template: `%s · ${siteMeta.name}`,
    },
};
