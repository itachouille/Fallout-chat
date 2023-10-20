import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import RoomAndUsers from "./room-and-users";

const Chat = () => {
  return (
    <div className="chat-container">
      <RoomAndUsers />
      <MessagesReceived  />
      <SendMessage />
    </div>
  );
};

export default Chat;
