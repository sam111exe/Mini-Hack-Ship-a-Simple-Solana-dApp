import * as web3 from "@solana/web3.js";
import { SolKeyHolder } from "./key_holder";
import { SolGateWay } from "./gateway";
import { SolTx } from "./sol_tx";
import { SolReadOnlyAccount } from "./read_only_account";
import { AppError } from "./errors";
// SolOwnedAccount is a class that represents a account that can be used to read and write data to the blockchain.

export class SolOwnedAccount extends SolReadOnlyAccount {
  //private _anchor_account: anchor.Account;
  public key_holder: SolKeyHolder;

  private constructor(key_holder: SolKeyHolder, custom_gate_way?: SolGateWay) {
    super(key_holder.key_pair.publicKey.toBase58(), custom_gate_way);
    this.key_holder = key_holder;
    //this._anchor_account = new anchor.Account(key_holder.key_pair);
  }

  static new(custom_gate_way?: SolGateWay): SolOwnedAccount {
    const key_holder = SolKeyHolder.new();
    return new SolOwnedAccount(key_holder, custom_gate_way);
  }

  static from_json_file(file_path: string, custom_gate_way?: SolGateWay): SolOwnedAccount {
    const key_holder = SolKeyHolder.from_json_file(file_path);
    return this.from_key_holder(key_holder, custom_gate_way);
  }

  static from_priv_key(priv_key: string, custom_gate_way?: SolGateWay): SolOwnedAccount {
    const key_holder = SolKeyHolder.from_private_key(priv_key);
    return this.from_key_holder(key_holder, custom_gate_way);
  }

  static from_key_holder(key_holder: SolKeyHolder, custom_gate_way?: SolGateWay): SolOwnedAccount {
    return new SolOwnedAccount(key_holder, custom_gate_way);
  }

  async send_and_confirm_tx(raw_tx: web3.Transaction, signers: SolOwnedAccount[] = []): Promise<SolTx> {
    const { connection } = this.gate_way;
    const tx_hash = await web3.sendAndConfirmTransaction(connection, raw_tx, [
      this.key_holder.key_pair,
      ...signers.map((v) => v.key_holder.key_pair),
    ]);
    return SolTx.from_tx_hash(tx_hash);
  }

  async transfer<T extends SolReadOnlyAccount>(to: T, lamports: number): Promise<SolTx> {
    const transfer_data = { fromPubkey: this.public_key, toPubkey: to.public_key, lamports };
    const instruction = web3.SystemProgram.transfer(transfer_data);
    const raw_tx = new web3.Transaction().add(instruction);
    return this.send_and_confirm_tx(raw_tx);
  }

  async transfer_with_rent<T extends SolReadOnlyAccount>(to: T, lamports: number): Promise<SolTx> {
    try {
      return await this.transfer(to, lamports);
    } catch (e: any) {
      const err = AppError.try_from(e);
      if (err && err.code === err.CODES.InsufficientFundsForRent) {
        const rent_amount = await SolGateWay.instance.connection.getMinimumBalanceForRentExemption(0);
        return await this.transfer(to, lamports + rent_amount);
      }
      throw e;
    }
  }

  async derive_account_from_seed(
    program_account: SolReadOnlyAccount,
    seed: string,
    account_space_size: number
  ): Promise<SolReadOnlyAccount> {
    const new_public_key = await web3.PublicKey.createWithSeed(this.public_key, seed, program_account.public_key);
    const account = await this.gate_way.get_account_info(new_public_key);

    if (account === undefined) {
      const lamports = await this.gate_way.connection.getMinimumBalanceForRentExemption(account_space_size);

      const raw_tx = new web3.Transaction().add(
        web3.SystemProgram.createAccountWithSeed({
          fromPubkey: this.public_key,
          basePubkey: this.public_key,
          seed,
          newAccountPubkey: new_public_key,
          lamports,
          space: account_space_size,
          programId: program_account.public_key,
        })
      );
      await this.send_and_confirm_tx(raw_tx);
    }

    return new SolReadOnlyAccount(new_public_key, this.gate_way);
  }

  async ping_program(program_account: SolOwnedAccount, keys: web3.AccountMeta[] = [], data: Buffer): Promise<SolTx> {
    const account_info_result = await this.gate_way.get_account_info(program_account.public_key);
    const account_info = account_info_result;
    if (account_info === null) throw new Error("Program account does not exist");

    const programId = program_account.public_key;
    const instruction = new web3.TransactionInstruction({ keys, programId, data });

    const raw_tx = new web3.Transaction().add(instruction);
    return await this.send_and_confirm_tx(raw_tx);
  }
}
