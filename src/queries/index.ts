import path from "path";
import fs from "fs";

export const sql = (query:string) => fs.readFileSync(query, {encoding:"utf8"});

export const queries = {
    getPermissions: sql(path.resolve(__dirname, "getPermissions.sql"))
}
