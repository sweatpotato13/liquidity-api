import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Liquidity, Setting } from "@src/shared/entities";
import { EthereumService } from "@src/shared/services/ethereum/ethereum.service";
import { ApiController } from "./app/api.controller";
import { ApiService } from "./app/api.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
        TypeOrmModule.forFeature([Liquidity, Setting]),
        CqrsModule,
    ],
    providers: [
        { provide: "ApiService", useClass: ApiService },
        { provide: "EthereumService", useClass: EthereumService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [ApiController]
})
export class ApiModule {
    configure() { }
}
