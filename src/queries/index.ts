import path from "path";
import fs from "fs";

export const query = {
    getPermissions: path.resolve(__dirname, "getPermissions.sql")
}

export const sql = (query:string) => fs.readFileSync(query, {encoding:"utf8"});
