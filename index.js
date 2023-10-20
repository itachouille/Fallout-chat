import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import chatRoutes from "./routes/chatRoute.js";
import setupSocketIO from "./socket/chatSocket.js";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", chatRoutes);

const server = http.createServer(app);
setupSocketIO(server);

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
