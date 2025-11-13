import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ me, allowedRoles, children }) {
  if (!me) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(me.role)) {
    // Logged in but wrong role → send them "home"
    return <Navigate to="/" />;
  }
  return children;
}
