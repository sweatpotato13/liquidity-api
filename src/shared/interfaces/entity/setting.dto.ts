import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class SettingDto {
    @Expose()
    @IsString({ message: "Invalid symbol" })
    readonly botAddress: string;

    public static of(params: Partial<SettingDto>): SettingDto {
        const settingDto = new SettingDto();
        Object.assign(settingDto, params);
        return settingDto;
    }
}
