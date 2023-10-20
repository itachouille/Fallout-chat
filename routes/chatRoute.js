import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.post("/chat", async (req, res, next) => {
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
    if (error.name === "ValidationError") {
      res.status(400).json({
        errors: Object.values(error.errors).map((val) => val.message),
      });
    } else {
      return next(error);
    }
  }
});

router.get("/chat/:room", async (req, res, next) => {
  try {
    const room = req.params.room;
    const oldMessages = await Message.find({ room });
    res.status(200).send(oldMessages);
  } catch (error) {
    return next(error);
  }
});

export default router;
