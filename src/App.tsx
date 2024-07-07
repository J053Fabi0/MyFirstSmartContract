import "./App.css";
import useTonConnect from "./hooks/useTonconnect";
import useMainContract from "./hooks/useMainContract";
import { TonConnectButton } from "@tonconnect/ui-react";

function App() {
  const { connected } = useTonConnect();
  const { contract_address, counter_value, contract_balance, sendIncrement } = useMainContract();

  return (
    <>
      <TonConnectButton />
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{contract_address ?? "Loading..."}</div>

          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance ?? "Loading..."}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && <button onClick={() => sendIncrement(1)}>Increment</button>}
      </div>
    </>
  );
}

export default App;
