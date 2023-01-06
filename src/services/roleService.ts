import {IResult, ResultErrorInternalServer} from "../shared/Result";
import {IRole, GetRolesParam, IRoleWithPermissions} from "../models/RoleModel";
import RoleRepository from "../repositories/roleRepository";
import {getRoleWithPermissions} from "../controllers/roleController";


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
        // console.log(params);
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
        return await this.roleRepo.deleteRole(rName);
    }


    /**
     * Get a role
     */
    async getRole(rName:string): Promise<IResult<IRole>> {
       return await this.roleRepo.getRole(rName);
    }

    /**
     * Update a role
     */
    async updateRole(rName:string, r:IRole): Promise<IResult<IRole>> {
        return await this.roleRepo.updateRole(rName, r);
    }

    /**
     * Get a role with permissions
     */
    async getRoleWithPermissions(rName:string): Promise<IResult<IRoleWithPermissions>> {
        return await this.roleRepo.getRoleWithPermissions(rName);
    }
}
