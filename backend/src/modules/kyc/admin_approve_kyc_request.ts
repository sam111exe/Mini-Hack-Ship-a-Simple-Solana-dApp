import * as T from "@/codegen";
import { UserKycRequestRawModel } from "@/codegen/models/user_kyc_request_raw_model";
import { admin_guard } from "@/tools/admin_guard";
import { get_or_create_user_profile } from "../user_profile/user_get_profile";

export async function admin_approve_kyc_request(
  auth_claims: T.AuthClaims,
  user_uuid: string,
): Promise<T.UserKycRequestResolved> {
  await admin_guard(auth_claims);

  const kyc_request = await UserKycRequestRawModel.findOne({ user_uuid });

  if (!kyc_request) {
    throw new Error("KYC request not found");
  }

  if (kyc_request.approved_by_admin) {
    throw new Error("KYC request is already approved");
  }

  const updated_request = await UserKycRequestRawModel.findOneAndUpdate(
    { user_uuid },
    { approved_by_admin: true },
    { new: true },
  );

  if (!updated_request) {
    throw new Error("Failed to approve KYC request");
  }

  const user_profile = await get_or_create_user_profile(user_uuid);
  user_profile.kyc_verified = true;
  await user_profile.save();

  return updated_request;
}
