export default function StatusBadge({ status }) {
  const s = String(status || "PENDING").toUpperCase();
  const cls = s === "RESOLVED" ? "badge-resolved" : s === "IN_PROGRESS" ? "badge-progress" : "badge-pending";
  return <span className={`badge ${cls}`}>{s.replace("_", " ")}</span>;
}

export function StatCard({ label, value, tone = "" }) {
  return (
    <div className={`card stat ${tone}`}>
      <div className="muted">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
