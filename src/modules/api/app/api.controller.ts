import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { GetLiquidityRequestDto, GetLiquidityResponseDto } from "../domain/dtos";
import { ApiService } from "./api.service";

@Controller()
export class ApiController {
    constructor(@Inject("ApiService") private readonly _service: ApiService) { }

    @Get()
    async healthCheck(): Promise<any> {
        try {
            const result = await this._service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("liquidity")
    async getLiquidity(
        @Query() args: GetLiquidityRequestDto
    ): Promise<GetLiquidityResponseDto> {
        try {
            const result = await this._service.getLiquidity(args);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("add/:address/")
    async addBotAddress(@Param("address") address: string): Promise<any> {
        try {
            const result = await this._service.addBotAddress(address);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("remove/:address/")
    async removeBotAddress(@Param("address") address: string): Promise<any> {
        try {
            const result = await this._service.removeBotAddress(address);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
