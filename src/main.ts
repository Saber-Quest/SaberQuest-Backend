import "reflect-metadata";
import { readdirSync } from "fs";
import express from "express";
import { setupRoutes } from "./router";
import { Server } from "socket.io";
import path from "path";
const files = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < files.length; i++) {
    require(`./api/${files[i]}`);
}

async function main() {
    const httpPort = 3000; // Private port, public secure port is 443, which gets routed through nginx.
    const socketPort = 8080;
    const app = express();
    const socketServer = new Server(socketPort);
    
    console.log(`Web socket started on port ${socketPort}.`);

    app.use(express.json());

    setupRoutes(app);
    
    app.use(express.static("public"));
    
    app.listen(httpPort, () => {
        console.log(`App is listening to port ${httpPort}!`)

    });

    socketServer.on("connection", (socket: any) => {
        console.log(`New listener connected.\nID: ${socket.id}\nIP: ${socket.handshake.address} (${socket.handshake.headers['x-forwarded-for']})\n\n`);
    });

}

main();
