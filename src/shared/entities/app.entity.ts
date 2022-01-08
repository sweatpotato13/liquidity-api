import { plainToClass } from "class-transformer";
import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { AppDto } from "../interfaces/entity";

@Entity({
    name: "app"
})
export class App {
    @PrimaryColumn({
        name: "version"
    })
    version: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    @CreateDateColumn({
        name: "updated_at",
        type: "timestamp"
    })
    updatedAt: Date;


    toDto() {
        return plainToClass(AppDto, this);
    }

    public static of(params: Partial<App>): App {
        const app = new App();

        Object.assign(app, params);

        return app;
    }
}
