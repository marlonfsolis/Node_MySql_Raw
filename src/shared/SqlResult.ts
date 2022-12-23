import {ResultSetHeader} from "mysql2/promise";
import {dbDebug} from "../startup/debuggers";

/** Statistic object returned as output from procedures */
export interface IOutputResult {
    success: boolean,
    msg: string,
    errorLogId: number,
    recordCount: number
}

/** Model the result of a procedure call */
export interface ISqlResult {
    data:any[];
    fields: any[];
    outParams:object;
    resultSetHeader:object;
    getOutputVal<T>(name:string):T;
    getOutputJsonVal<T>(name:string):T;
    getData<T>(idx?:number):T[];
}

/** Class to create stored procedure parameters. */
export class SqlParam {
    constructor(
        public name:string,
        public value:any,
        public dir:"in"|"out"
    ) {
        this.name = name;
        this.value = value;
        this.dir = dir;
    }
}

/** Model the result of a procedure call */
export class SqlResult implements ISqlResult {
    public data: any[];
    public fields: any[];
    public outParams: any;
    public resultSetHeader: ResultSetHeader;

    constructor(fields:any[], outParams:object) {
        this.data = [];
        this.fields = fields;
        this.outParams = outParams;
        this.resultSetHeader = {} as ResultSetHeader;
    }

    /**
     * Get the value of the giving parameter.
     * @param name Parameter name.
     */
    getOutputVal<T>(name: string): T {
        // dbDebug(this.outParams);
        if (!name.startsWith(`@`)) name = `@${name}`;
        return this.outParams[name] as T;
    }

    /**
     * Get the parsed value of the giving parameter.
     * @param name Parameter name.
     */
    getOutputJsonVal<T>(name: string): T {
        // dbDebug(this.outParams);
        if (!name.startsWith(`@`)) name = `@${name}`;
        return JSON.parse(this.outParams[name]) as T;
    }

    /**
     * Get the data at giving position.
     * Field data can hold multiple results from multiple query statements.
     * @param idx
     */
    getData<T>(idx:number=0): T[] {
        return this.data[idx] as T[];
    }

}
