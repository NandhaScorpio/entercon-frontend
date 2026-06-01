import { useLocation, Navigate } from "react-router-dom";

/**
 * RoleGuard Component
 * 
 * Protects routes based on user role.
 * If user's role is not in allowedRoles, redirects to /dashboard.
 * 
 * Usage:
 * <RoleGuard allowedRoles={["Admin"]}>
 *   <AddUsers />
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles = [] }) {
  const location = useLocation();
  const role = location.state?.role;

  // If no role found in state or role is not allowed, redirect to dashboard
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" state={location.state} replace />;
  }

  // Role is allowed, render children
  return children;
}
