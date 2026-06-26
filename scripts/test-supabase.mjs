/**
 * Test Supabase visits table. Run: node scripts/test-supabase.mjs
 * Loads .env.local then .env via dotenv if available, else uses process.env.
 */
import { readFileSync, existsSync } from "fs";

function loadEnvFile(path) {
    if (!existsSync(path)) return;
    for (const line of readFileSync(path, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i === -1) continue;
        const k = t.slice(0, i).trim();
        const v = t.slice(i + 1).trim();
        if (!process.env[k]) process.env[k] = v;
    }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or key in .env.local");
    process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}` };

const get = await fetch(`${url}/rest/v1/visits?select=id&limit=1`, { headers });
const getBody = await get.text();
console.log("GET /visits:", get.status, getBody);

if (!get.ok) {
    if (getBody.includes("PGRST205")) {
        console.error("\n→ Fix: run supabase/visits.sql in Supabase SQL Editor");
    }
    process.exit(1);
}

const id = `script-test-${Date.now()}`;
const post = await fetch(`${url}/rest/v1/visits`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({
        id,
        countryCode: "IN",
        countryName: "India",
        city: "Puri",
        region: "Odisha",
        deviceType: "desktop",
        deviceLabel: "Desktop · Test",
        browser: "Script",
        os: "Node",
        page: "/status",
        timestamp: new Date().toISOString(),
    }),
});
const postBody = await post.text();
console.log("POST /visits:", post.status, postBody);
process.exit(post.ok ? 0 : 1);
