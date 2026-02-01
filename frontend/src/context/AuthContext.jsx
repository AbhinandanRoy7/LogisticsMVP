import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = (newToken, newRole) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        setToken(newToken);
        setRole(newRole);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
