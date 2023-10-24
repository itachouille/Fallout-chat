import { useContext } from "react";
import UserContext from "../hooks/userContext";

const Message = ({ message }) => {
  const { username } = useContext(UserContext);

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className="message">
      {message.username === username ? (
        <div style={{ textAlign: "right" }}>
          <p className="message-info">{message.username}</p>
          <p className="message-info">
            {formatDateFromTimestamp(message.createdAt)}
          </p>
          <p>{message.message}</p>
        </div>
      ) : (
        <div>
          <p className="message-info">{message.username}</p>
          <p className="message-info">
            {formatDateFromTimestamp(message.createdAt)}
          </p>
          <p>{message.message}</p>
        </div>
      )}
    </div>
  );
};

export default Message;
