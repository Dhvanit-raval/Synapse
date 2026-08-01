import React, { createContext, useContext, useState } from 'react';
import useToken from '../hooks/useToken.jsx';
import { apiUrl } from '../utils/apiBase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { token, setToken, removeToken } = useToken();
    const [user, setUser] = useState(null);
 
    const login = async (credentials) => {
        const response = await fetch(apiUrl('/api/users/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        setToken(data);
        return data;
    };

    const register = async (userData) => {
        const response = await fetch(apiUrl('/api/users/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
