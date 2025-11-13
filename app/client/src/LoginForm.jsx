import { useState } from "react";
import { api } from "./api";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("pat@clinic.test"); // seeded test user
  const [password, setPassword] = useState("password123"); // seeded password
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 8, maxWidth: 320, marginTop: 24 }}
    >
      <h2>Log in</h2>

      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <button type="submit">Sign in</button>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <p style={{ opacity: 0.7, fontSize: 12 }}>
        Test login: <code>pat@clinic.test / password123</code>
      </p>
    </form>
  );
}
