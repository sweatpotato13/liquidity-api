import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import {
    AddBotAddressCommand,
    RemoveBotAddressCommand
} from "../domain/commands/impl";
import {
    GetLiquidityRequestDto,
    GetLiquidityResponseDto
} from "../domain/dtos";
import { GetLiquidityQuery, HealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class ApiService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) {}

    public async healthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(new HealthCheckQuery());
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async getLiquidity(
        args: GetLiquidityRequestDto
    ): Promise<GetLiquidityResponseDto> {
        try {
            const result = await this._queryBus.execute(
                new GetLiquidityQuery(args)
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Transactional()
    public async addBotAddress(address: string): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new AddBotAddressCommand(address)
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
    public async removeBotAddress(address: string): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new RemoveBotAddressCommand(address)
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
