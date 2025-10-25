import * as T from "@/codegen";
import { auth_google_sign_in } from "./auth_google_sign_in";
import { auth_google_sign_up } from "./auth_google_sign_up";
import { auth_google_sign_up_sert } from "./auth_google_sign_up_sert";
import { auth_jwt_refresh } from "./auth_jwt_refresh";
import { dev_sign_in } from "./dev_sign_in";

export const auth = {
  async auth_check(auth_claims: T.AuthClaims): Promise<T.AuthClaims> {
    console.log("Auth check from: ", auth_claims.user_uuid);
    return auth_claims;
  },
  async auth_sign_out(auth_claims: T.AuthClaims): Promise<void> {
    // In a stateless JWT system, sign out is typically handled client-side
    // by removing the tokens. Server-side logout would require token blacklisting
    console.log("User signed out:", auth_claims.user_uuid);
  },

  auth_google_sign_in,
  auth_google_sign_up,
  auth_google_sign_up_sert,
  auth_jwt_refresh,
  dev_sign_in,
};
