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
    async createRole(g:IRole): Promise<IResult<IRole>> {
        return await this.roleRepo.createRole(g);
    }


    /**
     * Delete a role
     */
    async deleteRole(gName:string): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.deleteRole(gName);
        } catch (err: any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }

    /**
     * Get a role
     */
    async getRole(gName:string): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.getRole(gName);
        } catch (err:any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }

    /**
     * Update a role
     */
    async updateRole(gName:string, g:IRole): Promise<IResult<IRole>> {
        try {
            return await this.roleRepo.updateRole(gName, g);
        } catch (err:any) {
            return new ResultErrorInternalServer<IRole>(
                err.toString(),`roleService.deleteRole`, `0`);
        }
    }
}
