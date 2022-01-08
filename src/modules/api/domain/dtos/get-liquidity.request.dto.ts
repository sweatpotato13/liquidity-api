import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetLiquidityRequestDto {
    @IsNumber()
    @Type(() => Number)
    liquidity: number;

    public static of(params: Partial<GetLiquidityRequestDto>): GetLiquidityRequestDto {
        const getLiquidityRequestDto = new GetLiquidityRequestDto();
        Object.assign(getLiquidityRequestDto, params);
        return getLiquidityRequestDto;
    }
}
