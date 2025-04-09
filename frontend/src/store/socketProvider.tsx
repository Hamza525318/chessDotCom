import {useState,createContext,ReactNode} from "react";
import {Socket} from "socket.io-client";

interface SocketContextType{
    socket: Socket | null,
    setSocket : React.Dispatch<React.SetStateAction<Socket | null>>

}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketContextProvider = ({children}: {children: ReactNode})=>{
    const [socket, setSocket] = useState<Socket | null>(null);

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}