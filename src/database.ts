import { DatabaseConstructorOptions } from "./types/database.ts";
import { WebSocketClient, WebSocketServer } from "../deps.ts";

export class Database {
    port = 8080;
    tablesdir = "tables";

    constructor(options: DatabaseConstructorOptions) {
        this.port = options.port ?? this.port;
        this.tablesdir = options.tablesdir ?? this.tablesdir;
    }

    serve() {
        const wss = new WebSocketServer(this.port);
        wss.on("connection", function (ws: WebSocketClient) {
            ws.on("message", function (message: string) {
                console.log(message);
                ws.send(message);
            });
            
            ws.on("close", function () {

            });
        });
    }
}