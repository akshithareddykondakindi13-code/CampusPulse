import { useState } from "react";
import AuthLayout from "./AuthLayout.jsx";
import { userApi, getErrorMessage } from "../services/api.js";

export default function Register({ onGoLogin }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError(""); setSuccess("");
    if (form.fullName.trim().length < 2) return setError("Please enter your full name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await userApi.register({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password });
      setSuccess(res?.message || "Registration successful! You can now log in.");
      setForm({ fullName: "", email: "", password: "", confirm: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Register as a student to report campus issues.">
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success} <button type="button" className="link" onClick={onGoLogin}>Go to login</button></div>}
        <label>Full name<input value={form.fullName} onChange={set("fullName")} required /></label>
        <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
        <label>Password<input type="password" value={form.password} onChange={set("password")} required /></label>
        <label>Confirm password<input type="password" value={form.confirm} onChange={set("confirm")} required /></label>
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Registering…" : "Register"}</button>
        <p className="center muted">Already registered? <button type="button" className="link" onClick={onGoLogin}>Log in</button></p>
      </form>
    </AuthLayout>
  );
}
