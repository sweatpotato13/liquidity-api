import { Inject } from "@nestjs/common";
import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { LiquidityUniswap } from "@src/shared/entities";
import { ThegraphService } from "@src/shared/services/thrgraph/thegraph.service";
import { Repository } from "typeorm";
import { ParseUniswapDataCommand } from "../impl";
import fetch from "cross-fetch";

@CommandHandler(ParseUniswapDataCommand)
export class ParseUniswapDataHandler
    implements ICommandHandler<ParseUniswapDataCommand>
{
    constructor(
        @InjectRepository(LiquidityUniswap)
        private readonly _liquidityUniswapRepo: Repository<LiquidityUniswap>,
        @Inject("ThegraphService")
        private readonly _thegraphService: ThegraphService
    ) {}

    async execute(command: ParseUniswapDataCommand): Promise<any> {
        const wethAddresss = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        const totalPairs = (await this._thegraphService.getPairCount())[0];
        const ethToUsd = await (
            await fetch(
                "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
            )
        ).json();
        console.log("Total Pairs: ", totalPairs);
        for (let i = 0; i < 6; i++) {
            const pairs = await this._thegraphService.getAllPairs(i * 1000);
            for (let j = 0; j < pairs.length; j++) {
                const token0 = pairs[j].token0;
                const token1 = pairs[j].token1;
                const symbol =
                    token0.symbol == "WETH" ? token1.symbol : token0.symbol;
                if (token0.symbol != "WETH" && token1.symbol != "WETH") {
                    continue;
                }
                const liquidity = await this._thegraphService.getLiquidity(
                    pairs[j].id
                );
                const liquidityValue = Math.round(
                    parseFloat(liquidity.reserve1) * ethToUsd.USD * 2
                );
                if (liquidityValue > 2100000000 || liquidityValue == 0) {
                    continue;
                }

                const isExist = await this._liquidityUniswapRepo.findOne({
                    symbol: symbol
                });
                if (isExist) {
                    isExist.liquidity = liquidityValue;
                    await this._liquidityUniswapRepo.save(isExist);
                } else {
                    const object = await this._liquidityUniswapRepo.create({
                        symbol: symbol,
                        pairContract: pairs[j].id,
                        liquidity: liquidityValue
                    });
                    await this._liquidityUniswapRepo.save(object);
                }
            }
        }
        return "Success";
    }
}
