import { SocketContext } from "../store/socketProvider";
import { useContext } from "react";

export const useSocketContext = () =>{
    const context = useContext(SocketContext);

    if(!context) throw new Error("No socket context provided");

    return context;
}