import { Service } from "typedi";
import gql from "graphql-tag";
import { config } from "@config";
import { DocumentNode, print } from "graphql";
import { GraphQLClient } from "graphql-request";

@Service()
export class ThegraphService {

    private async req<T1, T2>(args: {
        endpoint: string;
        query: DocumentNode;
        variables?: T2;
    }): Promise<T1> {
        return await new GraphQLClient(args.endpoint, {}).request<T1>(
            print(args.query),
            args.variables
        );
    }

    public async getPair(token0: string, token1: string) {
        return (
            await this.req<any, any>({
                endpoint: config.uniswapGraphqlEndpoint,
                query: gql`
                    query GetPair($token0: String, $token1: String) {
                        pairs(where:{token0:$token0, token1:$token1}){
                          id,
                        }
                      }
                `,
                variables: {
                    token0: token0,
                    token1: token1,
                },
            })
        ).pairs.map(value => {
            return value;
        });
    }

    public async getLiquidity(pairId: string) {
        return (
            await this.req<any, any>({
                endpoint: config.uniswapGraphqlEndpoint,
                query: gql`
                    query GetLiquidity($id: String) {
                        pair(id:$id){
                          reserve1
                        }
                      }
                `,
                variables: {
                    id: pairId,
                },
            })
        ).pair
    }

}
