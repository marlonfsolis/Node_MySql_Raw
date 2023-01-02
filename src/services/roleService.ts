import {IResult, ResultErrorInternalServer} from "../shared/Result";
import {IRole, GetRolesParam} from "../models/RoleModel";
import RoleRepository from "../repositories/roleRepository";


export default class RoleService
{
    private readonly roleRepo:RoleRepository;

    constructor() {
        this.roleRepo = new RoleRepository();
    }


    /**
     * Get a role list
     */
    async getRoles(params:GetRolesParam): Promise<IResult<IRole[]>> {
        return await this.roleRepo.getRoles(params);
    }


    /**
     * Create a role
     */
    async createRole(r:IRole): Promise<IResult<IRole>> {
        return await this.roleRepo.createRole(r);
    }


    /**
     * Delete a role
     */
    async deleteRole(rName:string): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.deleteRole(rName);
        } catch (err: any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }

    /**
     * Get a role
     */
    async retRole(rName:string): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.getRole(rName);
        } catch (err:any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }

    /**
     * Update a role
     */
    async updateRole(rName:string, r:IRole): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.updateRole(rName, r);
        } catch (err:any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }
}
