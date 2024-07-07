import useTonClient from "./useTonClient";
import useTonConnect from "./useTonconnect";
import useAsyncInitialize from "./useAsyncInitialize";
import { address, Address, OpenedContract, toNano } from "@ton/core";
import { MyFirstBlueprintContract } from "../contracts/MainContract";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface Data {
  counter_value: number;
  recent_sender: Address;
  owner_address: Address;
  contract_balance: number;
}

async function pullData(
  setContractData: Dispatch<SetStateAction<Data | null>>,
  mainContract: OpenedContract<MyFirstBlueprintContract>
) {
  console.count("Polling contract data");
  const val = await mainContract.getData();
  const balance = await mainContract.getBalance();
  setContractData({
    counter_value: val.sum,
    owner_address: val.owner,
    contract_balance: balance,
    recent_sender: val.lastSender,
  });
}

export default function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const [contractData, setContractData] = useState<null | Data>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MyFirstBlueprintContract(
      address("EQCnX-jGLIM3Yb7GOjhpImQCZjNQXYOD2IMc2aNI2jnDkbyo") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MyFirstBlueprintContract>;
  }, [client]);

  const intervalId = useRef<null | number>(null);
  useEffect(() => {
    if (intervalId.current === null && mainContract) {
      pullData(setContractData, mainContract);
      intervalId.current = setInterval(() => pullData(setContractData, mainContract), 5_000);
    }

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [mainContract]);

  return {
    ...contractData,
    contract_address: mainContract?.address.toString(),
    sendIncrement: (inc: number) => mainContract?.sendIncrement(sender, toNano(0.05), inc),
  };
}
