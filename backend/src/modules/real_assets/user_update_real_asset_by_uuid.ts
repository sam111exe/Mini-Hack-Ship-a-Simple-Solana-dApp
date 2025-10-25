import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_update_real_asset_by_uuid(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
  body: T.RealAssetPublic,
): Promise<T.RealAssetResolved> {
  const filter: T.RealAssetOptional = {
    uuid: real_asset_uuid,
    owner_uuid: auth_claims.user_uuid,
  };

  const found_real_asset = await RealAssetRawModel.findOne(filter);
  if (!found_real_asset) throw new Error("Real asset not found");

  if (
    found_real_asset.status != T.RealAssetStatus.Draft &&
    found_real_asset.status != T.RealAssetStatus.RejectedByGov
  ) {
    throw new Error("Only Draft or Rejected assets can be updated");
  }

  const updated_asset = await RealAssetRawModel.updateOne(filter, {
    ...body,
    updated_at: Date.now(),
    status: T.RealAssetStatus.Draft, // Reset status to Draft on update
  });

  if (updated_asset.matchedCount === 0) throw new Error("Failed to update real asset");

  const refreshed_asset = await RealAssetRawModel.findOne(filter);
  if (!refreshed_asset) throw new Error("Failed to retrieve updated real asset");

  return refreshed_asset;
}
