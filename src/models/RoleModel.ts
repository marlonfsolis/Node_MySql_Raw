import {check} from "express-validator";

import {GetListParam, IGetListParam} from "./index";
import {IPermission} from "./PermissionModel";



/* Interfaces */

export interface IRole {
    name:string;
    description:string;
}

export interface IRoleWithPermissions {
    role: IRole;
    permissions: IPermission[];
}

export interface IGetRolesParam extends IGetListParam {
    name: string;
    description: string;
    name_s: string;
    description_s: string;
}




/* Classes */

/**
 * RoleModel class
 */
export class RoleModel implements IRole {
    public description: string;
    public name: string;

    constructor(r:IRole) {
        this.name = r.name;
        this.description = r.description;
    }
}


/**
 * RoleModel query class
 * */
export class GetRolesParam extends GetListParam implements IGetRolesParam {
    public name: string;
    public description: string;
    public name_s: string;
    public description_s: string;

    constructor(val:any) {
        val = (val as unknown) as IGetRolesParam;
        super(val);
        this.name = val?.name?.toString() || ``;
        this.description = val?.description?.toString() || ``;
        this.name_s = val?.name_s?.toString() || ``;
        this.description_s = val?.description_s?.toString() || ``;
    }
}



/* Functions */

/**
 * Validate role input param
 * */
export const roleValidator = () => [
    check(`name`).exists().isLength({min:3, max:100}),
    check(`description`).optional().isLength({min:0, max:1000})
];

