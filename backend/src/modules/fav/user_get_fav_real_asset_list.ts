import * as T from "@/codegen";
import { FavItemRawModel } from "@/codegen/models/fav_item_raw_model";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_get_fav_real_asset_list(auth_claims: T.AuthClaims): Promise<T.RealAssetResolved[]> {
  const fav_items = await FavItemRawModel.find({
    user_uuid: auth_claims.user_uuid,
  }).lean();

  const real_asset_uuids = fav_items.map((fav) => fav.real_asset_uuid);

  const real_assets = await RealAssetRawModel.find({ uuid: { $in: real_asset_uuids } }).lean();

  return real_assets;
}
