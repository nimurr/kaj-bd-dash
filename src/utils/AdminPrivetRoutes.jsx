import React from 'react'
import { Navigate } from 'react-router-dom';

export default function AdminPrivetRoutes({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return (
        <>
            {children}
        </>
    )

}
