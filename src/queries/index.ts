import path from "path";
import fs from "fs";

export const sql = (query:string) => fs.readFileSync(query, {encoding:"utf8"});

export const queries = {
    permissionList_read: sql(path.resolve(__dirname, "permission/permissionList_read.sql")),
    permission_read: sql(path.resolve(__dirname, "permission/permission_read.sql")),
    permissionExists_read: sql(path.resolve(__dirname, "permission/permissionExists_read.sql")),
    permission_create: sql(path.resolve(__dirname, "permission/permission_create.sql")),
    permission_delete: sql(path.resolve(__dirname, "permission/permission_delete.sql")),
    permission_update: sql(path.resolve(__dirname, "permission/permission_update.sql")),

    error_create: sql(path.resolve(__dirname, "error_queries/error_create.sql"))
}
