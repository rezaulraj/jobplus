import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import axios from "axios";

const AuthGuard = () => {
  const { isAuthenticated, tokens, refreshTokens } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && tokens?.accessToken) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${tokens.accessToken}`;
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, tokens]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/jobseeker/login" replace />
  );
};

export default AuthGuard;
