import { useId } from "react";
import styles from "./Logo.module.css";

/** Terminal-style RM monogram — colors via CSS vars on `.mark` for instant light/dark on reload. */
export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const uid = useId().replace(/:/g, "");
    const sizeClass = size === "sm" ? styles.svgSm : size === "lg" ? styles.svgLg : "";

    return (
        <svg
            className={`${styles.svgMark} ${sizeClass}`}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <linearGradient id={`${uid}-stroke`} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--logo-stroke-a)" />
                    <stop offset="100%" stopColor="var(--logo-stroke-b)" />
                </linearGradient>
            </defs>

            <rect
                x="4"
                y="6"
                width="40"
                height="36"
                rx="6"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="var(--logo-frame-stroke)"
                fill="var(--logo-fill)"
            />

            <line
                x1="4"
                y1="14"
                x2="44"
                y2="14"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="1"
                opacity="var(--logo-divider-opacity)"
            />

            <circle cx="10" cy="10" r="1.5" fill="#ef4444" opacity="var(--logo-dot-opacity)" />
            <circle cx="15" cy="10" r="1.5" fill="#f59e0b" opacity="var(--logo-dot-opacity)" />
            <circle cx="20" cy="10" r="1.5" fill="#22c55e" opacity="var(--logo-dot-opacity)" />

            <path
                d="M11 20 V38 M11 20 C11 17 13 16 15 16 M11 38 C11 41 13 42 15 42"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="var(--logo-bracket-opacity)"
            />
            <path
                d="M37 20 V38 M37 20 C37 17 35 16 33 16 M37 38 C37 41 35 42 33 42"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="var(--logo-bracket-opacity)"
            />

            <path
                className={styles.svgLetter}
                d="M17 18 V36 M17 18 H22 C25.5 18 27 20.5 27 23 C27 25.5 25.5 27 22 27 H17 M22 27 L27 36"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="var(--logo-letter-stroke)"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="var(--logo-letter-opacity)"
            />

            <path
                className={styles.svgLetter}
                d="M29 36 V18 L32 26 L35 18 V36"
                stroke={`url(#${uid}-stroke)`}
                strokeWidth="var(--logo-letter-stroke)"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="var(--logo-letter-opacity)"
            />

            <rect className={styles.svgCursor} x="37" y="32" width="2" height="8" rx="0.5" fill="var(--logo-cursor)" />
        </svg>
    );
}
