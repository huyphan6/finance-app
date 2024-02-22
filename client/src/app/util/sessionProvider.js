import React, { useState, useContext, createContext } from "react";

// Create context to store user data in a session
const SessionContext = createContext();

// Session Provider component

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState({
        uuid: null,
        authToken: null
    });

    // Functions to update object props
    const updateUUID = (uuid) => {
        setUser({
            ...user,
            uuid: uuid
        })
    }

    const updateAuthToken = (authToken) => {
        setUser({
            ...user,
            authToken: authToken
        })
    }

    // Function to clear user session data
    const logout = () => {
        setUser({
            uuid: null,
            authToken: null
        });
    };

    return (
        <SessionContext.Provider value={{ user, updateUUID, updateAuthToken, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook to access session data
export const useSession = () => {
    return useContext(SessionContext);
  };