import Link from "next/link";
import { siteMeta } from "@/data/profile";
import { SectionScrollLink } from "@/components/layout/SectionScrollLink";
import styles from "./Footer.module.css";

const footerLinks: (
    | { label: string; href: string }
    | { label: string; sectionId: "contact" }
)[] = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work/" },
    { label: "Contact", sectionId: "contact" },
    { label: "Chat", href: "/chat/" },
    { label: "Status", href: "/status/" },
];

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <nav className={styles.nav} aria-label="Footer">
                    {footerLinks.map((link) =>
                        "sectionId" in link ? (
                            <SectionScrollLink key={link.label} sectionId={link.sectionId} className={styles.navLink}>
                                {link.label}
                            </SectionScrollLink>
                        ) : (
                            <Link key={link.label} href={link.href} className={styles.navLink} data-cursor="pointer">
                                {link.label}
                            </Link>
                        ),
                    )}
                </nav>
                <p className={styles.copy}>
                    &copy; {year}{" "}
                    <Link href="/" data-cursor="pointer">
                        {siteMeta.name}
                    </Link>
                    {" · "}
                    {siteMeta.title}
                    {" · "}
                    {siteMeta.location}
                </p>
                <p className={styles.meta}>
                    Built with Next.js · Static export ·{" "}
                    <a
                        href="https://pages.github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                    >
                        GitHub Pages
                    </a>
                </p>
            </div>
        </footer>
    );
}
