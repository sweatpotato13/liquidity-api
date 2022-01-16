import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Setting } from "@src/shared/entities";
import {
    BadRequestException,
    ConflictException
} from "@src/shared/models/error/http.error";
import { EthereumService } from "@src/shared/services/ethereum/ethereum.service";
import { Inject } from "typedi";
import { Repository } from "typeorm";
import { AddBotAddressCommand } from "../impl";

@CommandHandler(AddBotAddressCommand)
export class AddBotAddressHandler
    implements ICommandHandler<AddBotAddressCommand>
{
    constructor(
        @InjectRepository(Setting)
        private readonly _settingRepo: Repository<Setting>,
        @Inject("EthereumService")
        private readonly _ethereumService: EthereumService
    ) {}

    async execute(command: AddBotAddressCommand): Promise<any> {
        const { data } = command;

        if (!(await this._ethereumService.isValidAddress(data))) {
            throw new BadRequestException(`Address not valid`, {
                context: `AddBotAddressHandler`
            });
        }

        const setting = await this._settingRepo.create({
            botAddress: data
        });

        const exist = await this._settingRepo.findOne({ botAddress: data });
        if (exist) {
            throw new ConflictException(`Bot already exists`, {
                context: `AddBotAddressHandler`
            });
        }
        await this._settingRepo.save(setting);

        return "Success";
    }
}
