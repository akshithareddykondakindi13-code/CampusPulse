
import { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import ReportIssue from "./components/ReportIssue.jsx";
import MyComplaints from "./components/MyComplaints.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { issueApi, getErrorMessage } from "./services/api.js";

const STORAGE_KEY = "campuspulse.user";

const isAdmin = (u) =>
  String(u?.role || "").toUpperCase() === "ADMIN";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState(
    user ? (isAdmin(user) ? "admin" : "dashboard") : "login"
  );

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMyIssues() {
    if (!user?.id || isAdmin(user)) return;

    setLoading(true);
    setError("");

    try {
      const data = await issueApi.getByUser(user.id);
      setIssues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id && !isAdmin(user)) {
      loadMyIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function handleLogin(u) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    setPage(isAdmin(u) ? "admin" : "dashboard");
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIssues([]);
    setError("");
    setPage("login");
  }

  if (!user) {
    return page === "register" ? (
      <Register onGoLogin={() => setPage("login")} />
    ) : (
      <Login
        onLogin={handleLogin}
        onGoRegister={() => setPage("register")}
      />
    );
  }

  const admin = isAdmin(user);
  let content;

  if (admin) {
    content = <AdminDashboard />;
  } else if (page === "report") {
    content = (
      <ReportIssue
        user={user}
        onSubmitted={() => {
          loadMyIssues();
          setPage("complaints");
        }}
      />
    );
  } else if (page === "complaints") {
    content = (
      <MyComplaints
        issues={issues}
        loading={loading}
        error={error}
        onRefresh={loadMyIssues}
        onReport={() => setPage("report")}
      />
    );
  } else {
    content = (
      <StudentDashboard
        user={user}
        issues={issues}
        loading={loading}
        error={error}
        onReport={() => setPage("report")}
        onViewAll={() => setPage("complaints")}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        admin={admin}
        page={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      <main className="container main">{content}</main>
    </div>
  );
}
