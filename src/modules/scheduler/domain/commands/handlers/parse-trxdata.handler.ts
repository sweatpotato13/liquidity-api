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
export class ParseTransactionDataHandler implements ICommandHandler<ParseTransactionDataCommand> {
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
        const wethAddresss = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        const addressList = await this._settingRepo.find({});
        let objects = [];

        for(const address of addressList){
            const result = await this._ethereumService.getErc20TransactionsByAddress(address.botAddress);
            const filtered = this.removeDuplicates(result, "tokenSymbol");
            objects = objects.concat(filtered);
        }

        const ethToUsd = await (await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")).json();

        const unique = this.removeDuplicates(objects, "tokenSymbol");
        console.log(`total ${unique.length} pairs`);
    
        for(const e of unique){
            const pairId = await this._thegraphService.getPair(e.contractAddress, wethAddresss);
            if(pairId.length == 0){
                continue;
            }

            const liquidity = await this._thegraphService.getLiquidity(pairId[0].id);

            const isExist = await this._liquidityRepo.findOne({symbol: e.tokenSymbol});
            if(isExist){
                isExist.liquidity = Math.round(parseFloat(liquidity.reserve1) * ethToUsd.USD * 2);
                await this._liquidityRepo.save(isExist);
            }
            else{
                const object = await this._liquidityRepo.create({
                    symbol: e.tokenSymbol,
                    tokenContract: e.contractAddress,
                    pairContract: pairId[0].id,
                    liquidity: Math.round(parseFloat(liquidity.reserve1) * ethToUsd.USD * 2)
                })
                
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
