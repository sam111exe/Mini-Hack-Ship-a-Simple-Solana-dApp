import { createSignerFromKeypair, percentAmount, some, transactionBuilder } from "@metaplex-foundation/umi";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { SolReadOnlyAccount } from "./@soltools";
import { send_umi_tx, umi } from "./umi";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { Logger } from "./logger";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { CONFIG } from "@/config";
import { app_account } from "./app_account";
import { get_nft_collection_mint } from "./utils";

export async function generate_collection() {
  Logger.log("🔍 CHECKING COLLECTION", null, "bgCyan");
  const collection_mint_web3 = get_nft_collection_mint();

  const collection_account = new SolReadOnlyAccount(collection_mint_web3.publicKey);

  if ((await collection_account.is_exists()) === true) {
    Logger.log(
      "✅ COLLECTION EXISTS IN BLOCKCHAIN",
      ` - COLLECTION_ADDRESS: ${collection_mint_web3.publicKey.toBase58()}`,
    );
    return;
  }

  Logger.log("❌ COLLECTION DOES NOT EXIST IN BLOCKCHAIN");
  Logger.log("🚀 GENERATING COLLECTION");

  const collection_mint = createSignerFromKeypair(umi, fromWeb3JsKeypair(collection_mint_web3));
  const SPL_TOKEN_2022_PROGRAM_ID = fromWeb3JsPublicKey(TOKEN_2022_PROGRAM_ID);

  const token = findAssociatedTokenPda(umi, {
    mint: collection_mint.publicKey,
    owner: umi.payer.publicKey,
    tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
  });

  //console.log(collection_mint_web3.publicKey.toBase58());
  const create_collection_tx = await transactionBuilder()
    .add(
      createNft(umi, {
        mint: collection_mint,
        token,
        tokenOwner: umi.payer.publicKey,
        authority: umi.payer,
        name: "RealX NFT Collection",
        symbol: "REALX",
        uri: `${CONFIG.HOST}/api/meta/collection.json`,
        sellerFeeBasisPoints: percentAmount(5), // 5%
        splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
        isCollection: true,
        collectionDetails: some({
          __kind: "V1",
          size: 10000,
        }),
      }),
    )
    .buildAndSign(umi);

  const lamports = await app_account.get_lamports();
  if (lamports === 0) {
    console.error(
      `❌ REQUIRED LAMPORTS FOR CREATE NFT COLLECTION! APP ACCOUNT (${app_account.address}) HAS NO ENOUGH LAMPORTS: ${lamports}. `,
    );
    process.exit(1);
  }
  await send_umi_tx(create_collection_tx);

  Logger.log("✅ COLLECTION CREATED");

  return collection_mint_web3.publicKey;
}

(async () => {
  try {
    await generate_collection();
  } catch (e: any) {
    console.log(e);
    console.log(e.logs);
    //process.exit(1);
  }
})();
