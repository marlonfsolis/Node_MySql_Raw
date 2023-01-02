import {IResult, ResultOk, ResultErrorNotFound, ResultErrorBadRequest} from "../shared/Result";
import {RoleModel} from "../models/RoleModel";
import {IRole,GetRolesParam} from "../models/RoleModel";
import {db} from "../shared/Database";
import {queries} from "../queries";
import {dbDebug} from "../startup/debuggers";
import {IPermission} from "../models/PermissionModel";


/**
 * Role Repository
 */
export default class RoleRepository
{
    constructor() {}


    /**
     * Get a role list
     */
    async getRoles(params:GetRolesParam): Promise<IResult<IRole[]>> {
        let roles = [] as IRole[];
        const sr = await db.query(queries.roleList_read, params);
        roles = sr.getData<IRole[]>();

        return new ResultOk<IRole[]>(roles);
    }


    /**
     * Create a role
     */
    async createRole(r:IRole): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        let params:any = { name: r.name };
        const exists = await db.exists(queries.roleExists_read, params);
        if (exists) {
            // Return an error result without log in DB.
            return new ResultErrorBadRequest(
                `Role already exists.`, `roleRepository.createRole`, `0`
            )
        }

        let sql = `${queries.role_create} ${queries.role_read}`;
        const sqlRes = await db.query(sql, r, {multiStatements:true});
        role = sqlRes.getData<IRole[]>()[0];
        // console.log(sqlRes);

        return new ResultOk(role);
    }


    /**
     * Delete a role
     */
    async deleteRole(rName:string): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        const params:any = { name: rName };
        const sql = `${queries.role_read} ${queries.role_delete}`;
        const r = await db.query(sql, params, {multiStatements:true});
        // console.log(r);
        if (r.resultSetHeader.affectedRows === 0) {
            return ResultErrorNotFound.instance(
                new Error(`Role not found.`), `roleRepository.deleteRole`);
        }
        role = r.getData<IRole[]>()[0];

        return new ResultOk(role);
    }


    /**
     * Get a role
     */
    async getRole(rName:string): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        const params:any = { name: rName };
        const sr = await db.query(queries.role_read, params);
        role = sr.getData<IRole[]>()[0];
        // console.log(sr);
        if (sr.data.length === 0) {
            return new ResultErrorNotFound(`Role not found.`, `roleRepository.getRole`);
        }

        return new ResultOk(role);
    }


    /**
     * Update a role
     */
    async updateRole(rName:string, r:IRole): Promise<IResult<IRole>> {
        let role: IRole|undefined;


        return new ResultOk(role);
    }
}
