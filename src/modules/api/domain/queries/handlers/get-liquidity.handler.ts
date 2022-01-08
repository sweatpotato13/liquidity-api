import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Liquidity } from "@src/shared/entities";
import { LessThanOrEqual, Repository } from "typeorm";
import { GetLiquidityResponseDto } from "../../dtos";
import { GetLiquidityQuery } from "../impl";

@QueryHandler(GetLiquidityQuery)
export class GetLiquidityHandler implements IQueryHandler<GetLiquidityQuery> {
    constructor(
        @InjectRepository(Liquidity)
        private readonly _liquidityRepo: Repository<Liquidity>
    ) { }

    async execute(command: GetLiquidityQuery) {
        const { args } = command;
        const { liquidity } = args;

        const result = new GetLiquidityResponseDto();
        result.data = [];

        const data: Liquidity[] = await this._liquidityRepo.find({
            where: {
                liquidity: LessThanOrEqual(liquidity)
            }
        });

        for (const a of data) {
            const object = {
                symbol: a.symbol,
                liquidity: a.liquidity,
                pairContract: a.pairContract
            }
            result.data.push(object);
        }

        return result;
    }
}
