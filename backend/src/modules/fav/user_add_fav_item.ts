import * as T from "@/codegen";
import { FavItemRawModel } from "@/codegen/models/fav_item_raw_model";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { v4 as uuidv4 } from "uuid";

export async function user_add_fav_item(
  auth_claims: T.AuthClaims,
  real_asset_uuid: string,
): Promise<T.RealAssetResolved> {
  // Check if real asset exists
  const real_asset = await RealAssetRawModel.findOne({ uuid: real_asset_uuid });
  if (!real_asset) throw new Error("Real asset not found");

  // Check if already favorited
  const filter: T.FavItemOptional = {
    user_uuid: auth_claims.user_uuid,
    real_asset_uuid: real_asset_uuid,
  };

  const existing_fav = await FavItemRawModel.findOne(filter);
  if (existing_fav) throw new Error("Item already in favorites");

  // Add to favorites
  const new_fav_item: T.FavItemRaw = {
    uuid: uuidv4(),
    user_uuid: auth_claims.user_uuid,
    real_asset_uuid: real_asset_uuid,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  const fav_item_doc = new FavItemRawModel(new_fav_item);
  await fav_item_doc.save();

  return real_asset;
}
