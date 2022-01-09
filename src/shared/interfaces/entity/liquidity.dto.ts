import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";


@Exclude()
export class LiquidityDto {
    @Expose()
    @IsString({ message: "Invalid symbol" })
    readonly symbol: string;

    @Expose()
    @IsString({ message: "Invalid tokenContract" })
    readonly tokenContract: string;

    @Expose()
    @IsString({ message: "Invalid liquidity" })
    readonly liquidity: number;

    public static of(params: Partial<LiquidityDto>): LiquidityDto {
        const liquidityDto = new LiquidityDto();
        Object.assign(liquidityDto, params);
        return liquidityDto;
    }
}
