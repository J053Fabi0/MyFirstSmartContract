import { TonClient } from "@ton/ton";
import useAsyncInitialize from "./useAsyncInitialize";
import { getHttpEndpoint } from "@orbs-network/ton-access";

/**
 * Get a TonClient instance.
 */
export default function useTonClient(): undefined | TonClient {
  return useAsyncInitialize(
    async () => new TonClient({ endpoint: await getHttpEndpoint({ network: "testnet" }) })
  );
}
