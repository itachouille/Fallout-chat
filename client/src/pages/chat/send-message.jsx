import { useState, useContext } from "react";
import UserContext from "../../hooks/userContext";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const { username, room, socket } = useContext(UserContext);
  const [errors, setErrors] = useState("");

  async function sendMessage(e) {
    e.preventDefault();
    const time = Date.now();
    const data = {
      message,
      username,
      room,
    };
    setMessage("");
    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errors = errorData.errors;
      setErrors(errors);
    } else {
      socket.emit("send_message", { username, room, message, time });
    }
  }

  return (
    <div className="chat-bottom">
      {errors && (
        <div className="error">
          <p>{errors}</p>
        </div>
      )}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          placeholder="Message..."
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors("");
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendMessage;
