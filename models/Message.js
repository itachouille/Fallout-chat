const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    message: String,
    username: String,
    room: String,
    time: Number,
  },
  {
    timestamps: true,
  }
);

const MessageModel = model("Message", MessageSchema);

module.exports = MessageModel;
