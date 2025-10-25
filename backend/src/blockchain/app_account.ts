import { CONFIG } from "@/config";
import { Logger } from "./logger";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolOwnedAccount } from "./@soltools";

const SOLANA_APP_ACCOUNT_PRIVATE_KEY = process.env.SOLANA_APP_ACCOUNT_PRIVATE_KEY;
if (!SOLANA_APP_ACCOUNT_PRIVATE_KEY) throw new Error("SOLANA_APP_ACCOUNT_PRIVATE_KEY is not set");
export const app_account = SolOwnedAccount.from_priv_key(SOLANA_APP_ACCOUNT_PRIVATE_KEY);
Logger.log("🔑 APP ACCOUNT", ` - PUBLIC_KEY: ${app_account.public_key.toBase58()}`);

/*
if (CONFIG.DEV_MODE) {
  app_account.get_lamports().then((lamports) => {
    Logger.log("🔑 APP ACCOUNT", ` - LAMPORTS: ${lamports}`);
    if (lamports < 10 * LAMPORTS_PER_SOL) {
      Logger.log("🔑 APP ACCOUNT", ` - AIRDROPING 10 SOL`);
      app_account.airdrop_lamports(1 * LAMPORTS_PER_SOL);
    }
  });
}
* **/
