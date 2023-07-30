import Hapi from "@hapi/hapi";
import http from "http";
import userRoutes from "./routes/user/userRoutes.js";
import dotenv from "dotenv";
import jwtStrategy from "./strategy/jwtStrategy.js";
import mongoose from "mongoose";
import eventRoutes from "./routes/event/eventRoutes.js";
import groupRoutes from "./routes/group/groupRoutes.js";
import { initialize } from "../src/handlers/chatHandlers/connection.js";
dotenv.config();

const init = async () => {
  try {
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: process.env.HOST || "localhost",
    });

    await jwtStrategy(server);

    server.route(userRoutes);
    server.route(eventRoutes);
    server.route(groupRoutes);

    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on(
      "error",
      console.error.bind(console, "Erreur de connexion à la base de données :")
    );
    db.once("open", () => {
      console.log("Connected to MongoDB Atlas");
    });

    // HTTP natif Socket.IO
    const httpServer = http.createServer();
    initialize(httpServer);

    // serv Hapi listen to server HTTP
    await server.start();
    httpServer.listen(server.info.port, () => {
      console.log(`Server and WebSocket listening on ${server.info.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

init();
