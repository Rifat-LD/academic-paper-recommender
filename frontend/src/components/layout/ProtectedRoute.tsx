import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, but remember where they were trying to go
        // (so we can send them back there after login if we wanted to add that logic later)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child routes (Outlet)
    return <Outlet />;
}