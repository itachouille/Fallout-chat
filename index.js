import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import chatRoutes from "./routes/chatRoute.js";
import setupSocketIO from "./socket/chatSocket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", chatRoutes);
app.use((err, _, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ message, stack: err.stack });
});

const server = http.createServer(app);
setupSocketIO(server);

mongoose.connect(process.env.MONGO_URL).catch((err) => {
  console.error(`Error during initial connection to MongoDB: ${err}`);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Disconnecting from MongoDB");
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
