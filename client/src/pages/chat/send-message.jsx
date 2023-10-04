import { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  async function sendMessage(e) {
    e.preventDefault();
    const time = Date.now();
    const data = {
      message,
      username,
      room,
      time,
    };
    setMessage("");

    socket.emit("send_message", { username, room, message, time });
    try {
      await fetch("https://1ezicw-4000.csb.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="chat-bottom">
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={message}
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={!message}>
        Send
      </button>
    </form>
    </div>
  );
};

export default SendMessage;
