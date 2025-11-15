import { Outlet, NavLink } from 'react-router-dom';
import { api } from '../api';

export default function PatientLayout({ me, setMe }) {
  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setMe(null);
    navigate('/');
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 16 }}>
        <h3>Patient</h3>
        <p style={{ fontSize: 12, opacity: 0.8 }}>{me?.email}</p>

        <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
          <NavLink to="/patient/dashboard">Dashboard</NavLink>
          <NavLink to="/patient/appointments">Appointments</NavLink>
          <NavLink to="/patient/profile">Profile</NavLink>
        </nav>

        <button style={{ marginTop: 24 }} onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <section style={{ padding: 24 }}>
        <Outlet />
      </section>
    </div>
  );
}

