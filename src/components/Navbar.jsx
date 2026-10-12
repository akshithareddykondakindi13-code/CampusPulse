export default function Navbar({ user, admin, page, onNavigate, onLogout }) {
  const links = admin
    ? [["admin", "All complaints"]]
    : [["dashboard", "Dashboard"], ["report", "Report issue"], ["complaints", "My complaints"]];
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo">Campus<span>Pulse</span></div>
        <nav className="nav">
          {links.map(([key, label]) => (
            <button key={key} className={`navlink ${page === key || admin ? "active" : ""}`} onClick={() => onNavigate(key)}>{label}</button>
          ))}
          <span className="nav-user">{user.fullName} · {user.role}</span>
          <button className="btn btn-ghost" onClick={onLogout}>Log out</button>
        </nav>
      </div>
    </header>
  );
}
