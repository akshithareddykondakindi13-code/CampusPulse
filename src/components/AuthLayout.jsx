export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="logo logo-lg">Campus<span>Pulse</span></div>
        <p>Broken fan? Leaky tap? Flickering lights? Report it and follow it until it's fixed.</p>
      </aside>
      <section className="auth-main">
        <div className="card auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
