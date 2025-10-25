// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { RealAssetType } from ".";
import type { Geopoint } from ".";
import type { RealAssetStatus } from ".";
import type { RealAssetParameter } from ".";
// ===============================================================
export type RealAssetRaw = {
  uuid: string;
  owner_uuid: string;
  photo_list: string[];
  is_tokenized: boolean;
  is_approved_by_gov: boolean;
  created_at: number;
  updated_at: number;
  status: RealAssetStatus;
  name: string;
  description?: string;
  asset_type: RealAssetType;
  parameters: RealAssetParameter[];
  location: Geopoint;
  gov_comment?: string;
};
