import StatusBadge, { StatCard } from "./StatusBadge.jsx";

export default function StudentDashboard({ user, issues, loading, error, onReport, onViewAll }) {
  const count = (s) => issues.filter((i) => i.status === s).length;
  const v = (n) => (loading ? "…" : n);
  return (
    <div className="stack">
      <div className="page-head">
        <div><p className="muted">Welcome back,</p><h1>{user.fullName}</h1></div>
        <button className="btn btn-primary" onClick={onReport}>+ Report a new issue</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="grid-3">
        <StatCard label="Total submitted" value={v(issues.length)} />
        <StatCard label="Pending" value={v(count("PENDING"))} tone="stat-pending" />
        <StatCard label="Resolved" value={v(count("RESOLVED"))} tone="stat-resolved" />
      </div>
      <div className="card pad">
        <div className="row-between"><h2>Recent complaints</h2><button className="link" onClick={onViewAll}>View all</button></div>
        {!loading && issues.length === 0 && <p className="muted">You haven't reported any issues yet.</p>}
        <ul className="list">
          {issues.slice(0, 5).map((i) => (
            <li key={i.id}>
              <div><strong>#{i.id} · {i.title}</strong><div className="muted small">{i.category} · {i.location}</div></div>
              <StatusBadge status={i.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
