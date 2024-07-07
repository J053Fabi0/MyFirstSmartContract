import "./App.css";
import { useEffect, useState } from "react";
import { toFixedS } from "./utils/numbersString";
import useTonConnect from "./hooks/useTonconnect";
import useMainContract from "./hooks/useMainContract";
import { TonConnectButton } from "@tonconnect/ui-react";

function App() {
  const { connected } = useTonConnect();
  const { contract_address, counter_value, contract_balance, sendIncrement, sendWithdraw, sendDeposit } =
    useMainContract();

  const [withdrawAmount, setWithdrawAmount] = useState("0");
  const [depositAmount, setDepositAmount] = useState("1");

  useEffect(() => {
    if (contract_balance !== undefined) setWithdrawAmount((contract_balance / 2).toFixed(9));
  }, [contract_balance]);

  return (
    <>
      <TonConnectButton />
      <div>
        <p>
          <b>Our contract Address</b> {contract_address ?? "Loading..."}
        </p>

        <p>
          <b>Our contract Balance</b> {contract_balance ?? "Loading..."}
        </p>

        <br />
        <br />
        <hr />
        <br />

        <p>
          <b>Counter Value</b> {counter_value ?? "Loading..."}
        </p>
        {connected && <button onClick={() => sendIncrement(1)}>Increment</button>}

        <br />
        <br />
        <hr />
        <br />

        <b>Deposit Amount </b>
        <input
          type="string"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          onBlur={() => setDepositAmount((a) => (isNaN(Number(a)) ? "0" : toFixedS(a, 9)))}
        />
        <br />
        <br />
        <button onClick={() => sendDeposit(depositAmount)}>Deposit</button>

        <br />
        <br />
        <hr />
        <br />

        <b>Withdraw Amount </b>
        <input
          type="string"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          onBlur={() => setWithdrawAmount((a) => (isNaN(Number(a)) ? "0" : toFixedS(a, 9)))}
        />
        <br />
        <br />
        <button onClick={() => sendWithdraw(withdrawAmount)}>Withdraw</button>
      </div>
    </>
  );
}

export default App;
