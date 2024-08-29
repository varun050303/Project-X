import React, { useContext, useState, createContext, useEffect } from "react";
import { api } from "../api/axios.config"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchUserData = async () => {
        try {
            setLoading(true); // Start loading
            const verifyResponse = await api.get('/auth/verify-token');
            if (verifyResponse.data.data.isValid) {
                const userResponse = await api.get('/api/users/me');
                console.log("inside if block , userResponse", userResponse)
                setUser(userResponse.data);
                console.log("setIsAuthenticated is true")
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error verifying token or fetching user data:", error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false); // End loading
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

        if (storedUser && storedIsAuthenticated) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(JSON.parse(storedIsAuthenticated));
            setLoading(false);  // Set loading to false since we have the data
        } else {
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        }
    }, [user, isAuthenticated]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("Auth Context should be within authcontext provider")
    }
    return context
}