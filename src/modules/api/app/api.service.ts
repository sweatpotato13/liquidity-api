import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import { HealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class ApiService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    public async healthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(new HealthCheckQuery());
            return result;
        } catch (error) {
            throw error;
        }
    }

    // @Transactional()
    // public async discardApi(data: DiscardApiDto): Promise<any> {
    //     try {
    //         const result = await this._commandBus.execute(
    //             new DiscardApiCommand(data)
    //         );
    //         runOnTransactionCommit(() => { });
    //         return result;
    //     } catch (error) {
    //         runOnTransactionRollback(() => { });
    //         throw error;
    //     } finally {
    //         runOnTransactionComplete(() => { });
    //     }
    // }
}
