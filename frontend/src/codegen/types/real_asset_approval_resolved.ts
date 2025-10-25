// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { RealAssetResolved } from ".";
// ===============================================================
export type RealAssetApprovalResolved = {
  uuid: string;
  real_asset_uuid: string;
  approver_uuid: string;
  created_at: number;
  updated_at: number;
  comment?: string;
  real_asset: RealAssetResolved;
};
