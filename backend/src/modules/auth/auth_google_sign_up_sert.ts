import * as T from "@/codegen";
import { auth_google_sign_in } from "./auth_google_sign_in";
import { auth_google_sign_up } from "./auth_google_sign_up";

export async function auth_google_sign_up_sert(body: T.AuthGoogleSignUpSertReq): Promise<T.AuthJwtBundle> {
  // Try to sign in first
  console.log("STEP 1: TRY SIGN IN");
  try {
    return await auth_google_sign_in({ token: body.token });
  } catch (error: any) {
    console.log(error);
    if (error.message !== "USER_NOT_FOUND") {
      throw error;
    }
  }

  console.log("STEP 2: TRY SIGN UP");
  // If sign in failed with USER_NOT_FOUND, try to sign up
  try {
    await auth_google_sign_up({ token: body.token });
  } catch (error: any) {
    console.log(error);
    if (error.message !== "ALREADY_REGISTERED") {
      throw error;
    }
  }

  console.log("STEP 3: TRY SIGN IN AGAIN");
  // Try to sign in again after successful sign up
  try {
    return await auth_google_sign_in({ token: body.token });
  } catch (error) {
    console.log(error);
    throw new Error("GOOGLE_TOKEN_NOT_VALID");
  }
}
