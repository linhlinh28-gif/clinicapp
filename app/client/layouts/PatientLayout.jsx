import { Outlet, NavLink } from 'react-router-dom';

export default function PatientLayout({ me }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 16 }}>
        <h3>Patient</h3>
        <p style={{ fontSize: 12 }}>{me?.email}</p>
        <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
          <NavLink to="/patient/dashboard">Dashboard</NavLink>
          <NavLink to="/patient/appointments">Appointments</NavLink>
          <NavLink to="/patient/profile">Profile</NavLink>
        </nav>
      </aside>
      <section style={{ padding: 24 }}>
        <Outlet />
      </section>
    </div>
  );
}
