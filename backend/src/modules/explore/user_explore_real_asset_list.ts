import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";

export async function user_explore_real_asset_list(
  auth_claims: T.AuthClaims,
  body: T.ExploreFilter,
): Promise<T.RealAssetResolved[]> {
  const query: Partial<Record<keyof T.RealAssetOptional, any>> = { is_approved_by_gov: true };

  query.owner_uuid = { $ne: auth_claims.user_uuid };

  if (body.asset_type_list && body.asset_type_list.length > 0) {
    query.asset_type = { $in: body.asset_type_list };
  }

  if (body.location_area && body.location_area.length > 0) {
    query.location = {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [body.location_area.map((point) => [point.lng, point.lat])],
        },
      },
    };
  }

  const real_assets = await RealAssetRawModel.find(query).lean();
  return real_assets;
}
