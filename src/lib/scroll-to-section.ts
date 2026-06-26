/** Scroll to a section id with fixed-navbar offset. */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
    const el = document.getElementById(id);
    if (!el) return false;

    const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "68",
        10
    );
    const offset = navH + 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: Math.max(0, top), behavior });
    return true;
}
