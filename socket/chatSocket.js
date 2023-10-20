import { Server } from "socket.io";
const CHAT_BOT = "ChatBot";
let chatRoom = null;
let allUsers = [];
let chatRoomUsers = [];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
      const { username, room } = data;
      socket.join(room);
      const time = Date.now();
      socket.to(room).emit("receive_message", {
        message: `${username} has joined the chat`,
        username: CHAT_BOT,
        time,
      });
      socket.emit("receive_message", {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        time,
      });
      chatRoom = room;
      allUsers.push({ id: socket.id, username, room });
      chatRoomUsers = [...allUsers.filter((user) => user.room === room)];
      io.to(room).emit("connected_users", chatRoomUsers);
      socket.emit("chatroom_users", chatRoomUsers);
    });

    socket.on("send_message", (data) => {
      const { room } = data;
      io.in(room).emit("receive_message", data);
    });

    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);
      const time = Date.now();
      allUsers = leaveRoom(socket.id, allUsers);
      chatRoomUsers = [...allUsers.filter((user) => user.room === room)];
      socket.to(room).emit("chatroom_users", chatRoomUsers);
      socket.to(room).emit("receive_message", {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        time: time,
      });
      io.to(room).emit("connected_users", chatRoomUsers);
    });

    socket.on("disconnect", () => {
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit("chatroom_users", allUsers);
        socket.to(chatRoom).emit("receive_message", {
          message: `${user.username} has left the chat`,
        });
      }
    });
  });
}

export default setupSocketIO;
