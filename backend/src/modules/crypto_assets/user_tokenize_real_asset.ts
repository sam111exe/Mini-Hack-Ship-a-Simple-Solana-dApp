import { SolGateWay } from "@/blockchain/@soltools";
import { get_mint_and_verify_nft_instructions } from "@/blockchain/get_mint_and_verify_nft_instructions";
import { get_nft_mint_keypair } from "@/blockchain/get_nft_mint_keypair";
import * as T from "@/codegen";
import { CryptoAssetRawModel } from "@/codegen/models";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { web3 } from "@coral-xyz/anchor";
import { toWeb3JsInstruction } from "@metaplex-foundation/umi-web3js-adapters";

export async function user_tokenize_real_asset(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
  body: T.RealAssetTokenizationPayload,
): Promise<T.RealAssetTokenizationResponse> {
  const real_asset_filter: T.RealAssetOptional = {
    uuid: real_asset_uuid,
    owner_uuid: auth_claims.user_uuid,
  };

  const real_asset = await RealAssetRawModel.findOne(real_asset_filter);

  if (!real_asset) throw new Error("Real asset not found or not approved for tokenization");

  if (
    real_asset.status !== T.RealAssetStatus.ApprovedByGov &&
    real_asset.status !== T.RealAssetStatus.BlockchainError
  ) {
    throw new Error("Real asset not approved for tokenization or in error state");
  }

  const tx = await build_tokenization_tx(body.owner_address);
  const b64_tx = tx.serialize({ requireAllSignatures: false }).toString("base64");
  // Create crypto asset token
  return {
    b64_tx_to_sign: b64_tx,
  };
}

export async function build_tokenization_tx(owner_address_str: string): Promise<web3.Transaction> {
  const total_nft_amount = await CryptoAssetRawModel.countDocuments({});
  const nft_no = total_nft_amount + 1;
  let tx = new web3.Transaction();
  const owner_pubkey = new web3.PublicKey(owner_address_str);
  const nft_mint_tx_instructions = await get_mint_and_verify_nft_instructions(nft_no, owner_pubkey);
  const nft_mint_web3_tx_instructions = nft_mint_tx_instructions.map(toWeb3JsInstruction);

  tx = tx.add(...nft_mint_web3_tx_instructions);

  tx.recentBlockhash = (await SolGateWay.instance.connection.getLatestBlockhash("finalized")).blockhash;
  tx.feePayer = owner_pubkey;
  tx.partialSign(get_nft_mint_keypair(nft_no));
  return tx;
}
