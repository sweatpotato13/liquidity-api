import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Liquidity, LiquidityUniswap } from "@src/shared/entities";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { GetLiquidityResponseDto } from "../../dtos";
import { GetLiquidityFromUniswapQuery } from "../impl";

@QueryHandler(GetLiquidityFromUniswapQuery)
export class GetLiquidityFromUniswapHandler implements IQueryHandler<GetLiquidityFromUniswapQuery> {
    constructor(
        @InjectRepository(LiquidityUniswap)
        private readonly _liquidityUniswapRepo: Repository<LiquidityUniswap>
    ) {}

    async execute(command: GetLiquidityFromUniswapQuery) {
        const { args } = command;
        const { liquidity, startDate } = args;

        const result = new GetLiquidityResponseDto();
        result.data = [];

        let liquidityBase = 1000000000;
        let start = new Date("2021-01-01").toISOString();
        if (liquidity) {
            liquidityBase = liquidity;
        }
        if (startDate) {
            start = new Date(startDate).toISOString();
        }

        const data: LiquidityUniswap[] = await this._liquidityUniswapRepo.find({
            where: {
                liquidity: LessThanOrEqual(liquidityBase),
                updatedAt: MoreThanOrEqual(start)
            }
        });

        for (const a of data) {
            const object = {
                symbol: a.symbol,
                liquidity: a.liquidity,
                pairContract: a.pairContract,
                updatedAt: a.updatedAt
            };
            result.data.push(object);
        }

        result.data.sort((a, b) =>
            a.liquidity < b.liquidity ? -1 : a.liquidity > b.liquidity ? 1 : 0
        );

        return result.data;
    }
}
