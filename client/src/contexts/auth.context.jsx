import React, { useContext, useState, createContext, useEffect } from "react";
import { api } from "../api/axios.config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true); // Start loading
        const response = await api.get("/auth/verify-token");
        if (!response.data.data.isValid) {
          setIsAuthenticated(false);
        }
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("User verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth Context should be within authcontext provider");
  }
  return context;
}
