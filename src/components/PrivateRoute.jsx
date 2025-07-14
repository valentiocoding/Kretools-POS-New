import { Navigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isValid, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading session...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
