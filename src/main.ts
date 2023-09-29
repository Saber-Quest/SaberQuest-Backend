import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env"});
import { readdirSync } from "fs";
import express from "express";
import { setupRoutes } from "./router";
import path from "path";
import cookieParser from "cookie-parser";
const folders = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < folders.length; i++) {
    const files = readdirSync(path.join(__dirname, "api", folders[i]));
    for (let j = 0; j < files.length; j++) {
        require(`./api/${folders[i]}/${files[j]}`);
    }
}
import expressJSDocSwagger from "express-jsdoc-swagger";
import switchChallenge from "./functions/challenges/dailyChallenge";
import switchShop from "./functions/items/shop";
import socketServer from "./websocket";
import autoComplete from "./functions/challenges/autoComplete";

async function main() {
    const httpPort = parseInt(process.env.PORT) || 5000;
    const app = express();

    app.use(require("express-status-monitor")());

    const options = {
        info: {
            version: "1.0.0",
            title: "SaberQuest API",
            description: "SaberQuest API",
            license: {
                name: "Apache 2.0",
            }
        },
        baseDir: __dirname,
        filesPattern: "./api/**/*.{ts,js}",
        swaggerUIPath: "/docs",
        exposeSwaggerUI: true,
        exposeApiDocs: false,
        apiDocsPath: "/docs.json",
        notRequiredAsNullable: false,
        swaggerUiOptions: {},
    };

    expressJSDocSwagger(app)(options);

    app.use(cookieParser());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));

    app.disable("x-powered-by");

    setupRoutes(app);

    app.use(express.static("public"));

    app.listen(httpPort, () => {
        console.log(
            `App is listening to port ${httpPort} | https://localhost:${httpPort}!`
        );
    });

    console.log(`Websocket server listening on port ${process.env.SOCKET_PORT || 5001}`);

    socketServer.on("connection", (socket: any) => {
        console.log(
            `New listener connected.\nID: ${socket.id}\nIP: ${socket.handshake.address} (${socket.handshake.headers["x-forwarded-for"]})\n\n`
        );
    });

    setInterval(() => {
        switchChallenge();
        switchShop();
        autoComplete();
    }, 1000 * 60);
}

main();
