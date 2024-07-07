import {
  Cell,
  Sender,
  Address,
  Contract,
  SendMode,
  beginCell,
  contractAddress,
  ContractProvider,
} from "@ton/core";
import { Maybe } from "@ton/core/dist/utils/maybe";

interface MainContractConfig {
  owner: Address;
  counter?: number;
  lastSender?: Maybe<Address>;
}

export enum OPs {
  increment = 1,
  deposit = 2,
  withdraw = 3,
  destroy = 4,
}

export function myFirstBlueprintContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeAddress(config.lastSender)
    .storeUint(config.counter ?? 0, 32)
    .storeAddress(config.owner)
    .endCell();
}

export class MyFirstBlueprintContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new MyFirstBlueprintContract(address);
  }

  static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
    const data = myFirstBlueprintContractConfigToCell(config);
    const init = { code, data };
    return new MyFirstBlueprintContract(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      body: beginCell().endCell(),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
  }

  async sendInternalMessage(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    op: OPs,
    extraParam?: number | bigint
  ): Promise<void> {
    let body: Cell;
    switch (op) {
      case OPs.withdraw:
        body = beginCell().storeUint(op, 4).storeCoins(extraParam!).endCell();
        break;

      case OPs.increment:
        body = beginCell()
          .storeUint(op, 4)
          .storeUint(extraParam ?? 0, 32)
          .endCell();
        break;

      case OPs.deposit:
      case OPs.destroy:
        body = beginCell().storeUint(op, 4).endCell();
    }

    await provider.internal(sender, {
      value,
      body,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    await this.sendInternalMessage(provider, sender, value, OPs.deposit);
  }

  async sendIncrement(provider: ContractProvider, sender: Sender, value: bigint, incrementBy: number) {
    await this.sendInternalMessage(provider, sender, value, OPs.increment, incrementBy);
  }

  async sendWithdraw(provider: ContractProvider, sender: Sender, value: bigint, withdrawalAmount: bigint) {
    await this.sendInternalMessage(provider, sender, value, OPs.withdraw, withdrawalAmount);
  }

  async sendDestroy(provider: ContractProvider, sender: Sender, value: bigint) {
    await this.sendInternalMessage(provider, sender, value, OPs.destroy);
  }

  // Get the most recent sender address. This function is defined in the contract's code
  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []);
    return { lastSender: stack.readAddress(), sum: stack.readNumber(), owner: stack.readAddress() };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return stack.readNumber();
  }
}
