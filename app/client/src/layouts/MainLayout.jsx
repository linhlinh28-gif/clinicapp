import { Outlet, Link } from 'react-router-dom';
import { api } from '../api';

export default function MainLayout({ me, setMe }) {
  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setMe(null);
  }

  return (
    <div>
      <header
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 600 }}>
            Clinic App
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!me && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {me && (
            <>
              {me.role === 'patient' && (
                <Link to="/patient/dashboard">My Dashboard</Link>
              )}
              {me.role === 'doctor' && (
                <Link to="/doctor/dashboard">My Dashboard</Link>
              )}
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                {me.email} ({me.role})
              </span>
              <button onClick={handleLogout}>Log out</button>
            </>
          )}
        </div>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
