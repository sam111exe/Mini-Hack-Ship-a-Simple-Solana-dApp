import * as T from "@/codegen";
import { fetch_token_info } from "./utils";
import { AuthProfileRawModel, AuthUserRawModel } from "@/codegen/models";
import { v4 } from "uuid";

export async function auth_google_sign_up(body: T.AuthGoogleSignUpReq): Promise<void> {
  // Fetch google token info
  const token_info = await fetch_token_info(body.token);
  const login = token_info.sub;

  // Check if user already exists
  const existing_profile = await AuthProfileRawModel.findOne({
    provider: "google",
    login,
  });

  if (existing_profile) {
    throw new Error("ALREADY_REGISTERED");
  }

  // Create user

  const user_raw: T.AuthUserRaw = {
    uuid: v4(),
    date_created: Date.now(),
    date_last_login: Date.now(),
    roles: [],
  };

  const user = new AuthUserRawModel(user_raw);
  await user.save();

  const auth_profile_raw: T.AuthProfileRaw = {
    uuid: v4(),
    user_uuid: user.uuid,
    provider: "google",
    login,
    date_created: Date.now(),
    meta: {
      token: body.token,
      token_info,
    },
  };
  // Create auth profile
  const auth_profile = new AuthProfileRawModel(auth_profile_raw);

  await auth_profile.save();
}
