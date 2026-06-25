import { StatusDashboard } from "@/components/status/StatusDashboard";

export default function StatusPage() {
    return (
        <>
            <header className="page-header container">
                <h1>Status Monitor</h1>
                <p>Portfolio stats and link health checks for key endpoints.</p>
            </header>
            <div className="container">
                <StatusDashboard />
            </div>
        </>
    );
}
