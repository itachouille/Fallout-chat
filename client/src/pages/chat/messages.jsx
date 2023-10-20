import { useState, useEffect, useRef, useContext } from "react";
import UserContext from "../../hooks/userContext";

const Messages = () => {
  const { username, room, socket } = useContext(UserContext);
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_URL}/chat/${room}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .then((responseJson) => {
        setOldMessages(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [room]);

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
  }, [socket]);

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className="messages-container">
      <>
        {oldMessages.map((message, index) => (
          <div className="message" key={index}>
            {message.username === username ? (
              <div style={{ textAlign: "right" }}>
                <p className="message-info">{message.username}</p>
                <p className="message-info">
                  {formatDateFromTimestamp(message.time)}
                </p>
                <p>{message.message}</p>
              </div>
            ) : (
              <div>
                <p className="message-info">{message.username}</p>
                <p className="message-info">
                  {formatDateFromTimestamp(message.time)}
                </p>
                <p>{message.message}</p>
              </div>
            )}
          </div>
        ))}
      </>
      <>
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
      </>
    </div>
  );
};

export default Messages;
