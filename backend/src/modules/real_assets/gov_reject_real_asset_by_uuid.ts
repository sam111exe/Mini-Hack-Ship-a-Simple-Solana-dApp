import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { gov_guard } from "@/tools/admin_guard";

export async function gov_reject_real_asset_by_uuid(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
  body: T.RealAssetApprovalPublic,
): Promise<T.RealAssetResolved> {
  // Check if user has government role
  await gov_guard(auth_claims);

  const found_real_asset = await RealAssetRawModel.findOne({ uuid: real_asset_uuid });
  if (!found_real_asset) throw new Error("Real asset not found");

  if (found_real_asset.status !== T.RealAssetStatus.PendingApprovalByGov) {
    throw new Error("Real asset is not pending approval by government");
  }

  const real_asset_update_data: Partial<T.RealAssetRaw> = {
    status: T.RealAssetStatus.RejectedByGov,
    is_approved_by_gov: false,
    gov_comment: body.comment,
    updated_at: Date.now(),
  };
  // Update real asset status
  const updated_asset = await RealAssetRawModel.findOneAndUpdate(
    //
    { uuid: real_asset_uuid },
    real_asset_update_data,
    { new: true },
  );

  if (!updated_asset) throw new Error("Failed to update real asset");

  return updated_asset;
}
