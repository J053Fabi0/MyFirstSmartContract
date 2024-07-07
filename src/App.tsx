import "./App.css";
import useMainContract from "./hooks/useMainContract";
import { TonConnectButton } from "@tonconnect/ui-react";

function App() {
  const { contract_address, counter_value, contract_balance } = useMainContract();

  return (
    <>
      <div>
        <TonConnectButton />
      </div>
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
      </div>
    </>
  );
}

export default App;
