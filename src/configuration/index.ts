export interface IExecution {
    id: string;
}

export interface IConfiguration {
    executions: IExecution[];
}
export default class ConfigurationService {
    private configuration: IConfiguration;
    constructor() {
        this.configuration = {
            executions: [],
        };
    }

    public createExecution() {
        this.configuration.executions.push({
            id: "test",
        });
        console.log("All good!");
    }
}