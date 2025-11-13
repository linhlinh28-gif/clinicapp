import { useEffect, useState } from 'react';
import { api } from './api';
import LoginForm from './LoginForm';

export default function App() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if there's an existing session when the app loads
  useEffect(() => {
    (async () => {
      try {
        const user = await api('/api/auth/me');
        setMe(user);
      } catch {
        // not logged in, ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setMe(null);
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1>Clinic App</h1>

        {me ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>
              Signed in as <strong>{me.email}</strong> ({me.role})
            </span>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <span style={{ opacity: 0.7 }}>Not signed in</span>
        )}
      </header>

      {/* Main area */}
      {!me ? (
        <LoginForm onLogin={setMe} />
      ) : (
        <div>
          <h2>Dashboard</h2>
          <p>You are now logged in. This is where your calendar and data will go.</p>
        </div>
      )}
    </div>
  );
}
