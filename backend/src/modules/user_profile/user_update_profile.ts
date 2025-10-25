import * as T from "@/codegen";
import { get_or_create_user_profile } from "./user_get_profile";

export async function user_update_profile(
  auth_claims: T.AuthClaims,
  body: T.UserProfilePublic,
): Promise<T.UserProfileResolved> {
  const user_profile = await get_or_create_user_profile(auth_claims.user_uuid);

  Object.assign(user_profile, body);
  await user_profile.save();
  return user_profile;
}
