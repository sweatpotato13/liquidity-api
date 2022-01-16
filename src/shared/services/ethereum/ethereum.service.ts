import { Service } from "typedi";
import fetch from "cross-fetch";
import Web3 from "web3";
import { config } from "@src/config";
import { BadRequestException } from "@src/shared/models/error/http.error";

@Service()
export class EthereumService {
    private readonly web3: Web3;

    constructor() {
        this.web3 = new Web3(
            `https://mainnet.infura.io/v3/${config.infuraProjectId}`
        );
    }

    public async isValidAddress(address: string) {
        return this.web3.utils.isAddress(address);
    }

    public async getErc20TransactionsByAddress(
        address: string,
        startDate?: string
    ) {
        const current = this.seconds_since_epoch(Date.now());
        const start = startDate
            ? this.seconds_since_epoch(new Date(startDate).valueOf())
            : current - 10800;
        if (start > current) {
            throw new BadRequestException(`start date is not available`, {
                context: `getErc20TransactionsByAddress`
            });
        }
        const currentBlock = await this.web3.eth.getBlockNumber();
        const blockGap = (current - start) / 15;
        const startBlock = currentBlock - blockGap;

        const params = new URLSearchParams({
            module: "account",
            action: "tokentx",
            address: address,
            startblock: startBlock.toString(),
            sort: "desc",
            apikey: config.etherscanApiKey
        });

        const result = await fetch("https://api.etherscan.io/api?" + params, {
            method: "GET"
        });
        const json = await result.json();

        return json.result;
    }

    private seconds_since_epoch(d: number) {
        return Math.floor(d / 1000);
    }
}
