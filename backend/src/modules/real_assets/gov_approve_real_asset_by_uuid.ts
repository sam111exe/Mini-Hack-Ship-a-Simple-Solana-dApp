import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { RealAssetApprovalRawModel } from "@/codegen/models/real_asset_approval_raw_model";
import { gov_guard } from "@/tools/admin_guard";
import { v4 } from "uuid";

export async function gov_approve_real_asset_by_uuid(
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

  const approval_raw: T.RealAssetApprovalRaw = {
    uuid: v4(),
    approver_uuid: auth_claims.user_uuid,
    updated_at: Date.now(),
    real_asset_uuid: found_real_asset.uuid,
    created_at: Date.now(),
    comment: body.comment,
  };

  await RealAssetApprovalRawModel.create(approval_raw);

  const real_asset_update_data: Partial<T.RealAssetRaw> = {
    status: T.RealAssetStatus.ApprovedByGov,
    is_approved_by_gov: true,
    gov_comment: body.comment,
    updated_at: Date.now(),
  };
  // Update real asset status
  const updated_asset = await RealAssetRawModel.findOneAndUpdate({ uuid: real_asset_uuid }, real_asset_update_data, {
    new: true,
  });
  if (!updated_asset) throw new Error("Failed to update real asset");

  return updated_asset;
}
