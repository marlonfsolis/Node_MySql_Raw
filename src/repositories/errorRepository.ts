import {db} from "../shared/Database";
import {queries} from "../queries";

import {ErrorLogModel, IErrorLogModel} from "../models/ErrorLogModel";


export default class ErrorRepository {
    constructor() {}

    /**
     * Log Error
     */
    async logError(errLog: ErrorLogModel)
    {
        const result = await db.query(queries.error_create, errLog);
        // console.log(result);
        errLog.errorLogId = result.resultSetHeader.insertId;

        return errLog;
    }
}
