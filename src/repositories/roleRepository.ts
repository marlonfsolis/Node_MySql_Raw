import {IResult, ResultOk, ResultErrorNotFound, ResultErrorBadRequest} from "../shared/Result";
import {RoleModel} from "../models/RoleModel";
import {IRole,GetRolesParam} from "../models/RoleModel";
import {db} from "../shared/Database";
import {queries} from "../queries";
import {dbDebug} from "../startup/debuggers";


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

        // // Check if exists
        // const exists = await kt.exists(Models.role, {name: r.name});
        // if (exists) {
        //     return ResultErrorBadRequest.instance(
        //         new Error(`Role already exists.`), `roleRepository.createRole`);
        // }
        //
        // await db<IRole>(Models.role).insert(r);
        // role = await db<IRole>(Models.role)
        //     .where(`name`, r.name)
        //     .first(`*`);

        return new ResultOk(role);
    }


    /**
     * Delete a role
     */
    async deleteRole(gName:string): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        // const query = db<IRole>(Models.role)
        //     .where(`name`, gName);
        //
        // const del = await query.select(`*`);
        // if (del.length === 0) {
        //     return new ResultErrorNotFound(
        //         `RoleModel not found.`, `roleRepository.deleteRole`, `0`
        //     );
        // }
        //
        // role = del[0];
        // await query.delete();

        return new ResultOk(role);
    }


    /**
     * Get a role
     */
    async getRole(gName:string): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        // const roles = await db<IRole>(Models.role)
        //     .where(`name`, gName)
        //     .select(`*`);
        // if (roles.length === 0) {
        //     return new ResultErrorNotFound(
        //         `RoleModel not found.`, `roleRepository.getRole`, `0`
        //     )
        // }
        //
        // role = roles[0];
        return new ResultOk(role);
    }


    /**
     * Update a role
     */
    async updateRole(gName:string, r:IRole): Promise<IResult<IRole>> {
        let role: IRole|undefined;

        // // Check if the target exists
        // let exists = await kt.exists<IRole>(Models.role, {name: gName});
        // if (!exists) {
        //     return new ResultErrorNotFound(
        //         `RoleModel not found.`, `roleRepository.updateRole`, `0`
        //     )
        // }

        // // Check if the new name is valid
        // const newNameExists = await db<IRole>(Models.role)
        //     .where(`name`,r.name)
        //     .andWhereNot(`name`, gName)
        //     .select(`name`);
        // if (newNameExists.length > 0) {
        //     return new ResultErrorBadRequest(
        //         `RoleModel already exists.`, `roleRepository.updateRole`, `0`
        //     )
        // }
        //
        // // Update
        // await db<IRole>(Models.role)
        //     .where(`name`, gName)
        //     .update(r);
        //
        // // Return the new role
        // const updated = await db<IRole>(Models.role)
        //     .where(`name`, r.name)
        //     .select(`*`);
        // role = updated[0];

        return new ResultOk(role);
    }
}
