import { Server } from "socket.io";
import * as dotenv from "dotenv";
dotenv.config();

const socketPort = parseInt(process.env.SOCKET_PORT) || 5001;

const socketServer = new Server(socketPort);

export default socketServer;
