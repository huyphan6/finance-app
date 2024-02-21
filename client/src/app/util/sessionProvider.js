import React, { useState, useContext, createContext } from "react";

// Create context to store user data in a session
const SessionContext = createContext();

// Session Provider component

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState();

    // Function to set user session data
    const login = (userData) => {
        setUser(userData);
    };

    // Function to clear user session data
    const logout = () => {
        setUser(null);
    };

    return (
        <SessionContext.Provider value={{ user, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook to access session data
export const useSession = () => {
    return useContext(SessionContext);
  };