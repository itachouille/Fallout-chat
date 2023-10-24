import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../hooks/userContext";

export default function Home() {
  const validRooms = ["013", "101", "111", "076"];
  const { username, setUsername, room, setRoom, socket } =
    useContext(UserContext);
  const [usernameError, setUsernameError] = useState("");
  const [shelterError, setShelterError] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!username) {
      setUsernameError("Username is required.");
    } else if (!validRooms.includes(room)) {
      setShelterError("Please select a valid shelter.");
    } else {
      socket.emit("join_room", { username, room });
      navigate("/chat", { replace: true });
    }
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>VAULT-TEC Chat</h1>
        <img className="home-image" src="./fallout.png" alt="logo" />
      </div>
      <div className="home-login">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError("");
          }}
        />

        <select
          onChange={(e) => {
            setRoom(e.target.value);
            setShelterError("");
          }}
        >
          <option>Shelter Number</option>
          {validRooms.map((roomValue) => (
            <option key={roomValue} value={roomValue}>
              {roomValue}
            </option>
          ))}
        </select>
        <button onClick={joinRoom}>Join Room</button>
        {usernameError && <div className="error">{usernameError}</div>}
        {shelterError && <div className="error">{shelterError}</div>}
      </div>
    </div>
  );
}
