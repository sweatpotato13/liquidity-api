import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Setting } from "@src/shared/entities";
import { ConflictException } from "@src/shared/models/error/http.error";
import { Repository } from "typeorm";
import { AddBotAddressCommand } from "../impl";

@CommandHandler(AddBotAddressCommand)
export class AddBotAddressHandler implements ICommandHandler<AddBotAddressCommand> {
    constructor(
        @InjectRepository(Setting)
        private readonly _settingRepo: Repository<Setting>
    ) { }

    async execute(command: AddBotAddressCommand): Promise<any> {
        const { data } = command;

        const setting = await this._settingRepo.create({
            botAddress: data,
        });

        const exist = await this._settingRepo.findOne({ botAddress: data });
        if (exist) {
            throw new ConflictException(`Bot already exists`, {
                context: `AddBotAddressHandler`,
            });
        }
        await this._settingRepo.save(setting);
        
        return "Success";
    }
}
