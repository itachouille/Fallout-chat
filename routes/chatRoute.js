import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
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

export default router;
