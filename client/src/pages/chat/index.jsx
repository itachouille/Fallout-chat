import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import RoomAndUsers from "./room-and-users";

const Chat = ({ username, room, socket }) => {
  return (
    <div className="chat-container">
      <RoomAndUsers socket={socket} username={username} room={room} />
      <MessagesReceived socket={socket} username={username} />
      <SendMessage socket={socket} username={username} room={room} />
    </div>
  );
};

export default Chat;
