import mysql, {Pool, Connection, ResultSetHeader} from "mysql2/promise";

import {Configuration as config} from '../utils/configuration';
import {dbDebug} from '../startup/debuggers';
import {ISqlResult, SqlResult, SqlParam} from "./SqlResult";

export interface IDataBase {
    get Pool(): mysql.Pool;
    get Conn(): Promise<mysql.Connection>;
    getNewConnPool(): mysql.Pool;
    getDbConnection(): Promise<mysql.Connection>;
    getNewConnPool(): mysql.Pool;
    call(proc:string, params:SqlParam[], conn?:Pool|Connection):Promise<ISqlResult>;
    query(sql:string, params: { [key:string]:any }, conn?:Pool|Connection): Promise<ISqlResult>;
}

/**
 * Database class that facilitate the work with database driver
 */
class DataBase implements IDataBase
{
    private static _instance: IDataBase;
    private readonly connConfig: mysql.ConnectionOptions;
    private readonly poolConfig: mysql.PoolOptions;
    private readonly pool: mysql.Pool;

    private constructor()
    {
        const basicConnConfig = {
            user: config.db.username,
            password: config.db.password,
            database: config.db.name,
            host: config.db.host,
            namedPlaceholders:true
        };

        this.connConfig = { ...basicConnConfig };

        this.poolConfig = {
            ...basicConnConfig,
            connectionLimit: 10
        };

        this.pool = this.getNewConnPool();
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    public get Pool() {
        return this.pool;
    }

    public get Conn() {
        return this.getDbConnection();
    }

    /** Create a new connection pool */
    public getNewConnPool() {
        return mysql.createPool(this.poolConfig);
    }

    /** Create a new connection */
    public async getDbConnection() {
        try {
            const connection = await mysql.createConnection(this.connConfig);
            await connection.connect();
            return connection;
        } catch (err) {
            const errMsg = "Error creating connection.";
            dbDebug(errMsg, err);
            throw Error(errMsg);
        }
    }

    /** Get the object containing the output parameters from a procedure call. */
    private getOutputs(rowData:any) {
        return rowData[0];
    }

    /**
     * Call a stored procedure and return an object of type SqlResult.
     * @param proc {string} - Procedure name.
     * @param params {Array<SqlParam>} - Array of parameters.
     * @param conn {Pool|Connection} - Connection to be used. If not passed the current connection pool will be created.
     * @return SqlResult Result object like {data,outputParams,fields}
     * */
    async call(proc:string, params:SqlParam[], conn?:Pool|Connection):Promise<ISqlResult> {
        if (!conn) conn = this.Pool;

        // call proc(?,?,??);
        // call proc(1,2,@OUT)
        let sql = `CALL ${proc}(`;

        // create in parameters
        const inPH = [] as string[];
        const inV = [] as any[];
        const outPH = [] as string[];
        const outV = [] as string[];
        if (params.length > 0) {
            // very first param
            addParam(params[0]);
            // rest of params
            for (let i = 1; i < params.length; i++) {
                addParam(params[i]);
            }
        }
        sql = sql.concat(inPH.concat(outV).join());
        sql = sql.concat(");");

        // execute proc
        const [rows,fields] = await conn.execute(sql, inV.concat(outV));

        // Go and get the output parameters
        let outResults: any|null = null;
        if (outPH.length > 0) {
            let outSql = `SELECT ${outV.join()};`;
            const [outRows] = await conn.execute(outSql);
            outResults = this.getOutputs(outRows);
        }

        return this.createSqlResult(rows, fields, outResults);



        // helper function to add params
        function addParam(p:SqlParam) {
            if (p.dir === `in`) {
                inPH.push(`?`);
                inV.push(p.value);
            } else {
                outPH.push(`??`);
                outV.push(`@${p.name}`);
            }
        }
    }

    /**
     * Execute a Sql query
     * @param sql Query to send to the server
     * @param params Parameters fot the Sql query on Key:Value pair form
     * @param conn Connection to be used. By default, uses the internal connection pool
     */
    public async query(sql:string, params: { [key:string]:any }, conn?:Pool|Connection): Promise<ISqlResult> {
        if (!conn) conn = this.Pool;

        // execute the query
        const [rows,fields] = await conn.execute(sql, params);
        // console.log(rows);

        // return the sql result
        return this.createSqlResult(rows, fields, {}, true);
    }

    /**
     * Class to represent s Sql call result
     * @param rows
     * @param fields
     * @param outputParams
     * @param fromQuery
     * @private
     */
    private createSqlResult(rows:any, fields:any, outputParams:any, fromQuery:boolean=false) {
        const callRes:ISqlResult = new SqlResult(fields, outputParams);
        if (fromQuery){
            callRes.data = rows;
            return callRes;
        }

        const resultKeys = Object.keys(rows);
        if (resultKeys.includes("fieldCount")
            && resultKeys.includes("affectedRows")
            && resultKeys.includes("insertId")){
            callRes.resultSetHeader = rows as ResultSetHeader;
        } else {
            const data:any[] = [];
            const len = resultKeys.length - 1;
            for (let i=0; i<len; i++){
                data.push((rows as any[])[i]);
            }
            callRes.data = data;
            callRes.resultSetHeader = (rows as any[])[len] as ResultSetHeader;
        }
        return callRes;
    }
}

export const db = DataBase.Instance;
export const pool = db.Pool;


// /**
//  * Class helper to do some database task
//  * */
// export class Database {
//     private readonly connConfig: mysql.ConnectionOptions;
//     private readonly poolConfig: mysql.PoolOptions;
//
//     constructor() {
//
//         const basicConnConfig = {
//             user: config.db.username,
//             password: config.db.password,
//             database: config.db.name,
//             host: config.db.host
//         };
//
//         this.connConfig = { ...basicConnConfig };
//
//         this.poolConfig = {
//             ...basicConnConfig,
//             connectionLimit: 10
//         };
//     }
//
//     /** Create a new connection */
//     async getDbConnection() {
//         try {
//             const connection = await mysql.createConnection(this.connConfig);
//             await connection.connect();
//             return connection;
//         } catch (err) {
//             const errMsg = "Error creating connection.";
//             dbDebug(errMsg, err);
//             throw Error(errMsg);
//         }
//     }
//
//     /** Create a new connection pool */
//     getConnPool() {
//         return mysql.createPool(this.poolConfig);
//     }
//
//     /** Get the object containing the output parameters from a procedure call. */
//     getOutputs(rowData:any) {
//         return rowData[0];
//     }
//
//     /** Get the output parameter value from a procedure call. */
//     getOutput<T>(rowData:any, name:string) {
//         return rowData[0][name] as T;
//     }
//
//     /** Get the data array from a query result. */
//     getData<Type>(rows:any, idx:number=0) {
//         return rows[idx] as Type;
//     }
//
//     /**
//      * Call a stored procedure and return an object of type SqlResult.
//      * @param proc {string} - Procedure name.
//      * @param inValues {Array<any>} - Array of input values. Need to be in order.
//      * @param outParams {Array<string>} - Array of output parameter names.
//      * @param conn {Pool|Connection} - Connection to be used. If not passed a new connection will be created.
//      * @return SqlResult
//      * */
//     async call(proc:string, inValues: any[], outParams:string[], conn?:Pool|Connection) {
//         if (!conn) conn = await this.getDbConnection();
//
//         let sql = "CALL ".concat(proc,"(");
//         if (inValues.length > 0) {
//             inValues.forEach((value:any,index:number)=>{
//                 sql = sql.concat("?");
//                 if (index < inValues.length-1) sql = sql.concat(", ");
//             });
//         }
//         if (outParams.length > 0) {
//             if (inValues.length > 0) sql = sql.concat(", ");
//             outParams.forEach((value:string,index:number)=>{
//                 sql = sql.concat(value);
//                 if (index < outParams.length-1) sql = sql.concat(",");
//             });
//         }
//         sql = sql.concat(");");
//
//         const [rows,fields] = await conn.execute(sql, inValues);
//
//         // Go and get the output parameters
//         let outResults: any|null = null;
//         if (outParams.length > 0) {
//             let outSql = "SELECT ";
//             outParams.forEach((value:string,index:number)=>{
//                 outSql = outSql.concat(value);
//                 if (index < outParams.length-1) outSql = outSql.concat(",");
//             });
//             outSql = outSql.concat(";");
//             const [outRows] = await conn.execute(outSql);
//             outResults = this.getOutputs(outRows);
//         }
//
//         const callRes:ISqlResult = new SqlResult(fields, outResults);
//         const resultKeys = Object.keys(rows);
//         if (resultKeys.includes("fieldCount")
//             && resultKeys.includes("affectedRows")
//             && resultKeys.includes("insertId")){
//             callRes.resultSetHeader = rows as ResultSetHeader;
//         } else {
//             const data:any[] = [];
//             const len = resultKeys.length - 1;
//             for (let i=0; i<len; i++){
//                 data.push((rows as any[])[i]);
//             }
//             callRes.data = data;
//             callRes.resultSetHeader = (rows as any[])[len] as ResultSetHeader;
//         }
//         return callRes;
//     }
// }
//
// export default new Database();

