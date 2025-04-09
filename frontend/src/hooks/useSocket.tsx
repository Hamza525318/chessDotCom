import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSocketContext } from "./useSocketContext";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export const useSocket = () => {
  const { socket, setSocket } = useSocketContext();

  useEffect(() => {
    console.log("SOCKET ID--->>",socket?.id);
    if (socket) {
      return; // If socket is already set, no need to initialize again
    }

    const socketInstance = io(WEBSOCKET_URL);

    // Listen for the connection event
    socketInstance.on("connect", () => {
      console.log("Connected to server with socket id:", socketInstance.id);
      setSocket(socketInstance); // Set the socket instance to state
    });

    // Handle disconnection
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocket(null); // Reset the socket on disconnect
    });

  }, [socket,setSocket]); // Empty dependency array ensures effect runs only once

  return socket;
};
