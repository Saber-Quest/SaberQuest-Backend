import "reflect-metadata";
import { readdirSync } from "fs";
import express from "express";
import { setupRoutes } from "./router";
import { Server } from "socket.io";
import path from "path";
const folders = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < folders.length; i++) {
    const files = readdirSync(path.join(__dirname, "api", folders[i]));
    for (let j = 0; j < files.length; j++) {
        require(`./api/${folders[i]}/${files[j]}`);
    }
}
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const httpPort = 5000;
    const socketPort = 5001;
    const app = express();
    const socketServer = new Server(socketPort);

    console.log(`Web socket started on port ${socketPort}.`);

    app.use(express.json());
    app.use(express.urlencoded());

    app.disable("x-powered-by");

    setupRoutes(app);

    app.use(express.static("public"));

    app.listen(httpPort, () => {
        console.log(
            `App is listening to port ${httpPort} | https://localhost:${httpPort}!`
        );
    });

    socketServer.on("connection", (socket: any) => {
        console.log(
            `New listener connected.\nID: ${socket.id}\nIP: ${socket.handshake.address} (${socket.handshake.headers["x-forwarded-for"]})\n\n`
        );
    });
}

main();
