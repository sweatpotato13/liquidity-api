import { Controller, Inject, Post } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";

@Controller("scheduler")
export class SchedulerController {
    constructor(
        @Inject("SchedulerService") private readonly _service: SchedulerService
    ) {}

    @Post("run")
    async runParseFromBot(): Promise<any> {
        try {
            const result = await this._service.parseTransactionData();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("run-uniswap")
    async runParseFromUniswap(): Promise<any> {
        try {
            const result = await this._service.parseUniswapData();
            return result;
        } catch (error) {
            throw error;
        }
    }
}
