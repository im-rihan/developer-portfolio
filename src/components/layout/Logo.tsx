import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
    compact?: boolean;
    onNavigate?: () => void;
}

export function Logo({ compact = false, onNavigate }: LogoProps) {
    return (
        <Link href="/" className={styles.logo} aria-label="Rihan Mohammed — Home" onClick={onNavigate}>
            <span className={styles.mark} aria-hidden>
                <span className={styles.monogram}>RM</span>
            </span>
            {!compact && (
                <span className={styles.wordmark}>
                    <span className={styles.name}>Rihan</span>
                    <span className={styles.surname}>Mohammed</span>
                </span>
            )}
        </Link>
    );
}
