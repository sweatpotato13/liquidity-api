import { HealthCheckHandler } from "./healthcheck.handler";
import { GetLiquidityHandler } from "./get-liquidity.handler";
import { GetLiquidityFromUniswapHandler } from "./get-liquidity-uniswap.handler"

export const QueryHandlers = [HealthCheckHandler, GetLiquidityHandler, GetLiquidityFromUniswapHandler];
