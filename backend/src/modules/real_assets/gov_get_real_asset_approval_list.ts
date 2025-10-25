import * as T from "@/codegen";
import { RealAssetRawModel } from "@/codegen/models";
//import * as M from "@/codegen/models";

import { RealAssetApprovalRawModel } from "@/codegen/models/real_asset_approval_raw_model";
import { gov_guard } from "@/tools/admin_guard";

export async function gov_get_real_asset_approval_list(auth_claims: T.AuthClaims): Promise<T.RealAssetResolved[]> {
  // Check if user has government role
  await gov_guard(auth_claims);

  const approval_list = await RealAssetRawModel.find({ status: T.RealAssetStatus.PendingApprovalByGov });

  return approval_list;
}

/*
export async function populate_approval_list(
  approval_doc_list: T.RealAssetApprovalRaw[],
): Promise<T.RealAssetApprovalResolved[]> {
  const real_asset_uuid_list = approval_doc_list.map((approval) => approval.real_asset_uuid);

  const real_asset_doc_list = await RealAssetApprovalRawModel.find({ uuid: { $in: real_asset_uuid_list } });

  const populated_approval_list: T.RealAssetApprovalResolved[] = [];

  for (const approval_doc of approval_doc_list) {
    const approval = (approval_doc as any).toJSON() as unknown as T.RealAssetApprovalRaw;
    const real_asset = real_asset_doc_list.find((asset) => asset.uuid === approval.real_asset_uuid);
    if (!real_asset) continue;
    populated_approval_list.push({
      ...approval,
      real_asset: real_asset.toJSON() as unknown as T.RealAssetResolved,
    });
  }

  return populated_approval_list;
}
* **/
