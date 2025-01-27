import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, token, children }) => {
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
        if (
            allowedRoles &&
            !allowedRoles.some((role) => decodedToken.roles.includes(role))
        ) {
            return <Navigate to="/login" replace />;
        }

        return children;
    } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;