import { createContext, useContext, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { SERVER } from "../constants";

console.log("SERVER", SERVER);

export const socket = socketIOClient(SERVER)
export const SocketContext = createContext({})

export const useSocketContext = () => useContext(SocketContext)

export const IOProvider = ({ children }: any) => {
    const [games, setGames] = useState<any>([])

    useEffect(() => {
        socket.on('games_list', (data: any) => {
            //console.log("games_list", data)
            setGames(data)

        })
    }, [])

    return (
        <SocketContext.Provider
            value={{ socket: socket, games: games }}
        >
            {children}
        </SocketContext.Provider>
    )
}