// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { RealAssetType } from ".";
import type { Geopoint } from ".";
// ===============================================================
export type ExploreFilter = {
  asset_type_list?: RealAssetType[];
  min_price?: number;
  max_price?: number;
  location_area?: Geopoint[];
};
