import { IQuery } from "@nestjs/cqrs";
import { GetLiquidityRequestDto } from "../../dtos";

export class GetLiquidityQuery implements IQuery {
    constructor(public readonly args: GetLiquidityRequestDto) {}
}
