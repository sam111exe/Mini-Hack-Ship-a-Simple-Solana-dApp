// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { Geopoint } from ".";
import type { RealAssetType } from ".";
// ===============================================================
export type ExploreFilter = {
  asset_type_list?: RealAssetType[];
  min_price?: number;
  max_price?: number;
  location_area?: Geopoint[];
};
