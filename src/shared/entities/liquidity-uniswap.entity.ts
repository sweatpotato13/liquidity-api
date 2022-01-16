import { plainToClass } from "class-transformer";
import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { LiquidityDto } from "../interfaces/entity";

@Entity({
    name: "liquidity_uniswap"
})
export class LiquidityUniswap {
    @PrimaryColumn({
        name: "symbol"
    })
    symbol: string;

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

    @CreateDateColumn({
        name: "updated_at",
        type: "timestamp"
    })
    updatedAt: Date;

    toDto() {
        return plainToClass(LiquidityDto, this);
    }

    public static of(params: Partial<LiquidityUniswap>): LiquidityUniswap {
        const liquidityuniswap = new LiquidityUniswap();

        Object.assign(liquidityuniswap, params);

        return liquidityuniswap;
    }
}
