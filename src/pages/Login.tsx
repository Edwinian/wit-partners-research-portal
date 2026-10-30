import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../store";

export function Login() {
  const { currentUser, login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("im@witpartners.com");
  const [password, setPassword] = useState("witdemo");
  const [error, setError] = useState<string | null>(null);

  if (currentUser) return <Navigate to="/home" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = login(email, password);
    if (message) setError(message);
    else navigate("/home");
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <p className="login-kicker">WIT Partners</p>
        <h1>Research Portal</h1>
        <p>Sign in to ingest research, score sources, and ask the assistant.</p>
        {error ? <p className="error">{error}</p> : null}
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button className="btn" type="submit">
          Sign in
        </button>
        <div className="hint">
          UI demo only. JSON files stand in for PostgreSQL. Try {email} / witdemo.
        </div>
      </form>
    </div>
  );
}
