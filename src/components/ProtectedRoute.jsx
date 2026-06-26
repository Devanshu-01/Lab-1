import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for the /me check to resolve before deciding. Without this, a refresh
  // would briefly see user === null and bounce to /login before the cookie
  // session is restored.
  if (loading) {
    return <div className="route-loading">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
