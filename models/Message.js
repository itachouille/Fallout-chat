import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    message: String,
    username: String,
    room: String,
    time: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Message", MessageSchema);
