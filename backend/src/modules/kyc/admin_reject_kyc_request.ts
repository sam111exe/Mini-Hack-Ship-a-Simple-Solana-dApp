import * as T from "@/codegen";
import { UserKycRequestRawModel } from "@/codegen/models/user_kyc_request_raw_model";
import { admin_guard } from "@/tools/admin_guard";

export async function admin_reject_kyc_request(
  auth_claims: T.AuthClaims,
  user_uuid: string,
): Promise<T.UserKycRequestResolved> {
  await admin_guard(auth_claims);

  const kyc_request = await UserKycRequestRawModel.findOne({ user_uuid });

  if (!kyc_request) {
    throw new Error("KYC request not found");
  }

  if (!kyc_request.approved_by_admin) {
    throw new Error("KYC request is already rejected or pending");
  }

  const updated_request = await UserKycRequestRawModel.findOneAndUpdate(
    { user_uuid },
    { rejected_by_admin: false },
    { new: true },
  );

  if (!updated_request) {
    throw new Error("Failed to reject KYC request");
  }

  return updated_request;
}
