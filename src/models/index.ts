export class GetListParam {
    public offsetRows: string = ``;
    public fetchRows: string = ``;

    constructor(obj:any) {
        this.offsetRows = obj.offsetRows?.toString() || `0`;
        this.fetchRows = obj.fetchRows?.toString() || `10`;
    }
}
