// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { RealAssetParameter } from ".";
import type { Geopoint } from ".";
import type { RealAssetType } from ".";
// ===============================================================
export type RealAssetPublic = {
  photo_list: string[];
  name: string;
  description?: string;
  asset_type: RealAssetType;
  parameters: RealAssetParameter[];
  location: Geopoint;
  gov_comment?: string;
};
