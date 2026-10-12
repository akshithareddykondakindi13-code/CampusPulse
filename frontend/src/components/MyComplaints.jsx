import StatusBadge from "./StatusBadge.jsx";
import { formatDate } from "../services/api.js";

export default function MyComplaints({ issues, loading, error, onRefresh, onReport }) {
  return (
    <div className="stack">
      <div className="page-head">
        <h1>My complaints</h1>
        <button className="btn btn-ghost" onClick={onRefresh} disabled={loading}>{loading ? "Refreshing…" : "↻ Refresh"}</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading && issues.length === 0 && <p className="muted">Loading your complaints…</p>}
      {!loading && !error && issues.length === 0 && (
        <div className="card pad center">
          <p>No complaints yet. Spotted something broken on campus?</p>
          <button className="btn btn-primary" onClick={onReport}>Report your first issue</button>
        </div>
      )}
      {issues.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Description</th><th>Category</th><th>Location</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id}>
                  <td data-label="ID">#{i.id}</td>
                  <td data-label="Title"><strong>{i.title}</strong></td>
                  <td data-label="Description" className="desc">{i.description}</td>
                  <td data-label="Category">{i.category}</td>
                  <td data-label="Location">{i.location}</td>
                  <td data-label="Submitted">{formatDate(i)}</td>
                  <td data-label="Status"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
