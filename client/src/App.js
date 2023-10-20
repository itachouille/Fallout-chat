import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/chat/index";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io.connect(process.env.REACT_APP_BACK_URL);
https://1ezicw-4000.csb.app

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  return (
    <>
      <div className="overlay"></div>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  username={username}
                  setUsername={setUsername}
                  room={room}
                  setRoom={setRoom}
                  socket={socket}
                />
              }
            />
            <Route
              path="/chat"
              element={<Chat username={username} room={room} socket={socket} />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
