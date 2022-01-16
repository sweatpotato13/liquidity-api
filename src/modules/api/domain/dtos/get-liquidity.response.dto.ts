import { LiquidityObject } from "@src/shared/models/object";

export class GetLiquidityResponseDto {
    data: LiquidityObject[];

    public static of(
        params: Partial<GetLiquidityResponseDto>
    ): GetLiquidityResponseDto {
        const getLiquidityResponseDto = new GetLiquidityResponseDto();
        Object.assign(getLiquidityResponseDto, params);
        return getLiquidityResponseDto;
    }
}
