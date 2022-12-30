
export enum ErrorLevel {
    Fatal = 0,
    Error = 1,
    Info = 2,
    Debug = 3
}

export interface IErrorLogModel {
    errorLogId: number;
    level: ErrorLevel;
    message: string;
    detail: string;
    stack: string;
    errorDate: Date;
}

export class ErrorLogModel implements IErrorLogModel {
    public errorLogId: number;
    public level:ErrorLevel;
    public message: string;
    public detail: string;
    public stack: string;
    public errorDate: Date;

    constructor(errMsg:string, errDetail:string=``, errLevel:ErrorLevel=ErrorLevel.Error) {
        this.errorLogId = 0;
        this.level = errLevel;
        this.message = errMsg;
        this.detail = errDetail;
        this.stack = ``;
        this.errorDate = new Date();
    }

    public static createFromError(err: Error, errDetail:string=``, level:ErrorLevel=ErrorLevel.Error) {
        const errLog = new ErrorLogModel(err.message, errDetail, level);
        if (err.stack) {
            errLog.stack = JSON.stringify(err.stack);
        }
        return errLog;
    }

}
