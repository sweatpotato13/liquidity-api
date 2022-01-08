import { ICommand } from "@nestjs/cqrs";

export class RemoveBotAddressCommand implements ICommand {
    constructor(public readonly data: string) {}
}
