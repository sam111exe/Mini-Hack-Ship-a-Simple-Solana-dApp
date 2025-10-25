import * as T from "@/codegen";
import { user_get_profile } from "./user_profile/user_get_profile";
import { user_get_real_asset_list } from "./real_assets";
import { user_get_crypto_asset_list } from "./crypto_assets";
import { user_get_fav_real_asset_list } from "./fav";

// Fetches all necessary data for the user's frontend bundle
export async function user_get_frontend_bundle(auth_claims: T.AuthClaims): Promise<T.UserFrontendBundle> {
  const user_frontend_bundle: T.UserFrontendBundle = {
    profile: await user_get_profile(auth_claims),
    real_assets_list: await user_get_real_asset_list(auth_claims),
    crypto_assets_list: await user_get_crypto_asset_list(auth_claims),
    fav_item_list: await user_get_fav_real_asset_list(auth_claims),
  };
  return user_frontend_bundle;
}
