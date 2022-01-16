import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import {
    ParseTransactionDataCommand,
    ParseUniswapDataCommand
} from "../domain/commands/impl";

@Injectable()
export class SchedulerService {
    constructor(private readonly _commandBus: CommandBus) {}

    @Transactional()
    @Cron(CronExpression.EVERY_HOUR)
    public async parseTransactionData(): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new ParseTransactionDataCommand()
            );
            runOnTransactionCommit(() => {});
            return ret;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    @Transactional()
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    public async parseUniswapData(): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new ParseUniswapDataCommand()
            );
            runOnTransactionCommit(() => {});
            return ret;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }
}
