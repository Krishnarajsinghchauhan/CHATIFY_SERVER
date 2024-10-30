import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

const corsOptions = {
  origin: "https://chatify-lime-three.vercel.app", // Specific origin
  credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://chatify-lime-three.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true"); // Required for sending credentials
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/upload/profiles", express.static("upload/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", cors(), authRoutes);

app.use("/api/contacts", contactsRoutes);

app.use("/api/messages", messagesRoutes);

app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message));
