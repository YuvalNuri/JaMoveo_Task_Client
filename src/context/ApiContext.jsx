import { createContext } from "react";

export const ApiContext = createContext();

export default function ApiContextProvider({ children }) {
    const server = "https://web-production-62c4b.up.railway.app/";
    const local = "https://localhost:7142/";

    return (
        <ApiContext.Provider value={{ server, local }}>
            {children}
        </ApiContext.Provider>
    );
}