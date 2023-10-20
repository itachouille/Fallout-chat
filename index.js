import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const CHAT_BOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}

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
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });

  socket.on("send_message", (data) => {
    const { room } = data;
    io.in(room).emit("receive_message", data);
    app.post("/chat", async (req, res) => {
      try {
        const { message, username, room, time } = req.body;
        const newMessage = new Message({
          message,
          username,
          room,
          time,
        });
        const savedMessage = await newMessage.save();
        res.send(savedMessage);
      } catch (error) {
        console.error(error);
        res.status(500).send("error");
      }
    });
  });

  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const time = Date.now();
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      time: time,
    });
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

mongoose.connect(process.env.MONGO_URL).catch((err) => {
  console.error(`Erreur lors de la connection initiale à MongoDB: ${err}`);
});

mongoose.connection.on("connected", () => {
  console.log("Connecté à MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Erreur de connection à MongoDB: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Déconnexion de MongoDB");
});

server.listen(port, () => console.log(`Server is running on port: ${port}`));
