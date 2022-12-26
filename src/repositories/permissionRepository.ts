import mysql, {Pool, ResultSetHeader} from "mysql2/promise";

import {IGetPermissionsParam, IPermission} from "../models/Permission";
import {IResult, ResultOk, ResultError} from "../shared/Result";
import {Err} from "../shared/Err";
import {IOutputResult, SqlParam} from "../shared/SqlResult";
import db, {pool, db as db1} from "../shared/Database";
import {queries, sql} from "../queries";


export default class PermissionRepository
{
    private readonly pool:Pool;

    constructor(pool:Pool) {
        this.pool = pool;
    }

    /**
     * Get a permission list
     */
    async getPermissions(params:IGetPermissionsParam): Promise<IResult<IPermission[]>> {
        let permissions = [] as IPermission[];

        const inValues = [0,0,null,null];
        const r = await db.call("sp_permissions_readlist",inValues,["@result"], this.pool);
        const callResult = r.getOutputJsonVal<IOutputResult>("@result");

        if (!callResult.success) {
            return new ResultError<IPermission[]>(
                new Err(callResult.msg, "sp_permissions_readlist", callResult.errorLogId.toString())
            );
        }

        permissions = r.getData<IPermission[]>(0);


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
        const r2 = await db1.query(queries.getPermissions, params2);
        permissions = r2.getData<IPermission[]>();


        return new ResultOk<IPermission[]>(permissions);
    }

    /** Create a permission */
    async createPermission(p:IPermission): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const inValues = [JSON.stringify(p)];
        const r = await db.call("sp_permissions_create", inValues,["@result"], this.pool);
        const callResult  = r.getOutputJsonVal<IOutputResult>("@result");

        if (!callResult.success) {
            return new ResultError(
                new Err(callResult.msg, "sp_permissions_create", callResult.errorLogId.toString())
            )
        }

        permission = r.getData<IPermission[]>(0)[0];
        return new ResultOk(permission);
    }

    /** Delete a permission */
    async deletePermission(pName:string): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const inValues = [pName];
        const r = await db.call("sp_permissions_delete", inValues,["@result"], this.pool);
        const callResult  = r.getOutputJsonVal<IOutputResult>("@result");

        if (!callResult.success) {
            return new ResultError(
                new Err(callResult.msg, "sp_permissions_delete", callResult.errorLogId.toString())
            )
        }

        permission = r.getData<IPermission[]>(0)[0];
        return new ResultOk(permission);
    }

    /** Get a permission */
    async getPermission(pName:string): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const inValues = [pName];
        const r = await db.call("sp_permissions_read", inValues,["@result"], this.pool);
        const callResult  = r.getOutputJsonVal<IOutputResult>("@result");

        if (!callResult.success) {
            return new ResultError(
                new Err(callResult.msg, "sp_permissions_read", callResult.errorLogId.toString())
            )
        }

        permission = r.getData<IPermission[]>(0)[0];
        return new ResultOk(permission);
    }

    /** Update a permission */
    async updatePermission(pName:string, p:IPermission): Promise<IResult<IPermission>> {
        let permission: IPermission|undefined;

        const inValues = [pName, JSON.stringify(p)];
        const r = await db.call("sp_permissions_update", inValues,["@result"], this.pool);
        const callResult  = r.getOutputJsonVal<IOutputResult>("@result");

        if (!callResult.success) {
            return new ResultError(
                new Err(callResult.msg, "sp_permissions_update", callResult.errorLogId.toString())
            )
        }

        permission = r.getData<IPermission[]>(0)[0];
        return new ResultOk(permission);
    }
}
