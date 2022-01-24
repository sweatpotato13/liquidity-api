import { Inject } from "@nestjs/common";
import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Liquidity, Setting } from "@src/shared/entities";
import { EthereumService } from "@src/shared/services/ethereum/ethereum.service";
import { ThegraphService } from "@src/shared/services/thrgraph/thegraph.service";
import { Repository } from "typeorm";
import { ParseTransactionDataCommand } from "../impl";
import fetch from "cross-fetch";

@CommandHandler(ParseTransactionDataCommand)
export class ParseTransactionDataHandler
    implements ICommandHandler<ParseTransactionDataCommand>
{
    constructor(
        @InjectRepository(Liquidity)
        private readonly _liquidityRepo: Repository<Liquidity>,
        @InjectRepository(Setting)
        private readonly _settingRepo: Repository<Setting>,
        @Inject("EthereumService")
        private readonly _ethereumService: EthereumService,
        @Inject("ThegraphService")
        private readonly _thegraphService: ThegraphService
    ) { }

    async execute(command: ParseTransactionDataCommand): Promise<any> {
        const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        const usdcAddress =
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        const usdtAddress =
            "0xdac17f958d2ee523a2206206994597c13d831ec7"
        const addressList = await this._settingRepo.find({});
        let objects = [];

        for (const address of addressList) {
            const result =
                await this._ethereumService.getErc20TransactionsByAddress(
                    address.botAddress
                );
            const filtered = this.removeDuplicates(result, "tokenSymbol");
            objects = objects.concat(filtered);
        }

        const ethToUsd = await (
            await fetch(
                "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
            )
        ).json();

        const unique = this.removeDuplicates(objects, "tokenSymbol");
        console.log(`total ${unique.length} pairs`);

        for (const e of unique) {
            // WETH Pair
            const wethPairId = await this._thegraphService.getPair(
                e.contractAddress,
                wethAddress
            );
            if (wethPairId.length == 0) {
                continue;
            }

            const wethLiquidity = await this._thegraphService.getLiquidity(
                wethPairId[0].id
            );

            const isExistw = await this._liquidityRepo.findOne({
                symbol: e.tokenSymbol,
                baseTokenSymbol: "WETH",
            });
            if (isExistw) {
                isExistw.liquidity = Math.round(
                    parseFloat(wethLiquidity.reserve1) * ethToUsd.USD * 2
                );
                await this._liquidityRepo.save(isExistw);
            } else {
                const object = await this._liquidityRepo.create({
                    symbol: e.tokenSymbol,
                    tokenContract: e.contractAddress,
                    pairContract: wethPairId[0].id,
                    liquidity: Math.round(
                        parseFloat(wethLiquidity.reserve1) * ethToUsd.USD * 2
                    ),
                    baseTokenSymbol: "WETH"
                });

                await this._liquidityRepo.save(object);
            }
            // USDC Pair
            const usdcPairId = await this._thegraphService.getPair(
                e.contractAddress,
                usdcAddress
            );
            if (usdcPairId.length == 0) {
                continue;
            }

            const usdcLiquidity = await this._thegraphService.getLiquidity(
                usdcPairId[0].id
            );

            const isExistu = await this._liquidityRepo.findOne({
                symbol: e.tokenSymbol,
                baseTokenSymbol: "USDC",
            });
            if (isExistu) {
                isExistu.liquidity = Math.round(
                    parseFloat(usdcLiquidity.reserve1) * 2
                );
                await this._liquidityRepo.save(isExistu);
            } else {
                const object = await this._liquidityRepo.create({
                    symbol: e.tokenSymbol,
                    tokenContract: e.contractAddress,
                    pairContract: usdcPairId[0].id,
                    liquidity: Math.round(
                        parseFloat(usdcLiquidity.reserve1) * 2
                    ),
                    baseTokenSymbol: "USDC"
                });

                await this._liquidityRepo.save(object);
            }
            // USDT Pair
            const usdtPairId = await this._thegraphService.getPair(
                e.contractAddress,
                usdtAddress
            );
            if (usdtPairId.length == 0) {
                continue;
            }

            const usdtLiquidity = await this._thegraphService.getLiquidity(
                usdtPairId[0].id
            );

            const isExistt = await this._liquidityRepo.findOne({
                symbol: e.tokenSymbol,
                baseTokenSymbol: "USDT",
            });
            if (isExistt) {
                isExistt.liquidity = Math.round(
                    parseFloat(usdtLiquidity.reserve1) * 2
                );
                await this._liquidityRepo.save(isExistt);
            } else {
                const object = await this._liquidityRepo.create({
                    symbol: e.tokenSymbol,
                    tokenContract: e.contractAddress,
                    pairContract: usdtPairId[0].id,
                    liquidity: Math.round(
                        parseFloat(usdtLiquidity.reserve1) * 2
                    ),
                    baseTokenSymbol: "USDT"
                });

                await this._liquidityRepo.save(object);
            }
        }
        return "Success";
    }

    removeDuplicates(originalArray: any[], prop: string) {
        const newArray = [];
        const lookupObject = {};

        for (const i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (const i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
}
