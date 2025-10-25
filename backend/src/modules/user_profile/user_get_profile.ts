import * as T from "@/codegen";
import { UserProfileRawModel } from "@/codegen/models/user_profile_raw_model";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

export async function user_get_profile(auth_claims: T.AuthClaims): Promise<T.UserProfileResolved> {
  return await get_or_create_user_profile(auth_claims.user_uuid);
}

export async function get_or_create_user_profile(
  user_uuid: string,
): Promise<T.UserProfileResolved & mongoose.Document> {
  let user_profile = await UserProfileRawModel.findOne({ user_uuid: user_uuid });

  if (!user_profile) {
    const user_profile_create_data: T.UserProfileRaw = {
      uuid: randomUUID(),
      user_uuid: user_uuid,
      bio: "",
    };
    user_profile = await UserProfileRawModel.create(user_profile_create_data);
  }

  return user_profile;
}
