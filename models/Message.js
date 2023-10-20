import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [100, "your message should not exceed 100 characters"],
    },
    username: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Message", MessageSchema);
