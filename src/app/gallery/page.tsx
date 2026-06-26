import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Gallery",
    "Personal snapshots — work, learning, and life."
);

export default function GalleryPage() {
    return (
        <>
            <header className="page-header container">
                <h1>Gallery</h1>
                <p>Personal snapshots — work, learning, and life. Placeholder tiles ready for your photos.</p>
            </header>
            <div className="container">
                <GalleryGrid />
            </div>
        </>
    );
}
