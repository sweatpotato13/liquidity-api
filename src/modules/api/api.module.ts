import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "./app/api.controller";
import { ApiService } from "./app/api.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
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
