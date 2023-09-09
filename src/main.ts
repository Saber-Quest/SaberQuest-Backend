import "reflect-metadata";
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
import * as dotenv from "dotenv";
dotenv.config();
import expressJSDocSwagger from "express-jsdoc-swagger";
import switchChallenge from "./functions/dailyChallenge";
import switchShop from "./functions/shop";
import socketServer from "./websocket";

async function main() {
    const httpPort = parseInt(process.env.PORT) || 5000;
    const app = express();

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
        filesPattern: "./api/**/*.ts",
        swaggerUIPath: "/docs",
        exposeSwaggerUI: true,
        exposeApiDocs: false,
        apiDocsPath: "/docs.json",
        notRequiredAsNullable: false,
        swaggerUiOptions: {},
    };

    expressJSDocSwagger(app)(options);

    app.use(cookieParser());
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

    console.log(`Websocket server listening on port ${process.env.SOCKET_PORT || 5001}`);

    socketServer.on("connection", (socket: any) => {
        console.log(
            `New listener connected.\nID: ${socket.id}\nIP: ${socket.handshake.address} (${socket.handshake.headers["x-forwarded-for"]})\n\n`
        );
    });

    setInterval(() => {
        switchChallenge()
        switchShop()
    }, 1000 * 60);
}

main();
