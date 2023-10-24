import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [50, "your message should not exceed 50 characters"],
    },
    username: {
      type: String,
      required: true,
    },
    room: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Message", MessageSchema);
