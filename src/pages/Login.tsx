import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../store";

export const DEMO_EMAIL = "im@witpartners.com";
export const DEMO_PASSWORD = "witdemo";

export function Login() {
  const { currentUser, login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restore = () => {
      setEmail(DEMO_EMAIL);
      setPassword(DEMO_PASSWORD);
    };
    restore();
    const timer = window.setTimeout(restore, 50);
    return () => window.clearTimeout(timer);
  }, []);

  if (currentUser) return <Navigate to="/home" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = login(email, password);
    if (message) setError(message);
    else navigate("/home");
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <p className="login-kicker">WIT Partners</p>
        <h1>Research Portal</h1>
        <p>Sign in to ingest research, score sources, and ask the assistant.</p>
        {error ? <p className="error">{error}</p> : null}
        <label className="field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name="demo-email"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            name="demo-password"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            required
          />
        </label>
        <button className="btn" type="submit">
          Sign in
        </button>
        <div className="hint">
          UI demo only. JSON files stand in for PostgreSQL. Credentials stay filled after sign-out.
        </div>
      </form>
    </div>
  );
}
