"use client";

import { useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { AnalysisOverlay, InsightsButton } from "@/components/overlay/AnalysisOverlay";

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);

    return (
        <>
            <Scene3D />
            <CursorGlow />
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
        </>
    );
}
