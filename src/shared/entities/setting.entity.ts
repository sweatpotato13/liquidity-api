import { plainToClass } from "class-transformer";
import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { SettingDto } from "../interfaces/entity";

@Entity({
    name: "setting"
})
export class Setting {
    @PrimaryColumn({
        name: "bot_address"
    })
    botAddress: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    toDto() {
        return plainToClass(SettingDto, this);
    }

    public static of(params: Partial<Setting>): Setting {
        const setting = new Setting();

        Object.assign(setting, params);

        return setting;
    }
}
