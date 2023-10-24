import { useState, useEffect, useRef, useContext } from "react";
import Message from "../../components/Message";
import UserContext from "../../hooks/userContext";

const Messages = () => {
  const { room, socket } = useContext(UserContext);
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    getOldMessages(room);
  }, [room]);

  function getOldMessages(room) {
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
  }

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          createdAt: data.time,
        },
      ]);
      scrollRef.current?.scrollIntoView();
    };

    socket.on("receive_message", receiveMessage);

    return () => socket.off("receive_message", receiveMessage);
  }, [socket]);

  return (
    <>
      <div className="messages-container">
        {oldMessages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        {messagesRecieved.map((message, index) => (
          <Message message={message} key={index} />
        ))}
      </div>
      <div ref={scrollRef}></div>
    </>
  );
};

export default Messages;
