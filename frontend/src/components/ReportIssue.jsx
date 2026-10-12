import { useState } from "react";
import { issueApi, getErrorMessage } from "../services/api.js";

const CATEGORIES = ["Electrical", "Plumbing", "Furniture", "Cleanliness", "Internet / IT", "Hostel", "Canteen", "Other"];
const EMPTY = { title: "", description: "", category: "", location: "" };

export default function ReportIssue({ user, onSubmitted }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions
    setError("");
    if (!form.title.trim() || !form.description.trim() || !form.category || !form.location.trim())
      return setError("Please fill in all fields.");
    setSubmitting(true);
    try {
      await issueApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        imageUrl: "",
        userId: user.id, // real ID returned by the login API
      });
      setForm(EMPTY);
      onSubmitted();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card pad narrow">
      <h1>Report an issue</h1>
      <p className="muted">Tell us what's wrong and where. The maintenance team will take it from there.</p>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert alert-error">{error}</div>}
        <label>Complaint title<input value={form.title} onChange={set("title")} maxLength={120} placeholder="Broken classroom fan" /></label>
        <label>Description<textarea rows={4} value={form.description} onChange={set("description")} placeholder="The ceiling fan is not working." /></label>
        <div className="grid-2">
          <label>Category
            <select value={form.category} onChange={set("category")}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Location<input value={form.location} onChange={set("location")} placeholder="Block A, Room 204" /></label>
        </div>
        <button className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit complaint"}</button>
      </form>
    </div>
  );
}
