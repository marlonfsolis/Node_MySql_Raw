import {IGetPermissionsParam, IPermission} from "../models/PermissionModel";
import {IResult, ResultOk, ResultErrorBadRequest, ResultErrorNotFound} from "../shared/Result";
import {db} from "../shared/Database";
import {queries} from "../queries";


export default class PermissionRepository
{
    constructor() {}

    /**
     * Get a permission list
     */
    async getPermissions(params:IGetPermissionsParam): Promise<IResult<IPermission[]>> {
        let permissions = [] as IPermission[];

        /* Testing new DataBaseSingleton proc call */
        // const params = [
        //     new SqlParam(`offsetRows`,0, `in`),
        //     new SqlParam(`fetchRows`,0, `in`),
        //     new SqlParam(`filterJson`,null, `in`),
        //     new SqlParam(`searchJson`,null, `in`),
        //     new SqlParam(`result`,``, `out`)
        // ];
        // const r1 = await db1.call("sp_permissions_readlist",params);
        // console.log("Procedure: ", r1.getData<IPermission>());
        // const dataRow = r.getData<IPermission>(0);
        // const outputVal = r.getOutputJsonVal<IOutputResult>("@result");
        // console.log(dataRow, outputVal);




        /* Testing file queries */
        const params2 = {
            name:params.name,
            description:params.description,
            name_s:params.name_s,
            description_s:params.description_s,
            fetchRows: params.fetchRows.toString(),
            offsetRows: params.offsetRows.toString()
        };
        const r2 = await db.query(queries.permissionList_read, params2);
        permissions = r2.getData<IPermission[]>();


        return new ResultOk<IPermission[]>(permissions);
    }


    /**
     * Create a permission
     */
    async createPermission(p:IPermission): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        let params:any = { name: p.name };
        const exists = await db.exists(queries.permissionExists_read, params);
        if (exists) {
            // // Return an error result without log in DB.
            // return new ResultErrorBadRequest(
            //     `Permission already exists.`, `permissionRepository.createPermission`, `0`
            // )

            // Return an error result and log in DB.
            return ResultErrorBadRequest.instance(
                new Error(`Permission already exists.`), `permissionRepository.createPermission`);
        }

        let sql = `${queries.permission_create} ${queries.permission_read}`;
        const perRes = await db.query(sql, p, {multiStatements:true});
        permission = perRes.getData<IPermission[]>()[0];
        // console.log(permission);

        return new ResultOk(permission);
    }


    /**
     * Delete a permission
     */
    async deletePermission(pName:string): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const params:any = { name: pName };
        const sql = `${queries.permission_read} ${queries.permission_delete}`;
        const r = await db.query(sql, params, {multiStatements:true});
        // console.log(r);
        if (r.resultSetHeader.affectedRows === 0) {
                return ResultErrorNotFound.instance(
                    new Error(`Permission not found.`), `permissionRepository.deletePermission`);
        }
        permission = r.getData<IPermission[]>()[0];
        return new ResultOk(permission);
    }


    /**
     * Get a permission
     */
    async getPermission(pName:string): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const params:any = { name: pName };
        const sql = `${queries.permission_read}`;
        const r = await db.query(sql, params, {multiStatements:false});
        // console.log(r);
        permission = r.getData<IPermission[]>()[0];
        if (typeof permission === `undefined`) {
            return ResultErrorNotFound.instance(
                new Error(`Permission not found.`), `permissionRepository.deletePermission`);
        }

        return new ResultOk(permission);
    }

    /**
     * Update a permission
     */
    async updatePermission(pName:string, p:IPermission): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        // verify tha new name
        if (pName !== p.name) {
            const r = await this.getPermission(p.name);
            if (r.success && r.data && r.data.name === p.name) {
                return new ResultErrorBadRequest(
                    `Permission already exist.`, `permissionRepository.updatePermission`, `0`
                )
            }
        }

        const params = {name:pName, newName:p.name, newDescription:p.description};
        const sql = `${queries.permission_update}`;
        let sr = await db.query(sql, params, {multiStatements:true});
        permission = sr.getData<IPermission[]>(0)[0];

        // verify that was found/updated
        if (sr.resultSetHeader.affectedRows === 0) {
            return new ResultErrorNotFound(
                `Permission not found.`, `permissionRepository.updatePermission`, `0`
            )
        }

        return new ResultOk(permission);
    }
}
