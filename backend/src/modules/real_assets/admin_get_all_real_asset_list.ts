import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { admin_guard } from "@/tools/admin_guard";

export async function admin_get_all_real_asset_list(auth_claims: T.AuthClaims): Promise<T.RealAssetResolved[]> {
  await admin_guard(auth_claims);
  const real_assets = await RealAssetRawModel.find({}).lean();
  return real_assets;
}
