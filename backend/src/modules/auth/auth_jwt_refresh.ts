import * as T from "@/codegen";
import JWT from "jsonwebtoken";
import { generate_jwt_bundle } from "./utils";
import { AuthUserRawModel } from "@/codegen/models";

export async function auth_jwt_refresh(
  _auth_claims: T.AuthClaims | undefined,
  body: T.AuthJwtRefreshReq,
): Promise<T.AuthJwtBundle> {
  const secret = process.env.JWT_SECRET || "secret";

  try {
    const decoded = JWT.verify(body.refresh_token, secret) as { user_uuid: string };

    // Check if user still exists
    const user = await AuthUserRawModel.findById(decoded.user_uuid);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return await generate_jwt_bundle(user.uuid);
  } catch (error) {
    throw new Error("JWT_INVALID");
  }
}
