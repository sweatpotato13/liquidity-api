import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class LiquidityUniswapDto {
    @Expose()
    @IsString({ message: "Invalid symbol" })
    readonly symbol: string;

    @Expose()
    @IsString({ message: "Invalid pairContract" })
    readonly pairContract: string;

    @Expose()
    @IsString({ message: "Invalid liquidity" })
    readonly liquidity: number;

    @Expose()
    @IsString({ message: "Invalid latestTrxs" })
    readonly latestTrxs: number;

    public static of(
        params: Partial<LiquidityUniswapDto>
    ): LiquidityUniswapDto {
        const liquidityUniswapDto = new LiquidityUniswapDto();
        Object.assign(liquidityUniswapDto, params);
        return liquidityUniswapDto;
    }
}
