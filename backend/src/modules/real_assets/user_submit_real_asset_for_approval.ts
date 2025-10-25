import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_submit_real_asset_for_approval(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
): Promise<T.RealAssetResolved> {
  //
  const filter: T.RealAssetOptional = { uuid: real_asset_uuid, owner_uuid: auth_claims.user_uuid };
  const real_asset = await RealAssetRawModel.findOne(filter);

  if (!real_asset) throw new Error("Real asset not found");
  if (real_asset.status !== T.RealAssetStatus.Draft) throw new Error("Real asset not in draft status");

  // Update asset status to pending approval
  real_asset.status = T.RealAssetStatus.PendingApprovalByGov;
  real_asset.updated_at = Date.now();
  await real_asset.save();

  return real_asset;
}
