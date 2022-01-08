import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmModuleConfig } from "@src/config";
import { TypeOrmConfigService } from "@src/config/modules/typeorm/typeorm.config.service";
import { Liquidity, Setting } from "@src/shared/entities";
import { ApiController } from "./app/api.controller";
import { ApiService } from "./app/api.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(TypeOrmModuleConfig)],
            useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([Liquidity, Setting]),
        CqrsModule,
    ],
    providers: [
        { provide: "ApiService", useClass: ApiService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [ApiController]
})
export class ApiModule {
    configure() { }
}
