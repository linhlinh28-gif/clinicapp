import { Outlet, NavLink } from 'react-router-dom';

export default function DoctorLayout({ me }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 16 }}>
        <h3>Doctor</h3>
        <p style={{ fontSize: 12, opacity: 0.8 }}>{me?.email}</p>
        <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
          <NavLink to="/doctor/dashboard">Dashboard</NavLink>
          <NavLink to="/doctor/appointments">Appointments</NavLink>
          <NavLink to="/doctor/patients">Patients</NavLink>
        </nav>
      </aside>

      <section style={{ padding: 24 }}>
        <Outlet />
      </section>
    </div>
  );
}

