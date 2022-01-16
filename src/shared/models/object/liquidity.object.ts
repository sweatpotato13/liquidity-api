import { IsNumber, IsString } from "class-validator";

export class LiquidityObject {
    @IsString()
    symbol: string;

    @IsNumber()
    liquidity: number;

    @IsString()
    pairContract: string;

    public static of(params: Partial<LiquidityObject>): LiquidityObject {
        const liquidityObject = new LiquidityObject();
        Object.assign(liquidityObject, params);
        return liquidityObject;
    }
}
