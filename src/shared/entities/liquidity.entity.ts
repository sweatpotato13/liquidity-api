import { plainToClass } from "class-transformer";
import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { LiquidityDto } from "../interfaces/entity";

@Entity({
    name: "liquidity"
})
export class Liquidity {
    @PrimaryColumn({
        name: "symbol"
    })
    symbol: string;

    @Column({
        name: "base_token_symbol",
        default: "WETH"
    })
    baseTokenSymbol: string;

    @Column({
        name: "token_contract"
    })
    tokenContract: string;

    @Column({
        name: "pair_contract"
    })
    pairContract: string;

    @Column({
        name: "liquidity"
    })
    liquidity: number;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp"
    })
    updatedAt: Date;

    toDto() {
        return plainToClass(LiquidityDto, this);
    }

    public static of(params: Partial<Liquidity>): Liquidity {
        const liquidity = new Liquidity();

        Object.assign(liquidity, params);

        return liquidity;
    }
}
