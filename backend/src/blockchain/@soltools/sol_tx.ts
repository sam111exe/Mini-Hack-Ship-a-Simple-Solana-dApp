import bs58 from "bs58";
import { SolGateWay } from "./gateway";
import { IncrementalSleep } from "./utils/incremental_sleep";

export enum SolTxStatus {
  NONE,
  PROCESSED,
  CONFIRMED,
  FINALIZED,
}

export class SolTx {
  private _tx_hash: string;

  private constructor(tx_hash: string) {
    this._tx_hash = tx_hash;
  }

  static from_tx_hash(tx_hash: string): SolTx {
    bs58.decode(tx_hash);
    return new SolTx(tx_hash);
  }

  get hash(): string {
    return this._tx_hash;
  }

  get url(): string {
    return SolGateWay.instance.get_explorer_url(this);
  }

  async get_logs() {
    const tx = await SolGateWay.instance.connection.getParsedTransaction(this._tx_hash);
    console.log(tx);
    return tx?.meta?.logMessages;
  }

  async status(): Promise<SolTxStatus> {
    const status = await SolGateWay.instance.connection.getSignatureStatus(this.hash);
    if (status.value?.confirmationStatus) {
      switch (status.value.confirmationStatus) {
        case "processed":
          return SolTxStatus.PROCESSED;
        case "confirmed":
          return SolTxStatus.CONFIRMED;
        case "finalized":
          return SolTxStatus.FINALIZED;
      }
    } else {
      return SolTxStatus.NONE;
    }
  }

  async wait_for_confirmation(): Promise<void> {
    console.log(`⌛️ Waiting for confirmation of ${this.url}`);
    const sleeper = new IncrementalSleep({ max: 5000, step: 1000, deadline: 15000 });

    while ((await this.status()) === SolTxStatus.NONE) {
      await sleeper.sleep();
    }
    console.log(`✅ Confirmed: ${this.url}`);
  }

  async wait_for_finalization(): Promise<void> {
    console.log(`⌛️ Waiting for finalization of ${this.url}`);
    const sleeper = new IncrementalSleep({ max: 5000, step: 1000, deadline: 80000 });

    while ((await this.status()) === SolTxStatus.NONE) {
      await sleeper.sleep();
    }

    sleeper.reset();

    while ((await this.status()) !== SolTxStatus.FINALIZED) {
      await sleeper.sleep();
    }
  }

  log_url(note?: string): void {
    console.log(`${note ? note + ": " : ""}${this.url}`);
  }
}
