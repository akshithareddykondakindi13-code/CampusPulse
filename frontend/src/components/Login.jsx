
import { useState } from "react";
import AuthLayout from "./AuthLayout.jsx";
import { userApi, getErrorMessage } from "../services/api.js";

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const user = await userApi.login({
        email: email.trim(),
        password,
      });

      if (!user || !user.id || !user.token) {
        throw new Error(
          user?.message || "Login failed. Authentication token is missing."
        );
      }

      // Store the user details and JWT token together.
      localStorage.setItem("campuspulse.user", JSON.stringify(user));

      // Pass the authenticated user to the application.
      onLogin(user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to report and track campus issues."
    >
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="center muted">
          New student?{" "}
          <button
            type="button"
            className="link"
            onClick={onGoRegister}
          >
            Create an account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
