import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Liquidity, Setting } from "@src/shared/entities";
import { EthereumService } from "@src/shared/services/ethereum/ethereum.service";
import { ThegraphService } from "@src/shared/services/thrgraph/thegraph.service";
import { SchedulerController } from "./app/scheduler.controller";
import { SchedulerService } from "./app/scheduler.service";
import { CommandHandlers } from "./domain/commands/handlers";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([Liquidity, Setting]),
        CqrsModule,
    ],
    providers: [
        { provide: "SchedulerService", useClass: SchedulerService },
        { provide: "EthereumService", useClass: EthereumService },
        { provide: "ThegraphService", useClass: ThegraphService },
        ...CommandHandlers
    ],
    controllers: [SchedulerController]
})
export class SchedulerModule {
    configure() { }
}
