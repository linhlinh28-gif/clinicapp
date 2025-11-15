import { Navigate } from 'react-router-dom';
import LoginForm from '../../LoginForm';

export default function LoginPage({ me, setMe }) {
  if (me) {
    // already logged in → send to appropriate dashboard
    return (
      <Navigate
        to={me.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
      />
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={setMe} />
    </div>
  );
}

