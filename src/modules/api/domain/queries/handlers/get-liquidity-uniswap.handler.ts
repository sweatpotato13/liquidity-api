import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Liquidity, LiquidityUniswap } from "@src/shared/entities";
import { EthereumService } from "@src/shared/services/ethereum/ethereum.service";
import { Inject } from "typedi";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { GetLiquidityResponseDto } from "../../dtos";
import { GetLiquidityFromUniswapQuery } from "../impl";

@QueryHandler(GetLiquidityFromUniswapQuery)
export class GetLiquidityFromUniswapHandler implements IQueryHandler<GetLiquidityFromUniswapQuery> {
    constructor(
        @InjectRepository(LiquidityUniswap)
        private readonly _liquidityUniswapRepo: Repository<LiquidityUniswap>,
        @Inject("EthereumService")
        private readonly _ethereumService: EthereumService
    ) { }

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

        const baseDate = this.getDateAgo(7);
        for (const a of data) {
            const object = {
                symbol: a.symbol,
                liquidity: a.liquidity,
                pairContract: a.pairContract,
                updatedAt: a.updatedAt
            };
            const trxs = await this._ethereumService.getErc20TransactionsByAddress(a.pairContract, baseDate);
            if (trxs.length != 0) {
                result.data.push(object);
            }
        }

        result.data.sort((a, b) =>
            a.liquidity < b.liquidity ? -1 : a.liquidity > b.liquidity ? 1 : 0
        );

        return result.data;
    }

    getDateAgo(ago: number) {
        const date = new Date();
        date.setDate(date.getDate() - ago);
        const year = date.getFullYear();
        const month = ("0" + (1 + date.getMonth())).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }
}
