import { Server } from "socket.io";
import { User } from "../../models/user/userModel.js";
import jwt from "jsonwebtoken";
import message from "./message.js";
import group from "./group.js";

let connectedUsers = [
  {
    userId: "userId1",
    socketId: "socketId1",
    groups: ["groupId1", "groupId2"],
    channels: ["channelId1", "channelId2"],
  },
];

const authenticateSocket = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
};

export const initialize = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket).on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);
    const userId = socket.decoded.userId;

    const user = await User.findById(userId);
    socket.username = user.username;
    connectedUsers.push({
      userId: socket.decoded.userId,
      socketId: socket.id,
      username: user.username,
    });

    message(socket, io);
    group(socket, io);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );
    });
  });
};

export const getConnectedUsers = () => connectedUsers;
