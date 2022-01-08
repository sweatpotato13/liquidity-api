import { ICommand } from "@nestjs/cqrs";

export class AddBotAddressCommand implements ICommand {
    constructor(public readonly data: string) {}
}
