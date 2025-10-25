import * as T from "@/codegen";
import JWT from "jsonwebtoken";

// Google token info interface matching the Rust implementation
export interface google_token_info {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  nbf?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

// Fetch Google token info similar to Rust implementation
export async function fetch_token_info(token: string): Promise<google_token_info> {
  const token_url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;

  const response = await fetch(token_url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("GOOGLE_TOKEN_NOT_VALID");
    }
    throw new Error("INTERNAL_SERVER_ERROR");
  }

  const token_info = (await response.json()) as google_token_info;
  return token_info;
}

// Generate JWT bundle for user
export async function generate_jwt_bundle(user_uuid: string, roles: string[] = []): Promise<T.AuthJwtBundle> {
  const secret = process.env.JWT_SECRET || "secret";
  const auth_claims: T.AuthClaims = {
    user_uuid,
    roles,
  };

  const access_token = JWT.sign(auth_claims, secret, { expiresIn: "30d" });
  const refresh_token = JWT.sign({ user_uuid }, secret, { expiresIn: "30d" });

  return {
    access_token,
    refresh_token,
  };
}
