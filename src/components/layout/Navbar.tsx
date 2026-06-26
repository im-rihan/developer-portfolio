"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { siteMeta } from "@/data/profile";
import styles from "./Navbar.module.css";

const pageLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/github", label: "GitHub" },
    { href: "/gallery", label: "Gallery" },
    { href: "/status", label: "Analytics" },
];

const sectionLinks = [
    { href: "/#about", label: "About" },
    { href: "/#skills", label: "Skills" },
    { href: "/#experience", label: "Experience" },
    { href: "/#projects", label: "Projects" },
    { href: "/#education", label: "Education" },
    { href: "/#contact", label: "Contact" },
];

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path;
}

export function Navbar() {
    const pathname = normalizePath(usePathname());
    const [open, setOpen] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);
    const exploreRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
                setExploreOpen(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const closeAll = () => {
        setOpen(false);
        setExploreOpen(false);
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <Logo onNavigate={closeAll} />

                <div className={styles.navCenter}>
                    <ul className={`${styles.links} ${open ? styles.open : ""}`}>
                        {pageLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={isActive(link.href) ? styles.activeLink : undefined}
                                    onClick={closeAll}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className={styles.exploreItem} ref={exploreRef}>
                            <button
                                type="button"
                                className={`${styles.exploreBtn} ${exploreOpen ? styles.exploreOpen : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExploreOpen(!exploreOpen);
                                }}
                                aria-expanded={exploreOpen}
                            >
                                Sections
                                <ChevronDown size={14} className={styles.chevron} />
                            </button>
                            {exploreOpen && (
                                <div className={styles.dropdown}>
                                    {sectionLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={styles.dropdownLink}
                                            onClick={closeAll}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>

                <div className={styles.actions}>
                    <a
                        href={`mailto:${siteMeta.email}`}
                        className={styles.contactCta}
                        data-cursor="pointer"
                    >
                        <Mail size={16} />
                        <span>Contact</span>
                    </a>
                    <ThemeToggle />
                    <button
                        type="button"
                        className={styles.menuBtn}
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        {open ? "✕" : "☰"}
                    </button>
                </div>
            </div>
        </nav>
    );
}
