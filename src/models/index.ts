
export interface IGetListParam {
    offsetRows: string;
    fetchRows: string;
}

export class GetListParam implements IGetListParam {
    public offsetRows: string = ``;
    public fetchRows: string = ``;

    constructor(obj:any) {
        this.offsetRows = obj?.offsetRows?.toString() || `0`;
        this.fetchRows = obj?.fetchRows?.toString() || `10`;
    }
}
