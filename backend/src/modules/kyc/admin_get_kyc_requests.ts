import * as T from "@/codegen";
import { UserKycRequestRawModel } from "@/codegen/models/user_kyc_request_raw_model";
import { admin_guard } from "@/tools/admin_guard";

export async function admin_get_kyc_requests(auth_claims: T.AuthClaims): Promise<T.UserKycRequestResolved[]> {
  await admin_guard(auth_claims);

  const kyc_requests = await UserKycRequestRawModel.find({ approved_by_admin: false });

  return kyc_requests;
}
