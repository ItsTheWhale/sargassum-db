import { Database, DatabaseConstructorOptions } from "./mod.ts";
import { existsSync } from "https://deno.land/std@0.170.0/fs/mod.ts";

(async function () {
    const pathFound = existsSync(".sgmdbconfig.json");
    let config: DatabaseConstructorOptions = {};

    if (pathFound) {
        config = JSON.parse(await Deno.readTextFile(".sgmdbconfig.json")) as DatabaseConstructorOptions;
    }

    const db = new Database(config);
    
    db.serve();
})();