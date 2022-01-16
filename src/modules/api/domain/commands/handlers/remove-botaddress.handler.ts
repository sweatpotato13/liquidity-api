import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Setting } from "@src/shared/entities";
import { NotFoundException } from "@src/shared/models/error/http.error";
import { Repository } from "typeorm";
import { RemoveBotAddressCommand } from "../impl";

@CommandHandler(RemoveBotAddressCommand)
export class RemoveBotAddressHandler
    implements ICommandHandler<RemoveBotAddressCommand>
{
    constructor(
        @InjectRepository(Setting)
        private readonly _settingRepo: Repository<Setting>
    ) {}

    async execute(command: RemoveBotAddressCommand): Promise<any> {
        const { data } = command;

        const exist = await this._settingRepo.findOne({ botAddress: data });
        if (!exist) {
            throw new NotFoundException(`Bot doesn't exists`, {
                context: `RemoveBotAddressCommand`
            });
        }
        await this._settingRepo.remove(exist);

        return "Success";
    }
}
