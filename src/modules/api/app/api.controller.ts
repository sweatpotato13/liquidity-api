import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
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

    // @Post("register")
    // async registerApi(@Body() registerApiDto: RegisterApiDto): Promise<any> {
    //     try {
    //         const result = await this._service.registerApi(registerApiDto);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}
