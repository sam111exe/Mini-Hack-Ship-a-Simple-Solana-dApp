import { SolCluster, SolGateWay } from "./gateway";
import { PublicKey } from "@solana/web3.js";
import { SolTx } from "./sol_tx";

// ReadOnlyAccount is a class that represents a account that can only be used to read data from the blockchain.
export class SolReadOnlyAccount {
  private _public_key: PublicKey;
  private _gate_way?: SolGateWay;

  constructor(public_key: string | PublicKey, custom_gate_way?: SolGateWay) {
    this._public_key = typeof public_key === "string" ? new PublicKey(public_key) : public_key;
    this._gate_way = custom_gate_way;
  }

  async is_exists(): Promise<boolean> {
    const { _public_key, gate_way } = this;
    const info = await gate_way.connection.getAccountInfo(_public_key);
    if (info === null) return false;
    return true;
  }

  get address(): string {
    return this._public_key.toBase58();
  }

  get public_key(): PublicKey {
    return this._public_key;
  }

  get gate_way(): SolGateWay {
    return this._gate_way || SolGateWay.instance;
  }

  async get_lamports(): Promise<number> {
    const { _public_key, gate_way } = this;
    let balance = await gate_way.connection.getBalance(_public_key);
    return balance;
  }

  async airdrop_lamports(lamports: number = 5e9): Promise<SolTx> {
    if (this.gate_way.cluster === SolCluster.MainnetBeta) throw new Error("Cannot airdrop to mainnet");
    const { _public_key, gate_way } = this;
    return await gate_way.request_airdrop(_public_key, lamports);
  }

  async info(name: string = "Account"): Promise<void> {
    const { address } = this;
    console.log(`[account:info] ${name}\t| Address: ${address} | Balance: ${await this.get_lamports()} LAMPORTS`);
  }

  get url(): string {
    return this.gate_way.get_explorer_url(this);
  }

  log_url(): void {
    console.log(this.url);
  }
}
