import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ me, allowedRoles, children }) {
  if (!me) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(me.role)) return <Navigate to="/" />;
  return children;
}
