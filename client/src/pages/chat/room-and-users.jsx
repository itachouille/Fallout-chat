import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../hooks/userContext";

const RoomAndUsers = () => {
  const [roomUsers, setRoomUsers] = useState([]);
  const { username, room, socket } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connected_users", (connectedUsers) => {
      setRoomUsers(connectedUsers);
    });

    return () => socket.off("connected_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    navigate("/", { replace: true });
  };

  return (
    <div className="chat-header">
      <div className="chat-header-top">
        <h4 className="room-title">shelter n°{room}</h4>
        <button onClick={leaveRoom}>logout</button>
      </div>
      <div className="chat-header-bottom">
        {roomUsers.length > 0 && <h5 className="users-title">users:</h5>}
        <ul>
          {roomUsers.map((user) => (
            <li style={{ marginLeft: "0.3rem" }} key={user.id}>
              /{user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomAndUsers;
