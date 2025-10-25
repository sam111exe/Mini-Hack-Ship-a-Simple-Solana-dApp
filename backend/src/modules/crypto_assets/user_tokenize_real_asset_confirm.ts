import { SolGateWay, SolTx } from "@/blockchain/@soltools";
import * as T from "@/codegen";
import { web3 } from "@coral-xyz/anchor";
import { build_tokenization_tx } from "./user_tokenize_real_asset";
import { CryptoAssetRawModel, RealAssetRawModel } from "@/codegen/models";
import { app_account } from "@/blockchain/app_account";
import { get_nft_mint_keypair } from "@/blockchain/get_nft_mint_keypair";
import { v4 } from "uuid";
import { CONFIG } from "@/config";

export async function user_tokenize_real_asset_confirm(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
  body: T.SignedTransactionPayload,
): Promise<T.TokenizationResult> {
  console.log("body", body);

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

  const { connection } = SolGateWay.instance;
  if (!body.owner_public_key) throw new Error("❌ owner_public_key is required");
  const owner_key = new web3.PublicKey(body.owner_public_key);
  if (!owner_key) throw new Error("❌ invalid owner_public_key");

  const signature = body.signature;
  if (!signature) throw new Error("❌ signature is required");
  const recent_blockhash = body.recent_blockhash as string;
  if (!recent_blockhash) throw new Error("❌ recent_blockhash is required");
  const total_nft_amount = await CryptoAssetRawModel.countDocuments({});
  const nft_no = total_nft_amount + 1;
  const tx = await build_tokenization_tx(body.owner_public_key);

  tx.recentBlockhash = recent_blockhash;
  tx.addSignature(owner_key, Buffer.from(signature, "base64"));
  tx.partialSign(app_account.key_holder.key_pair);
  tx.partialSign(get_nft_mint_keypair(nft_no));

  let tx_hash: string | undefined = undefined;
  let attempt = 0;
  for (let i = 0; i < 10; i++) {
    try {
      tx_hash = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true });
      break;
    } catch (e) {
      if (attempt >= 10) throw e;
      console.log(e);
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
      /* handle error */
    }
  }
  if (!tx_hash) throw new Error("Failed to send transaction");

  console.log("X");
  await SolTx.from_tx_hash(tx_hash).wait_for_confirmation();

  real_asset.status = T.RealAssetStatus.TokenizationInProgress;
  await real_asset.save();

  const crypto_asset: T.CryptoAssetRaw = {
    uuid: v4(),
    no: nft_no,
    owner_uuid: real_asset.owner_uuid,
    real_asset_uuid: real_asset.uuid,
    owner_address: body.owner_public_key,
    mint_address: get_nft_mint_keypair(nft_no).publicKey.toBase58(),
    update_authority_address: app_account.key_holder.key_pair.publicKey.toBase58(),
    name: `RealX NFT ${nft_no}`,
    symbol: "REALX",
    json_metadata_uri: `${CONFIG.HOST}/api/meta/${nft_no}`,
    seller_fee_basis_points: 0,
    creators_address_list: [],
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  await CryptoAssetRawModel.create(crypto_asset);

  return { tx_hash };
}
