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
    let data: IRole|undefined;

    // const {isValid, errs} = validateReq(req);
    // if (!isValid) {
    //     return new HttpResponseBadRequest(res, errs);
    // }
    //
    // const g = new RoleModel(req.body as IRole);
    // const result = await roleServ.createRole(g);
    // if (!result.success || !result.data) {
    //     return new HttpResponseError(res, result);
    // }

    return new HttpResponseCreated(res, data);
};


/**
 * DELETE a role
 */
export const deleteRole = async (req: Request, res: Response) => {
    let data: IRole|undefined;

    // const gName = req.params.name;
    // const result = await roleServ.deleteRole(gName);
    // if (!result.success || !result.data) {
    //     return new HttpResponseError(res, result);
    // }

    return new HttpResponseOk(res, data);
};


/**
 * GET a role
 */
export const getRole = async (req: Request, res: Response) => {
    let data: IRole|undefined;

    // const gName = req.params.name;
    // const result = await roleServ.getRole(gName);
    // if (!result.success || !result.data) {
    //     return new HttpResponseError(res, result);
    // }

    return new HttpResponseOk(res, data);
};


/**
 * Put a role
 */
export const updateRole = async (req: Request, res: Response) => {
    let data: IRole|undefined;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const errs = errors.array({ onlyFirstError: false }) as IErr[];
    //     return new HttpResponseBadRequest(res, errs);
    // }
    //
    // const gName = req.params.name;
    // const g = req.body as IRole;
    // const result = await roleServ.updateRole(gName, g);
    // if (!result.success || !result.data) {
    //     return new HttpResponseError(res, result);
    // }

    return new HttpResponseOk(res, data);
};
