// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { UserProfileResolved } from ".";
import type { RealAssetResolved } from ".";
import type { CryptoAssetResolved } from ".";
// ===============================================================
export type UserFrontendBundle = {
  profile: UserProfileResolved;
  real_assets_list: RealAssetResolved[];
  crypto_assets_list: CryptoAssetResolved[];
  fav_item_list: RealAssetResolved[];
};
