import * as T from "@/codegen";
import { CryptoAssetRawModel } from "@/codegen/models/crypto_asset_raw_model";

export async function user_get_crypto_asset_list(auth_claims: T.AuthClaims): Promise<T.CryptoAssetResolved[]> {
  const crypto_assets = await CryptoAssetRawModel.find({ owner_uuid: auth_claims.user_uuid }).lean();
  return crypto_assets;
}
