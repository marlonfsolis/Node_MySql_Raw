import {check} from "express-validator";

import {GetListParam, IGetListParam} from "./index";


/* Interfaces */

export interface IPermission {
    name: string;
    description: string
}

export interface IGetPermissionsParam extends IGetListParam {
   name: string;
   description: string;
   name_s: string;
   description_s: string;
}


/* Classes */

/**
 * GetPermissions incoming params.
 */
export class GetPermissionsParam extends GetListParam implements IGetPermissionsParam {
    public name: string = ``;
    public description: string = ``;
    public name_s: string = ``;
    public description_s: string = ``;

    constructor(obj:any) {
        obj = (obj as unknown) as IGetPermissionsParam;
        super(obj);
        this.name = obj?.name?.toString() || ``;
        this.description = obj?.description?.toString() || ``;
        this.name_s = obj?.name_s?.toString() || ``;
        this.description_s = obj?.description_s?.toString() || ``;
    }
}


/**
 * Permission model class
 */
export class PermissionModel implements IPermission {
    public description: string;
    public name: string;

    constructor(p:IPermission) {
        this.name = p.name;
        this.description = p.description;
    }
}


/* Functions */

/**
 * Validate permission input param
 * */
export const permissionValidator = () => [
    check(`name`).exists().isLength({min:3, max:100}),
    check(`description`).optional().isLength({min:0, max:1000})
];

