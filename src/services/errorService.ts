import ErrorRepository from "../repositories/errorRepository";
import {ErrorLevel, ErrorLogModel} from "../models/ErrorLogModel";


export default class IndexService {
    private readonly errorRepo: ErrorRepository;

    constructor() {
        this.errorRepo = new ErrorRepository();
    }

    /**
     * Log Error
     */
    async logError(err:Error, details:string=``, level:ErrorLevel=ErrorLevel.Error) {
        const errorLog = ErrorLogModel.createFromError(err, details, level);
        return this.errorRepo.logError(errorLog);
    }
}
