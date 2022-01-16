import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetLiquidityRequestDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    liquidity: number;

    @IsString()
    @IsOptional()
    startDate: string;

    public static of(
        params: Partial<GetLiquidityRequestDto>
    ): GetLiquidityRequestDto {
        const getLiquidityRequestDto = new GetLiquidityRequestDto();
        Object.assign(getLiquidityRequestDto, params);
        return getLiquidityRequestDto;
    }
}
