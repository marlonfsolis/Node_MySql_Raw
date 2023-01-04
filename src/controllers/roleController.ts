import {Request, Response} from "express";

import {
    HttpResponseBadRequest,
    HttpResponseCreated,
    HttpResponseError,
    HttpResponseOk
} from "../shared/HttpResponse";
import {IRole, RoleModel, GetRolesParam} from "../models/RoleModel";
import {validateReq} from "../shared/Err";
import RoleService from "../services/roleService";

const roleServ = new RoleService();

/**
 * Get role list.
 */
export const getRoles = async (req:Request, res:Response) => {
    let data: IRole[]|undefined;

    const params = new GetRolesParam(req.query);
    const result = await roleServ.getRoles(params);
    if (!result.success) {
        return new HttpResponseError(res, result);
    }
    data = result.data;

    return new HttpResponseOk(res, data);
};


/** Post a role */
export const createRole = async (req: Request, res: Response) => {
    let role: IRole|undefined;

    const {isValid, errs} = validateReq(req);
    if (!isValid) {
        return new HttpResponseBadRequest(res, errs);
    }

    const r = new RoleModel(req.body as IRole);
    const result = await roleServ.createRole(r);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }
    role = result.data;

    return new HttpResponseCreated(res, role);
};


/**
 * DELETE a role
 */
export const deleteRole = async (req: Request, res: Response) => {
    let role: IRole|undefined;

    const rName = req.params.name;
    const result = await roleServ.deleteRole(rName);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }
    role = result.data;

    return new HttpResponseOk(res, role);
};


/**
 * GET a role
 */
export const getRole = async (req: Request, res: Response) => {
    let data: IRole|undefined;

    const rName = req.params.name;
    const result = await roleServ.getRole(rName);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }
    data = result.data;

    return new HttpResponseOk(res, data);
};


/**
 * Put a role
 */
export const updateRole = async (req: Request, res: Response) => {
    let data: IRole|undefined;

    const {isValid, errs} = validateReq(req);
    if (!isValid) {
        return new HttpResponseBadRequest(res, errs);
    }

    const rName = req.params.name;
    const r = new RoleModel(req.body as IRole);
    const result = await roleServ.updateRole(rName, r);
    if (!result.success || !result.data) {
        return new HttpResponseError(res, result);
    }
    data = result.data;

    return new HttpResponseOk(res, data);
};
