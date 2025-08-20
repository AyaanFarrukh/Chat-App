import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const auth = useAuth();
  const token = auth?.token ?? localStorage.getItem("token");
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true
    });


    setSocket(newSocket);

    newSocket.on("connect", () => setConnected(true));
    newSocket.on("disconnect", () => setConnected(false));
    newSocket.on("connect_error", (err) => {
      console.log("Socket connect error:", err.message || err);
    });

    newSocket.on("token_expired", () => {
      console.log("Token expired — disconnecting frontend socket");
      localStorage.removeItem("token");
      navigate("/email")
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () =>
  useContext(SocketContext) ?? { socket: null, connected: false };
