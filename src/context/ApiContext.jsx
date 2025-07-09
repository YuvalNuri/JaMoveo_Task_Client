import { createContext } from "react";

export const ApiContext = createContext();

export default function ApiContextProvider({ children }) {
    const server = "";
    const local = "https://localhost:7142/";

    return (
        <ApiContext.Provider value={{ server, local }}>
            {children}
        </ApiContext.Provider>
    );
}