import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models/real_asset_raw_model";
import { v4 as uuidv4 } from "uuid";

export async function user_create_real_asset(
  auth_claims: T.AuthClaims,
  body: T.RealAssetPublic,
): Promise<T.RealAssetResolved> {

  const real_asset: T.RealAssetRaw = {
    ...body,
    uuid: uuidv4(),
    owner_uuid: auth_claims.user_uuid,
    created_at: Date.now(),
    status: T.RealAssetStatus.Draft,
    is_tokenized: false,
    is_approved_by_gov: false,
    updated_at: Date.now(),
  };

  const real_asset_doc = new RealAssetRawModel(real_asset);
  const saved_asset = await real_asset_doc.save();

  return saved_asset;
}
