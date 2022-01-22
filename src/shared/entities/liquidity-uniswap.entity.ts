import { plainToClass } from "class-transformer";
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

    @Column({
        name: "latest_trxs",
        default: 0
    })
    latestTrxs: number;

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

    public static of(params: Partial<LiquidityUniswap>): LiquidityUniswap {
        const liquidityuniswap = new LiquidityUniswap();

        Object.assign(liquidityuniswap, params);

        return liquidityuniswap;
    }
}
