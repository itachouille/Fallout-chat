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

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

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
    };
    socket.on("receive_message", receiveMessage);
    return () => socket.off("receive_message", receiveMessage);
  }, [socket]);

  return (
    <>
      <div className="messages-container" ref={scrollRef}>
        {oldMessages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        {messagesRecieved.map((message, index) => (
          <Message message={message} key={index} />
        ))}
      </div>
    </>
  );
};

export default Messages;
