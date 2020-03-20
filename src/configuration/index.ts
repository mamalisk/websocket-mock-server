import * as NodeCache from 'node-cache';

export enum Behavior {
    DELAY_INITIAL_RESPONSE = 'DELAY_INITIAL_RESPONSE',
    DELAY_BETWEEN_RESPONSES = 'DELAY_BETWEEN_RESPONSES',
    FAIL_RESPONSE = 'FAIL_RESPONSE',
    SUCCESSFUL_RESPONSE = 'SUCCESSFUL_RESPONSE',
}

export interface IExecution {
    id: string;
    behavior: Behavior;
    responseBody: any[] | any;
}

export interface IConfiguration {
    executions: IExecution[];
}
export default class ConfigurationService {
    private cache: NodeCache;
    constructor() {
        this.cache = new NodeCache();
    }

    public createExecution(execution: IExecution) {
        this.cache.set(execution.id, execution);
    }

    public getExecution(id: string): IExecution | undefined {
        return this.cache.get<IExecution>(id);
    }

}