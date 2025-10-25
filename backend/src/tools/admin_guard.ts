import * as T from "@/codegen";

export async function admin_guard(auth_claims: T.AuthClaims) {
  if (!auth_claims.roles.includes("ADMIN")) {
    throw new Error("Admin access required");
  }
}
export async function gov_guard(auth_claims: T.AuthClaims) {
  if (!auth_claims.roles.includes("GOV")) {
    throw new Error("Admin access required");
  }
}
