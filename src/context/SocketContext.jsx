import { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ApiContext } from "./ApiContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const { local, server } = useContext(ApiContext);
    const [selectedSong, setSelectedSong] = useState(null);
    const [sessionQuit, setSessionQuit] = useState(false);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(local + "rehearsalHub")
            .build();

        conn.start().then(() => console.log("Connected to hub"));
        setConnection(conn);

        conn.on("SongSelected", (song) => {
            console.log("Received SongSelected:", song);
            setSelectedSong(song);
        });

        conn.on("SessionQuit", () => {
            console.log("Received SessionQuit");
            setSessionQuit(true);
            setSelectedSong(null); 
        });

        return () => {
            conn.stop();
        };

    }, []);

    return (
        <SocketContext.Provider value={{ connection, selectedSong }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);