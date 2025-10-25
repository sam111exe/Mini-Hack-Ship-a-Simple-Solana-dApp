import { type Instruction, createSignerFromKeypair, percentAmount, some } from "@metaplex-foundation/umi";
import { createNft, findMetadataPda, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { web3 } from "@coral-xyz/anchor";
import { get_nft_mint_keypair } from "./get_nft_mint_keypair";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { CONFIG } from "@/config";
import { get_umi_dummy, umi } from "./umi";
import { get_nft_collection_mint } from "./utils";

export async function get_mint_and_verify_nft_instructions(
  nft_no: number,
  transfer_to: web3.PublicKey,
): Promise<Instruction[]> {
  const collection_mint = fromWeb3JsPublicKey(get_nft_collection_mint().publicKey);

  const web3_mint_keypair = get_nft_mint_keypair(nft_no);
  const mint = createSignerFromKeypair(umi, fromWeb3JsKeypair(web3_mint_keypair));

  const owner = fromWeb3JsPublicKey(transfer_to);

  const umi_dummy = get_umi_dummy(transfer_to);

  const SPL_TOKEN_2022_PROGRAM_ID = fromWeb3JsPublicKey(TOKEN_2022_PROGRAM_ID);

  const token = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: owner,
    tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
  });

  // fee payer is should be the buyer
  const mint_tx = createNft(umi, {
    mint,
    name: `REALX #${nft_no}`,
    symbol: "REALX",
    uri: `${CONFIG.HOST}/api/meta/${nft_no}/metadata.json`,
    sellerFeeBasisPoints: percentAmount(0), // 5%
    token,
    tokenOwner: fromWeb3JsPublicKey(transfer_to),
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    isCollection: false,
    payer: umi_dummy.payer,
    collection: some({
      verified: false,
      key: collection_mint,
    }),
  });

  const metadata_pda = findMetadataPda(umi, { mint: mint.publicKey });

  const verify_tx = verifyCollectionV1(umi_dummy, {
    metadata: metadata_pda,
    collectionMint: collection_mint,
    authority: umi.payer,
  });

  return mint_tx.add(verify_tx).getInstructions();
}
