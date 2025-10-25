import * as T from "@/codegen";
import { FavItemRawModel } from "@/codegen/models/fav_item_raw_model";

export async function user_remove_fav_item(auth_claims: T.AuthClaims, real_asset_uuid: string): Promise<void> {
  const result = await FavItemRawModel.deleteOne({
    user_uuid: auth_claims.user_uuid,
    real_asset_uuid: real_asset_uuid
  });

  if (result.deletedCount === 0) {
    throw new Error("Favorite item not found");
  }
}