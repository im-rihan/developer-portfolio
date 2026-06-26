import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

export type Vec3 = [number, number, number];

export type ViewportSnapshot = {
    width: number;
    height: number;
    aspect: number;
    mobileBlend: number;
    mobileTarget: number;
    isAnimating: boolean;
};

export type ViewportRef = RefObject<ViewportSnapshot>;

export function createViewportSnapshot(): ViewportSnapshot {
    return {
        width: typeof window !== "undefined" ? window.innerWidth : 1280,
        height: typeof window !== "undefined" ? window.innerHeight : 800,
        aspect: 1.6,
        mobileBlend: 0,
        mobileTarget: 0,
        isAnimating: false,
    };
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
    return [
        THREE.MathUtils.lerp(a[0], b[0], t),
        THREE.MathUtils.lerp(a[1], b[1], t),
        THREE.MathUtils.lerp(a[2], b[2], t),
    ];
}

export function smoothStep(current: number, target: number, delta: number, smoothness = 4.8): number {
    const factor = 1 - Math.exp(-smoothness * delta);
    return THREE.MathUtils.lerp(current, target, factor);
}

export function useViewportTracker(
    container: HTMLElement | null,
    onTargetChange?: (mobileTarget: number) => void
): ViewportRef {
    const ref = useRef<ViewportSnapshot>(createViewportSnapshot());
    const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevTarget = useRef(-1);

    useEffect(() => {
        if (!container) return;

        const mq = window.matchMedia("(max-width: 768px)");

        const apply = () => {
            const w = window.visualViewport?.width ?? window.innerWidth;
            const h = window.visualViewport?.height ?? window.innerHeight;
            const snap = ref.current;

            snap.width = w;
            snap.height = h;
            snap.aspect = w / Math.max(h, 1);
            snap.mobileTarget = mq.matches ? 1 : 0;
            snap.isAnimating = true;

            if (prevTarget.current !== snap.mobileTarget) {
                prevTarget.current = snap.mobileTarget;
                onTargetChange?.(snap.mobileTarget);
            }

            if (settleRef.current) clearTimeout(settleRef.current);
            settleRef.current = setTimeout(() => {
                snap.isAnimating = false;
            }, 520);

            window.dispatchEvent(new Event("resize"));
        };

        const ro = new ResizeObserver(apply);
        ro.observe(container);
        mq.addEventListener("change", apply);
        window.visualViewport?.addEventListener("resize", apply);
        window.addEventListener("orientationchange", apply);
        apply();

        return () => {
            ro.disconnect();
            mq.removeEventListener("change", apply);
            window.visualViewport?.removeEventListener("resize", apply);
            window.removeEventListener("orientationchange", apply);
            if (settleRef.current) clearTimeout(settleRef.current);
        };
    }, [container]);

    return ref;
}

/** CSS wrapper opacity for dark theme (desktop ↔ mobile). */
export function sceneWrapperOpacity(mobileBlend: number, isLight: boolean): number {
    if (isLight) {
        return THREE.MathUtils.lerp(0.55, 0.48, mobileBlend);
    }
    return THREE.MathUtils.lerp(0.92, 0.72, mobileBlend);
}
