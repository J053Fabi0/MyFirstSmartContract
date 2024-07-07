import useTonClient from "./useTonClient";
import { useEffect, useState } from "react";
import useAsyncInitialize from "./useAsyncInitialize";
import { address, Address, OpenedContract } from "@ton/core";
import { MyFirstBlueprintContract } from "../contracts/MainContract";

export default function useMainContract() {
  const client = useTonClient();

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    contract_balance: number;
  }>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MyFirstBlueprintContract(
      address("EQCnX-jGLIM3Yb7GOjhpImQCZjNQXYOD2IMc2aNI2jnDkbyo") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MyFirstBlueprintContract>;
  }, [client]);

  useEffect(
    () =>
      void (async () => {
        if (!mainContract) return;
        setContractData(null);
        const val = await mainContract.getData();
        const balance = await mainContract.getBalance();
        setContractData({
          counter_value: val.sum,
          owner_address: val.owner,
          recent_sender: val.lastSender,
          contract_balance: balance,
        });
      })(),
    [mainContract]
  );

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
  };
}
