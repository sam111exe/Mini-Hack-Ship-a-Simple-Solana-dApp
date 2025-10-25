import * as T from "@/codegen";
import { auth } from "@/modules/auth";
import { user_profile } from "@/modules/user_profile";
import { upload } from "@/modules/upload";
import { user_get_frontend_bundle } from "./modules/frontend_bundle";
import * as real_assets from "./modules/real_assets";
import * as fav from "./modules/fav";
import * as crypto_assets from "./modules/crypto_assets";
import * as kyc from "./modules/kyc";
import * as explore from "./modules/explore";

export class Controller implements T.API {
  // KYC
  admin_approve_kyc_request = kyc.admin_approve_kyc_request;
  admin_get_kyc_requests = kyc.admin_get_kyc_requests;
  admin_reject_kyc_request = kyc.admin_reject_kyc_request;
  user_verify_kyc = kyc.user_verify_kyc;

  // REAL ASSETS
  admin_get_all_real_asset_list = real_assets.admin_get_all_real_asset_list;
  gov_approve_real_asset_by_uuid = real_assets.gov_approve_real_asset_by_uuid;
  gov_get_real_asset_approval_list = real_assets.gov_get_real_asset_approval_list;
  gov_reject_real_asset_by_uuid = real_assets.gov_reject_real_asset_by_uuid;
  user_archive_real_asset_by_uuid = real_assets.user_archive_real_asset_by_uuid;
  user_create_real_asset = real_assets.user_create_real_asset;
  user_get_real_asset_list = real_assets.user_get_real_asset_list;
  user_submit_real_asset_for_approval = real_assets.user_submit_real_asset_for_approval;
  user_update_real_asset_by_uuid = real_assets.user_update_real_asset_by_uuid;

  // CRYPTO ASSETS
  user_get_crypto_asset_list = crypto_assets.user_get_crypto_asset_list;
  user_tokenize_real_asset = crypto_assets.user_tokenize_real_asset;
  user_tokenize_real_asset_confirm = crypto_assets.user_tokenize_real_asset_confirm;

  // FAV
  user_add_fav_item = fav.user_add_fav_item;
  user_get_fav_real_asset_list = fav.user_get_fav_real_asset_list;
  user_remove_fav_item = fav.user_remove_fav_item;

  // MISC
  user_get_frontend_bundle = user_get_frontend_bundle;
  upload = upload;
  //PROFILE
  user_get_profile = user_profile.user_get_profile;
  user_update_profile = user_profile.user_update_profile;
  // AUTH
  auth_check = auth.auth_check;
  auth_google_sign_in = auth.auth_google_sign_in;
  auth_google_sign_up = auth.auth_google_sign_up;
  auth_google_sign_up_sert = auth.auth_google_sign_up_sert;
  auth_jwt_refresh = auth.auth_jwt_refresh;
  auth_sign_out = auth.auth_sign_out;

  // EXPLORE
  user_explore_real_asset_list = explore.user_explore_real_asset_list;

  // DEV ONLY
  dev_sign_in = auth.dev_sign_in;
}
