import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_archive_real_asset_by_uuid(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
): Promise<T.RealAssetResolved> {
  const filter: T.RealAssetOptional = {
    uuid: real_asset_uuid,
    owner_uuid: auth_claims.user_uuid,
  };

  const found_real_asset = await RealAssetRawModel.findOne(filter);
  if (!found_real_asset) throw new Error("Real asset not found");

  if (found_real_asset.status === T.RealAssetStatus.Archived) {
    throw new Error("Real asset is already archived");
  }

  const updated_asset = await RealAssetRawModel.updateOne(filter, {
    status: T.RealAssetStatus.Archived,
    updated_at: Date.now(),
  });

  if (updated_asset.matchedCount === 0) throw new Error("Failed to archive real asset");

  const refreshed_asset = await RealAssetRawModel.findOne(filter);
  if (!refreshed_asset) throw new Error("Failed to retrieve archived real asset");

  return refreshed_asset;
}