import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_get_real_asset_list(auth_claims: T.AuthClaims): Promise<T.RealAssetResolved[]> {
  const real_assets = await RealAssetRawModel.find({ owner_uuid: auth_claims.user_uuid }).lean();
  return real_assets;
}
