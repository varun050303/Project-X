import React from 'react'
import { useAuth } from '../../contexts/auth.context';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <div>...Loading</div>
    }

    if (!isAuthenticated) {
        console.log("not auhtenticated")
        return <Navigate to="/login" replace />;
    }

    console.log('Protected routes')
    return children
}

export default ProtectedRoutes
