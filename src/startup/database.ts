import {Express} from "express";

import {dbDebug} from './debuggers';
import {db, pool} from "../shared/Database";


const createDbConnection = (app: Express) => {
    dbDebug("Creating database connection pool...");

    app.locals.db = db;
    app.locals.pool = pool;
    // const pool = app.locals.pool;
    // pool.on('connection', function (connection:Connection) {
    //     dbDebug("Connection ID: " + connection.threadId.toString());
    // });
    // pool.on('acquire', function (connection:Connection) {
    //     dbDebug("Acquired Connection ID: " + connection.threadId.toString());
    // });
}

export default createDbConnection;
