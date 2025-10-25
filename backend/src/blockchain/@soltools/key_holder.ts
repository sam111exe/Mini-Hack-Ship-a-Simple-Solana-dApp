import * as web3 from "@solana/web3.js";
import bs58 from "bs58";

export class SolKeyHolder {
  private _key_pair: web3.Keypair;

  private constructor(key_pair: web3.Keypair) {
    this._key_pair = key_pair;
  }

  static new(): SolKeyHolder {
    const keypair = web3.Keypair.generate();
    return new SolKeyHolder(keypair);
  }

  static from_private_key(encoded: string): SolKeyHolder {
    const decoded = bs58.decode(encoded);
    return SolKeyHolder.from_private_key_bytes(decoded);
  }

  static from_private_key_bytes(bytes: Uint8Array): SolKeyHolder {
    const keypair = web3.Keypair.fromSecretKey(bytes);
    return new SolKeyHolder(keypair);
  }

  static from_json_string(json_string: string): SolKeyHolder {
    const raw_data = Uint8Array.from(JSON.parse(json_string));
    return this.from_private_key_bytes(raw_data);
  }

  static from_json_file(file_path: string): SolKeyHolder {
    // Only NODEJS environment is supported
    // @ts-ignore
    if (typeof window !== "undefined") throw new Error("This method is not supported in the browser");
    const fs = require("fs");
    const json_data = fs.readFileSync(file_path, "utf-8");
    const raw_data = Uint8Array.from(JSON.parse(json_data));
    return this.from_private_key_bytes(raw_data);
  }

  get key_pair(): web3.Keypair {
    return this._key_pair;
  }

  get b58(): string {
    return bs58.encode(this._key_pair.secretKey);
  }
}
