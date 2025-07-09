import React, { createContext, useContext, useState, useEffect } from "react";
import { ApiContext } from "./ApiContext";

const AuthContext = createContext({
    user: null,
    login: async () => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const { local, server } = useContext(ApiContext);
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem("user"))
    );
    

    const login = async (username, password) => {
        if (!username && !password) { //login by remembered
            const userFromStorage = localStorage.getItem("user");
            if (userFromStorage) {
                setUser(JSON.parse(userFromStorage));
                return;
            }
            console.warn("No user credentials and no user in localStorage");
            return;
        }

        await loginWithCredentials(username, password);
    };

    const loginWithCredentials = async ({ username, password }) => {
        const res = await fetch(local + "api/Auth/Login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Accept: "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server Error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem("user", JSON.stringify(data));
                setUser(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = { user, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
