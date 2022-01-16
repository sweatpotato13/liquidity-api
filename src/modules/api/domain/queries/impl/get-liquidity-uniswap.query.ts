import { IQuery } from "@nestjs/cqrs";
import { GetLiquidityRequestDto } from "../../dtos";

export class GetLiquidityFromUniswapQuery implements IQuery {
    constructor(public readonly args: GetLiquidityRequestDto) {}
}
