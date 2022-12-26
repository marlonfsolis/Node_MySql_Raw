import {check} from "express-validator";
import {GetListParam} from "./index";

/* Interfaces */

export interface IPermission {
    name: string;
    description: string
}

export interface IGetPermissionsParam {
   name: string;
   description: string;
   name_s: string;
   description_s: string;
   offsetRows: string;
   fetchRows: string;
}


/* Classes */

/**
 * GetPermissions incoming params.
 */
export class GetPermissionsParam extends GetListParam implements GetPermissionsParam{
    public name: string = ``;
    public description: string = ``;
    public name_s: string = ``;
    public description_s: string = ``;

    constructor(obj:any) {
        super(obj);
        this.name = obj.name?.toString() || ``;
        this.description = obj.description?.toString() || ``;
        this.name_s = obj.name_s?.toString() || ``;
        this.description_s = obj.description_s?.toString() || ``;
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

