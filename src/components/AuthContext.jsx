import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
        isAuthenticated: false
    });

    // Sync authentication state with localStorage
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        if (userId && token) {
            setAuthState({
                userId: userId,
                token: token,
                isAuthenticated: true
            });
        }
    }, []);

    const login = (userId, token) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        setAuthState({
            userId,
            token,
            isAuthenticated: true
        });
    };

    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        setAuthState({
            userId: null,
            token: null,
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
