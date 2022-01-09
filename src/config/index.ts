/* eslint-disable @typescript-eslint/no-empty-function */
import { config as _config } from "dotenv";
_config({ path: __dirname + "/../../.env" });
(process as any).send = process.send || function () {};

import TypeOrmModuleConfig from "./modules/typeorm/typeorm";

export { TypeOrmModuleConfig };

export const config = {
    // Base
    isProduction: process.env.NODE_ENV === "production",
    // General
    appName: process.env.APP_NAME || "boilerplate",
    appTitle: process.env.APP_TITLE || "boilerplate",
    appDescription: process.env.APP_DESCRIPTION || "boilerplate",
    // Server
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT) || 8000,
    rateLimitMax: process.env.RATE_LIMIT_MAX || 10000,
    // Etherium
    etherscanApiKey: process.env.ETHERSCAN_API_KEY || "",
    infuraProjectId: process.env.INFURA_PROJECT_ID || "",
    uniswapGraphqlEndpoint: process.env.UNISWAP_GRAPHQL_ENDPOINT || ""
};
