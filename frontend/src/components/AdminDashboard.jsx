import { useEffect, useState } from "react";
import StatusBadge, { StatCard } from "./StatusBadge.jsx";
import { issueApi, getErrorMessage, formatDate, STATUSES } from "../services/api.js";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const data = await issueApi.getAll();
      setIssues(Array.isArray(data) ? data : []);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function changeStatus(issue, status) {
    if (status === issue.status) return;
    setSavingId(issue.id); setError(""); setNotice("");
    try {
      const updated = await issueApi.updateStatus(issue.id, status);
      // Update UI only after the backend confirms
      setIssues((list) => list.map((i) => (i.id === issue.id ? { ...i, ...(updated && typeof updated === "object" ? updated : {}), status: updated?.status || status } : i)));
      setNotice(`Complaint #${issue.id} marked ${status.replace("_", " ")}.`);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSavingId(null); }
  }

  async function remove(issue) {
    if (!window.confirm(`Delete complaint #${issue.id}?`)) return;
    setSavingId(issue.id); setError(""); setNotice("");
    try {
      await issueApi.remove(issue.id);
      setIssues((list) => list.filter((i) => i.id !== issue.id));
      setNotice(`Complaint #${issue.id} deleted.`);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSavingId(null); }
  }

  const count = (s) => issues.filter((i) => i.status === s).length;
  const v = (n) => (loading ? "…" : n);
  const owner = (i) => i.user?.fullName || i.userName || (i.userId ?? i.user?.id ?? "—");

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Admin dashboard</h1>
        <button className="btn btn-ghost" onClick={load} disabled={loading}>{loading ? "Refreshing…" : "↻ Refresh"}</button>
      </div>
      <div className="grid-4">
        <StatCard label="Total" value={v(issues.length)} />
        <StatCard label="Pending" value={v(count("PENDING"))} tone="stat-pending" />
        <StatCard label="In progress" value={v(count("IN_PROGRESS"))} tone="stat-progress" />
        <StatCard label="Resolved" value={v(count("RESOLVED"))} tone="stat-resolved" />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}
      {!loading && !error && issues.length === 0 && <div className="card pad center muted">No complaints have been submitted yet.</div>}
      {issues.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Location</th><th>Student</th><th>Submitted</th><th>Status</th><th>Change</th><th></th></tr></thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id}>
                  <td data-label="ID">#{i.id}</td>
                  <td data-label="Title"><strong>{i.title}</strong><div className="muted small desc">{i.description}</div></td>
                  <td data-label="Category">{i.category}</td>
                  <td data-label="Location">{i.location}</td>
                  <td data-label="Student">{owner(i)}</td>
                  <td data-label="Submitted">{formatDate(i)}</td>
                  <td data-label="Status"><StatusBadge status={i.status} /></td>
                  <td data-label="Change">
                    <select value={i.status} disabled={savingId === i.id} onChange={(e) => changeStatus(i, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td><button className="btn btn-danger" disabled={savingId === i.id} onClick={() => remove(i)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
