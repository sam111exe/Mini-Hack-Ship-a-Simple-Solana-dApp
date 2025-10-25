import * as T from "@/codegen";
import { UserKycRequestRawModel } from "@/codegen/models/user_kyc_request_raw_model";
import { UserProfileRawModel } from "@/codegen/models/user_profile_raw_model";
import { v4 } from "uuid";

export async function user_verify_kyc(
  auth_claims: T.AuthClaims,
  body: T.UserKycRequestPublic,
): Promise<T.UserProfileResolved> {
  const existing_request = await UserKycRequestRawModel.findOne({
    user_uuid: auth_claims.user_uuid,
  });

  if (existing_request) {
    throw new Error("KYC request already exists for this user");
  }

  const kyc_request: T.UserKycRequestRaw = {
    uuid: v4(),
    user_uuid: auth_claims.user_uuid,
    ...body,
    approved_by_admin: false,
    rejected_by_admin: false,
  };

  await UserKycRequestRawModel.create(kyc_request);

  const user_profile = await UserProfileRawModel.findOne({ user_uuid: auth_claims.user_uuid });

  if (!user_profile) {
    throw new Error("User profile not found");
  }
  user_profile.kyc_submitted = true;
  await user_profile.save();

  return user_profile;
}
