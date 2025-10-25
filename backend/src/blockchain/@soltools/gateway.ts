import * as web3 from "@solana/web3.js";
import { SolTx } from "./sol_tx";
import { SolReadOnlyAccount } from "./read_only_account";

// Singleton pattern
let default_instance: SolGateWay;

export enum SolCluster {
  Devnet = "devnet",
  Testnet = "testnet",
  MainnetBeta = "mainnet-beta",
  Localnet = "localnet",
}

export class SolGateWay {
  private idx = 0;
  //private _connection: web3.Connection;
  private _rpc_endpoints: string[];
  private connections: web3.Connection[];
  readonly cluster: SolCluster;

  get rpc_endpoint(): string {
    return this._rpc_endpoints[this.idx % this._rpc_endpoints.length];
  }

  constructor(cluster: SolCluster, rpc_endpoints: string[]) {
    this.cluster = cluster;
    this._rpc_endpoints = rpc_endpoints;
    /*
    this._connection = new web3.Connection(this._rpc_endpoint, {
      commitment: "confirmed",
      disableRetryOnRateLimit: true,
    });
    */
    this.connections = this._rpc_endpoints.map(
      (rpc_url) =>
        new web3.Connection(rpc_url, {
          commitment: "confirmed",
          disableRetryOnRateLimit: true,
          confirmTransactionInitialTimeout: 1000 * 60,
        })
    );
  }

  get connection(): web3.Connection {
    const c = this.connections[this.idx++ % this.connections.length];
    return c;
  }

  static init(
    cluster: SolCluster = SolCluster.Localnet,
    rpc_endpoints: string[] = ["https://mbp.sergazin.kz:8898"]
  ) {
    // IS PROCESS EXISTS
    // @ts-ignore
    if (!globalThis.window && process.env.SOLANA_CLUSTER && process.env.SOLANA_RPC_ENDPOINT) {
      //const env_cluster = process.env.SOLANA_CLUSTER;
      const env_rpc_endpoint = process.env.SOLANA_RPC_ENDPOINT;
      console.log("Using env.SOLANA_CLUSTER and env.SOLANA_RPC_ENDPOINT");

      if (Object.values(SolCluster).includes(cluster as any) === false)
        throw new Error("env.SOLANA_CLUSTER is not a valid cluster");

      default_instance = new SolGateWay(process.env.SOLANA_CLUSTER as SolCluster, [env_rpc_endpoint]);
    } else {
      default_instance = new SolGateWay(cluster, rpc_endpoints);
    }
  }

  static get instance(): SolGateWay {
    if (!default_instance) {
      SolGateWay.init();
      console.log("If you see this message, it means that you are using the default SolGateWay instance");
      console.log(
        "To use a custom instance, call SolGateWay.init(cluster: SolCluster, rpc_endpoint: string) before calling SolGateWay.instance"
      );
    }
    return default_instance;
  }

  get_explorer_url(input: SolTx | SolReadOnlyAccount): string {
    let params = "";

    const base = "https://explorer.solana.com";
    const type = input instanceof SolTx ? "tx" : input instanceof SolReadOnlyAccount ? "address" : "xxx";
    const path = input instanceof SolTx ? input.hash : input instanceof SolReadOnlyAccount ? input.address : "xxx";
    if (this.cluster === SolCluster.Localnet) {
      params = `?cluster=custom&customUrl=https%3A%2F%2Fmbp.sergazin.kz%3A8898`;
    } else {
      params = `?cluster=` + this.cluster.replace("-beta", "");
    }
    return `${base}/${type}/${path}${params}`;
  }

  async request_airdrop(to: web3.PublicKey, lamports: number): Promise<SolTx> {
    const tx_hash = await this.connection.requestAirdrop(to, lamports);
    return SolTx.from_tx_hash(tx_hash);
  }

  async get_account_info(public_key: web3.PublicKey): Promise<web3.AccountInfo<Buffer> | undefined> {
    const account = await this.connection.getAccountInfo(public_key);
    return account || undefined;
  }

  async get_tx_status(sol_tx: SolTx, commitment: web3.Finality) {
    await this.connection.getTransaction(sol_tx.hash, { commitment, maxSupportedTransactionVersion: 0 });
  }
}
