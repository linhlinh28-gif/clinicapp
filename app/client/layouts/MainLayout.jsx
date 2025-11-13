import { Outlet, Link } from 'react-router-dom';

export default function MainLayout({ me, setMe }) {
  return (
    <div>
      <header style={{ padding: '12px 24px', borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Link to="/">Clinic App</Link>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {!me && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {me && (
              <>
                {me.role === 'patient' && <Link to="/patient/dashboard">My Dashboard</Link>}
                {me.role === 'doctor' && <Link to="/doctor/dashboard">My Dashboard</Link>}
              </>
            )}
          </div>
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
