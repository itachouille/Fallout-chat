import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_BACK_URL);
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const contextValue = {
    username,
    setUsername,
    room,
    setRoom,
    socket,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContext;
