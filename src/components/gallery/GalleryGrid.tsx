"use client";

import { useState } from "react";
import { galleryItems } from "@/data/gallery";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./GalleryGrid.module.css";

export function GalleryGrid() {
    const [lightbox, setLightbox] = useState<(typeof galleryItems)[0] | null>(null);

    return (
        <>
            <div className={styles.grid}>
                {galleryItems.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.05} className={styles.gridItem}>
                        <button
                            type="button"
                            className={`glass-card ${styles.card}`}
                            data-cursor="card"
                            onClick={() => setLightbox(item)}
                        >
                            <div className={styles.media} style={{ background: item.gradient }} aria-hidden />
                            <div className={styles.body}>
                                <span className={styles.category}>{item.category}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <span className={styles.openHint}>View →</span>
                            </div>
                        </button>
                    </FadeIn>
                ))}
            </div>
            {lightbox && (
                <div className={styles.lightbox} onClick={() => setLightbox(null)} role="dialog">
                    <div
                        className={`glass-card ${styles.lightboxInner}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.lightboxMedia} style={{ background: lightbox.gradient }} />
                        <div className={styles.lightboxBody}>
                            <span className={styles.category}>{lightbox.category}</span>
                            <h2>{lightbox.title}</h2>
                            <p>{lightbox.description}</p>
                            <p className={styles.hint}>Replace with your photo in src/data/gallery.ts</p>
                            <button type="button" className={styles.closeBtn} onClick={() => setLightbox(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
