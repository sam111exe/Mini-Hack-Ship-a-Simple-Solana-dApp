import { CONFIG } from "@/config";
import { web3 } from "@coral-xyz/anchor";

export function get_nft_mint_keypair(nft_no: number) {
  const web3_mint = web3.Keypair.fromSeed(
    Buffer.from(`realx_nft_${nft_no}_${CONFIG.SOLANA_APP_ACCOUNT_PRIVATE_KEY}`.slice(0, 32)),
  );
  return web3_mint;
}
