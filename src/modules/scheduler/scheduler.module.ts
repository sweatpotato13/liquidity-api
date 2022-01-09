import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Liquidity, Setting } from "@src/shared/entities";
import { EtheriumService } from "@src/shared/services/etherium/etherium.service";
import { ThegraphService } from "@src/shared/services/thrgraph/thegraph.service";
import { SchedulerController } from "./app/scheduler.controller";
import { SchedulerService } from "./app/scheduler.service";
import { CommandHandlers } from "./domain/commands/handlers";

@Module({
    imports: [
        TypeOrmModule.forFeature([Liquidity, Setting]),
        CqrsModule,
    ],
    providers: [
        { provide: "SchedulerService", useClass: SchedulerService },
        { provide: "EtheriumService", useClass: EtheriumService },
        { provide: "ThegraphService", useClass: ThegraphService },
        ...CommandHandlers
    ],
    controllers: [SchedulerController]
})
export class SchedulerModule {
    configure() { }
}
