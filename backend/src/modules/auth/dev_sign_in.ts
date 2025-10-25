import * as T from "@/codegen";
import * as M from "@/codegen/models";
import { generate_jwt_bundle } from "./utils";
import { v4 } from "uuid";

export async function dev_sign_in(login: string): Promise<T.AuthJwtBundle> {
  let auth_profile = await M.AuthProfileRawModel.findOne({ provider: "dev", login });

  if (!auth_profile) {
    const user_create_data: T.AuthUserRaw = {
      uuid: v4(),
      roles: [],
      date_created: Date.now(),
      date_last_login: Date.now(),
    };
    const user = await M.AuthUserRawModel.create(user_create_data);

    // Create auth profile
    const auth_profile_raw: T.AuthProfileRaw = {
      uuid: v4(),
      provider: "dev",
      login,
      meta: {},
      user_uuid: user.uuid,
      date_last_login: Date.now(),
      date_created: Date.now(),
    };
    auth_profile = new M.AuthProfileRawModel(auth_profile_raw);

    await auth_profile.save();
  }

  let role = "USER";

  switch (login) {
    case "admin":
      role = "ADMIN";
      break;
    case "gov":
      role = "GOV";
      break;
    case "oracle":
      role = "ORACLE";
      break;
  }

  return await generate_jwt_bundle(auth_profile.user_uuid, [role]);
}
