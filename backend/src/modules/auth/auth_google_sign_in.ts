import * as T from "@/codegen";
import { fetch_token_info, generate_jwt_bundle } from "./utils";
import { AuthProfileRawModel, AuthUserRawModel } from "@/codegen/models";

export async function auth_google_sign_in(body: T.AuthGoogleSignInReq): Promise<T.AuthJwtBundle> {
  // Fetch google token info
  const token_info = await fetch_token_info(body.token);
  const login = token_info.sub;
  console.log("Google login (sub):", login);
  console.log("Google token info:", token_info);

  // Check if user already exists
  const auth_profile = await AuthProfileRawModel.findOne({
    provider: "google",
    login,
  });
  console.log("Auth profile:", auth_profile);

  if (!auth_profile) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!auth_profile.user_uuid) {
    throw new Error("USER_NOT_ASSIGNED");
  }

  const user = await AuthUserRawModel.findOne({ uuid: auth_profile.user_uuid });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Generate JWT bundle
  return await generate_jwt_bundle(user.uuid, user.roles);
}
