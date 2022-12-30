import {NextFunction, Request, Response} from "express";
import {Err, IErr} from "../shared/Err";
import {HttpResponseInternalServerError, HttpResponseNotFound} from "../shared/HttpResponse";
import ErrorService from "../services/errorService";
import {ErrorLevel} from "../models/ErrorLogModel";

const errorServ = new ErrorService();

/**
 * GET Page not found
 */
export const pageNotFound = async (req: Request, res: Response) => {
    const error = new Error(`API route not found. Route: ${req.method} ${req.baseUrl} query:${JSON.stringify(req.query)} body:${JSON.stringify(req.body)} ips:${req.ips}`);
    const errLog = await errorServ.logError(error, `API route not found.`, ErrorLevel.Fatal);
    const errs = [
        new Err(`API route not found.`, ``)
    ] as IErr[];
    return new HttpResponseNotFound(res, errs);
};


/**
 * GET page error not handled
 */
export const errorNotHandled = async (error:Error, req:Request, res:Response, next:NextFunction) => {
    const errLog = await errorServ.logError(error, `Error not handled.`, ErrorLevel.Fatal);
    const errs = [
        new Err(`API route error not handled.`, ``, errLog.errorLogId.toString())
    ] as IErr[];
    return new HttpResponseInternalServerError(res, errs);
};

