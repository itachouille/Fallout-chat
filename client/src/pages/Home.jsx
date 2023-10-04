import { useNavigate } from "react-router-dom";

export default function Home({ username, setUsername, room, setRoom, socket }) {
  const navigate = useNavigate();

  const joinRoom = () => {
    if (room !== "" && room !== "shelter number" && username !== "") {
      socket.emit("join_room", { username, room });
      navigate("/chat", { replace: true });
    } else return;
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <select onChange={(e) => setRoom(e.target.value)}>
          <option>shelter number</option>
          <option value="013">013</option>
          <option value="101">101</option>
          <option value="111">111</option>
          <option value="076">076</option>
        </select>
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
