import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import{ jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, token }) => {
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);

        // Vérifiez l'expiration du token
        if (decodedToken.exp * 1000 < Date.now()) {
            return <Navigate to="/login" replace />;
        }

        // Vérifiez si l'utilisateur a le rôle requis
        if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    } catch (error) {
        // Token invalide
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;