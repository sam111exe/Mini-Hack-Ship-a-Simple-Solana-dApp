import { SolGateWay } from "./@soltools";
import { get_nft_mint_keypair } from "./get_nft_mint_keypair";
import { web3 } from "@coral-xyz/anchor";

export async function fetch_nft_owner(nft_no: number) {
  const { connection } = SolGateWay.instance;
  const mint = get_nft_mint_keypair(nft_no).publicKey;
  const token_accounts = await connection.getTokenLargestAccounts(mint);

  const owner_token_account = token_accounts.value[0].amount === "1" ? token_accounts.value[0].address : null;
  if (!owner_token_account) throw new Error("❌ owner_token_account not found");
  const token_account = await connection.getAccountInfo(owner_token_account);
  if (!token_account) throw new Error("❌ token_account not found");
  const owner = new web3.PublicKey(token_account.data.subarray(32, 64));
  if (!owner) throw new Error("❌ owner not found");

  return owner;
}
