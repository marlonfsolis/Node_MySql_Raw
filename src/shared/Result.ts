import {Err, IErr} from "./Err";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import ErrorService from "../services/errorService";
import {ErrorLevel} from "../models/ErrorLogModel";

export interface IResult<T> {
    success: boolean;
    data?: T;
    err?: IErr;
    [key: string]: any;
    getErrorCode():string;
}

export class Result<T> implements IResult<T> {
    [key: string]: any;
    success: boolean;
    data?: T;
    err?: IErr;

    constructor(success?: boolean, data?: T, err?: IErr) {
        this.success = success === undefined ? true : success;
        this.data = data;
        this.err = err;
    }

    /**
     * Get the error code from the error message.
     * This will look for a text formatted like "500|Error message."
     */
    getErrorCode() {
        let code = `500`;
        const msgArr = this.err?.msg?.split(`|`);
        if (Array.isArray(msgArr) && msgArr.length > 1) {
            code = msgArr[0];
            // console.log(code);
        }

        if (!code) return `500`;
        return code.trim();
    }
}


export class ResultOk<T> extends Result<T> {
    constructor(data: T) {
        super(true, data, undefined);
    }
}

export class ResultError<T> extends Result<T> {
    /**
     * 500 error code by default. Final error code will be taken from error message.
     * Error message should be like "500|Error message."
     * @param err
     */
    constructor(err: IErr) {
        super(false, undefined, err);
    }

    static getDefaultError<T>(errMsg:string, location:string) {
        const space = errMsg.length > 0 ? ` ` : ``;
        return new ResultError<T>(
            new Err(
                `500|Something bad happen.${space}${errMsg}`,
                location
            )
        );
    }

    /**
     * 500 error code. Create an instance of a ResultError using an Error object.
     * This result will log the error on DB.
     * @param err Javascript error
     * @param detail Any additional detail
     * @param level Error level.
     */
    static async instance(err: Error, detail:string=``, level:ErrorLevel=ErrorLevel.Error): Promise<Result<never>> {
        return await this.createInstance(StatusCodes.INTERNAL_SERVER_ERROR, err, detail, level);
    }

    static async createInstance(errorCode:number, err: Error, detail:string=``, level:ErrorLevel=ErrorLevel.Error): Promise<Result<never>> {
        const errorServ = new ErrorService();
        const errorLog = await errorServ.logError(err,detail,level);

        let result: ResultError<never>;
        switch (errorCode) {
            case 400: result = new ResultErrorBadRequest<never>(errorLog.message, errorLog.detail, errorLog.errorLogId.toString()); break;
            case 404: result = new ResultErrorNotFound<never>(errorLog.message, errorLog.detail, errorLog.errorLogId.toString()); break;
            default: result = new ResultErrorInternalServer<never>(errorLog.message, errorLog.detail, errorLog.errorLogId.toString()); break;
        }
        return result;
    }
}

export class ResultErrorBadRequest<T> extends ResultError<T> {
    /**
     * 400 Status code. This constructor will not log the error on DB.
     * @param msg
     * @param location
     * @param errorLogId
     */
    constructor(msg: string, location:string, errorLogId: string) {
        if(msg.length === 0) msg = ReasonPhrases.BAD_REQUEST;
        const r_msg = `${StatusCodes.BAD_REQUEST}|${msg}`;
        const err = new Err(r_msg, location, errorLogId);
        super(err);
    }

    /**
     * 400 error code. Create an instance of a ResultErrorBadRequest using an Error object.
     * This result will log the error on DB.
     * @param err Javascript error
     * @param detail Any additional detail
     * @param level Error level.
     */
    static async instance(err: Error, detail:string=``, level:ErrorLevel=ErrorLevel.Error): Promise<Result<never>> {
        return this.createInstance(StatusCodes.BAD_REQUEST, err, detail, level);
    }
}

export class ResultErrorNotFound<T> extends ResultError<T> {
    /**
     * 404 error code.
     * @param msg
     * @param location
     * @param errorLogId
     */
    constructor(msg: string, location:string, errorLogId: string) {
        if(msg.length === 0) msg = ReasonPhrases.NOT_FOUND;
        const r_msg = `${StatusCodes.NOT_FOUND}|${msg}`;
        const err = new Err(r_msg, location, errorLogId);
        super(err);
    }

    /**
     * 404 error code. Create an instance of a ResultErrorNotFound using an Error object.
     * This result will log the error on DB.
     * @param err Javascript error
     * @param detail Any additional detail
     * @param level Error level.
     */
    static async instance(err: Error, detail:string=``, level:ErrorLevel=ErrorLevel.Error): Promise<Result<never>> {
        return this.createInstance(StatusCodes.NOT_FOUND, err, detail, level);
    }
}

export class ResultErrorInternalServer<T> extends ResultError<T> {
    /**
     * 500 error code.
     * @param msg
     * @param location
     * @param errorLogId
     */
    constructor(msg: string, location:string, errorLogId: string) {
        if(msg.length === 0) msg = ReasonPhrases.INTERNAL_SERVER_ERROR;
        const r_msg = `${StatusCodes.INTERNAL_SERVER_ERROR}|${msg}`;
        const err = new Err(r_msg, location, errorLogId);
        super(err);
    }

    /**
     * 500 error code. Create an instance of a ResultErrorInternalServer using an Error object.
     * This result will log the error on DB.
     * @param err Javascript error
     * @param detail Any additional detail
     * @param level Error level.
     */
    static async instance(err: Error, detail:string=``, level:ErrorLevel=ErrorLevel.Error): Promise<Result<never>> {
        return this.createInstance(StatusCodes.INTERNAL_SERVER_ERROR, err, detail, level);
    }
}
