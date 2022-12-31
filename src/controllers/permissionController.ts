import {Request, Response} from "express";
import {validationResult} from "express-validator";

import PermissionService from "../services/permissionService";
import {
    HttpResponseBadRequest,
    HttpResponseCreated, HttpResponseError,
    HttpResponseInternalServerError, HttpResponseNotFound,
    HttpResponseOk
} from "../shared/HttpResponse";
import {GetPermissionsParam, IPermission} from "../models/PermissionModel";
import {IErr, validateReq} from "../shared/Err";

const permServ = new PermissionService();

/**
 * Get permission list.
 */
export const getPermissions = async (req:Request, res:Response) => {
    const params = new GetPermissionsParam(req.query);
    const permServ = new PermissionService();

    const result = await permServ.getPermissions(params);
    if (!result.success) {
        return new HttpResponseInternalServerError(res, [result.err!]);
    }

    const permissions = result.data;
    return new HttpResponseOk(res, permissions);
};


/**
 * Post a permission
 */
export const createPermission = async (req: Request, res: Response) => {
    const {isValid, errs} = validateReq(req);
    if (!isValid) {
        return new HttpResponseBadRequest(res, errs);
    }

    const p = req.body as IPermission;
    const result = await permServ.createPermission(p);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }

    return new HttpResponseCreated(res, result.data);
};


/**
 * DELETE a permission
 */
export const deletePermission = async (req: Request, res: Response) => {
    const pName = req.params.name;
    const result = await permServ.deletePermission(pName);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }

    return new HttpResponseOk(res, result.data);
};


/**
 * GET a permission
 */
export const getPermission = async (req: Request, res: Response) => {
    const pName = req.params.name;
    const result = await permServ.getPermission(pName);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }
    return new HttpResponseOk(res, result.data);
};


/** Put a permission */
export const updatePermission = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: false }) as IErr[];
        return new HttpResponseBadRequest(res, errs);
    }

    const pName = req.params.name;
    const p = req.body as IPermission;
    const result = await permServ.updatePermission(pName, p);
    if (!result.success || !result.data) {
        const code = result.getErrorCode();
        if (code === `400`) return new HttpResponseBadRequest(res, [result.err!]);
        if (code === `404`) return new HttpResponseNotFound(res, [result.err!]);
        return new HttpResponseInternalServerError(res,[result.err!]);
    }

    return new HttpResponseOk(res, result.data);
};
