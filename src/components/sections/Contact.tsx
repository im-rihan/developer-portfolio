"use client";

import { siteMeta } from "@/data/profile";
import { assetPath } from "@/lib/paths";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./Contact.module.css";

export function Contact() {
    return (
        <section id="contact" className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <FadeIn className={styles.info}>
                        <h2>Let&apos;s build something together</h2>
                        <p>
                            Open to networking, collaboration, and new opportunities.
                            Feel free to reach out — I&apos;d love to hear from you.
                        </p>
                        <div className={styles.links}>
                            <a href={`mailto:${siteMeta.email}`} className={styles.link}>
                                {siteMeta.email}
                            </a>
                            <a href={`tel:${siteMeta.phone.replace(/\s/g, "")}`} className={styles.link}>
                                {siteMeta.phone}
                            </a>
                            <a href={siteMeta.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                linkedin.com/in/im-rihan
                            </a>
                            <a href={siteMeta.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                github.com/im-rihan
                            </a>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className={`glass-card ${styles.cta}`}>
                            <h3>Download My Resume</h3>
                            <p>Get a detailed PDF version of my experience, skills, and projects.</p>
                            <a href={assetPath("/resume.pdf")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                Download PDF
                            </a>
                            <a href={assetPath("/resume.docx")} className="btn btn-outline">
                                Download Word
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
