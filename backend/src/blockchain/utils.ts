import { CONFIG } from "@/config";
import { web3 } from "@coral-xyz/anchor";

export function get_nft_collection_mint() {
  const web3_mint = web3.Keypair.fromSeed(
    Buffer.from(`__realx_nft_${CONFIG.SOLANA_APP_ACCOUNT_PRIVATE_KEY}`.slice(0, 32)),
  );
  return web3_mint;
}
