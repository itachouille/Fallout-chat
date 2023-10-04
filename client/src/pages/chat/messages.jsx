import { useState, useEffect, useRef } from "react";

const Messages = ({ socket, username }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.time,
        },
      ]);
    });
    scrollRef.current?.scrollIntoView();
    return () => socket.off("receive_message");
  }, [socket, messagesRecieved]);

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className="messages-container">
      {messagesRecieved.map((message, index) => (
        <div ref={scrollRef} className="message" key={index}>
          {message.username === username ? (
            <div style={{ textAlign: "right" }}>
              <p className="message-info">{message.username}</p>
              <p className="message-info">
                {formatDateFromTimestamp(message.__createdtime__)}
              </p>
              <p>{message.message}</p>
            </div>
          ) : (
            <div>
              <p className="message-info">{message.username}</p>
              <p className="message-info">
                {formatDateFromTimestamp(message.__createdtime__)}
              </p>
              <p>{message.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
