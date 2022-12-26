import { DatabaseConstructorOptions } from "./types/database.ts";
import { Transaction } from "./transaction.ts";
import { WebSocketClient, WebSocketServer } from "../deps.ts";

export class Database {
    port = 8080;
    tablesdir = "tables";

    constructor(options: DatabaseConstructorOptions) {
        this.port = options.port ?? this.port;
        this.tablesdir = options.tablesdir ?? this.tablesdir;
    }

    serve(): void {
        const wss = new WebSocketServer(this.port);
        wss.on("connection", function (ws: WebSocketClient) {
            let transaction: Transaction | null = null;

            ws.on("message", function (message: string) {
                if (transaction === null && message.toLowerCase() === "transaction") {
                    transaction = new Transaction();
                } else if (transaction === null) {
                    transaction = new Transaction();
                    transaction?.addStatement(message);
                    transaction?.commit();
                    transaction = null;
                } else if (message.toLowerCase() === "commit") {
                    transaction?.commit();
                } else {
                    transaction?.addStatement(message);
                }
            });

            ws.on("close", function () {

            });
        });
    }

    repl() {
        console.log("SargassumDB REPL");
        setInterval(() => {
            const statement = prompt(">>>") ?? "";
            let transaction: Transaction | null = new Transaction();
            transaction?.addStatement(statement);
            transaction?.commit();
            transaction = null;
        });
    }
}