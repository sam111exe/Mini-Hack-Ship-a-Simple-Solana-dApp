// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Server API File
// Generated for Express.js with Bun/Node.js

import * as T from "./types";
export * from "./types";

export interface API {
  admin_approve_kyc_request(auth_claims: AuthClaims, user_uuid: string): Promise<T.UserKycRequestResolved>;
  admin_get_all_real_asset_list(auth_claims: AuthClaims): Promise<T.RealAssetResolved[]>;
  admin_get_kyc_requests(auth_claims: AuthClaims): Promise<T.UserKycRequestResolved[]>;
  admin_reject_kyc_request(auth_claims: AuthClaims, user_uuid: string): Promise<T.UserKycRequestResolved>;
  auth_check(auth_claims: AuthClaims): Promise<T.AuthClaims>;
  auth_google_sign_in(body: T.AuthGoogleSignInReq): Promise<T.AuthJwtBundle>;
  auth_google_sign_up(body: T.AuthGoogleSignUpReq): Promise<void>;
  auth_google_sign_up_sert(body: T.AuthGoogleSignUpSertReq): Promise<T.AuthJwtBundle>;
  auth_jwt_refresh(auth_claims: AuthClaims | undefined, body: T.AuthJwtRefreshReq): Promise<T.AuthJwtBundle>;
  auth_sign_out(auth_claims: AuthClaims): Promise<void>;
  dev_sign_in(username: string): Promise<T.AuthJwtBundle>;
  gov_approve_real_asset_by_uuid(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
    body: T.RealAssetApprovalPublic,
  ): Promise<T.RealAssetResolved>;
  gov_get_real_asset_approval_list(auth_claims: AuthClaims): Promise<T.RealAssetResolved[]>;
  gov_reject_real_asset_by_uuid(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
    body: T.RealAssetApprovalPublic,
  ): Promise<T.RealAssetResolved>;
  upload(auth_claims: AuthClaims, body: T.UploadRequest): Promise<T.UploadResponse>;
  user_add_fav_item(auth_claims: AuthClaims, real_asset_uuid: string): Promise<T.RealAssetResolved>;
  user_archive_real_asset_by_uuid(auth_claims: AuthClaims, real_asset_uuid: string): Promise<T.RealAssetResolved>;
  user_create_real_asset(auth_claims: AuthClaims, body: T.RealAssetPublic): Promise<T.RealAssetResolved>;
  user_explore_real_asset_list(auth_claims: AuthClaims, body: T.ExploreFilter): Promise<T.RealAssetResolved[]>;
  user_get_crypto_asset_list(auth_claims: AuthClaims): Promise<T.CryptoAssetResolved[]>;
  user_get_fav_real_asset_list(auth_claims: AuthClaims): Promise<T.RealAssetResolved[]>;
  user_get_frontend_bundle(auth_claims: AuthClaims): Promise<T.UserFrontendBundle>;
  user_get_profile(auth_claims: AuthClaims): Promise<T.UserProfileResolved>;
  user_get_real_asset_list(auth_claims: AuthClaims): Promise<T.RealAssetResolved[]>;
  user_remove_fav_item(auth_claims: AuthClaims, real_asset_uuid: string): Promise<void>;
  user_submit_real_asset_for_approval(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
  ): Promise<T.RealAssetResolved>;
  user_tokenize_real_asset(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
    body: T.RealAssetTokenizationPayload,
  ): Promise<T.RealAssetTokenizationResponse>;
  user_tokenize_real_asset_confirm(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
    body: T.SignedTransactionPayload,
  ): Promise<T.TokenizationResult>;
  user_update_profile(auth_claims: AuthClaims, body: T.UserProfilePublic): Promise<T.UserProfileResolved>;
  user_update_real_asset_by_uuid(
    auth_claims: AuthClaims,
    real_asset_uuid: string,
    body: T.RealAssetPublic,
  ): Promise<T.RealAssetResolved>;
  user_verify_kyc(auth_claims: AuthClaims, body: T.UserKycRequestPublic): Promise<T.UserProfileResolved>;
}

import JWT from "jsonwebtoken";
export type AuthClaims = { user_uuid: string; roles: string[] };

export function jwt_validate(access_token?: string): AuthClaims {
  if (!access_token) throw "JWT_INVALID";
  if (access_token.includes("Bearer ")) {
    access_token = access_token.split("Bearer ")[1];
  }
  const secret = process.env.JWT_SECRET || "secret";
  try {
    const decoded = JWT.verify(access_token, secret) as AuthClaims;
    return decoded;
  } catch (e) {
    if (e instanceof JWT.TokenExpiredError) {
      console.log({ expiredAt: e.expiredAt, now: new Date() });
      throw "JWT_EXPIRED";
    }
    throw "JWT_INVALID";
  }
}

import express from "express";
export function apply_routes(router: express.Router, api: API) {
  router.post("/admin/user/profile/approve-kyc-request/:user_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { user_uuid } = req.params;
      res.json(await api.admin_approve_kyc_request(auth_header, user_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.post("/admin/asset/get-all-real-asset-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.admin_get_all_real_asset_list(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/admin/user/profile/get-kyc-requests", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.admin_get_kyc_requests(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/admin/user/profile/reject-kyc-request/:user_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { user_uuid } = req.params;
      res.json(await api.admin_reject_kyc_request(auth_header, user_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.get("/auth/check", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.auth_check(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/auth/google/sign-in", async (req, res, next) => {
    try {
      res.json(await api.auth_google_sign_in(req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/auth/google/google-sign-up", async (req, res, next) => {
    try {
      res.json(await api.auth_google_sign_up(req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/auth/google/google-sign-up-sert", async (req, res, next) => {
    try {
      res.json(await api.auth_google_sign_up_sert(req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/auth/jwt-refresh", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {}

      res.json(await api.auth_jwt_refresh(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/auth/sign-out", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.auth_sign_out(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/dev/auth/sign-in/:username", async (req, res, next) => {
    try {
      const { username } = req.params;
      res.json(await api.dev_sign_in(username));
    } catch (e) {
      next(e);
    }
  });
  router.post("/gov/asset/approve-real-asset/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.gov_approve_real_asset_by_uuid(auth_header, real_asset_uuid, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/gov/asset/get-real-asset-approval-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.gov_get_real_asset_approval_list(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/gov/asset/reject-real-asset/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.gov_reject_real_asset_by_uuid(auth_header, real_asset_uuid, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/upload", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.upload(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/fav/add-fav-item/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_add_fav_item(auth_header, real_asset_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/archive-real-asset/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_archive_real_asset_by_uuid(auth_header, real_asset_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/create-real-asset", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_create_real_asset(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/explore-assets/real-asset-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_explore_real_asset_list(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/get-crypto-asset-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_get_crypto_asset_list(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/fav/fav-real-asset-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_get_fav_real_asset_list(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.get("/user/frontend-bundle/get", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_get_frontend_bundle(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.get("/user/profile/get-user-profile", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_get_profile(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/get-real-asset-list", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_get_real_asset_list(auth_header));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/fav/remove-fav-item/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_remove_fav_item(auth_header, real_asset_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/submit-real-asset-for-approval/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_submit_real_asset_for_approval(auth_header, real_asset_uuid));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/tokenize-real-asset/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_tokenize_real_asset(auth_header, real_asset_uuid, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/tokenize-real-asset-confirm/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_tokenize_real_asset_confirm(auth_header, real_asset_uuid, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/profile/update-user-profile", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_update_profile(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/asset/update-real-asset/:real_asset_uuid", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }
      const { real_asset_uuid } = req.params;
      res.json(await api.user_update_real_asset_by_uuid(auth_header, real_asset_uuid, req.body));
    } catch (e) {
      next(e);
    }
  });
  router.post("/user/profile/verify-kyc", async (req, res, next) => {
    try {
      let auth_header: AuthClaims | undefined;
      try {
        auth_header = jwt_validate(req.headers.authorization);
      } catch (e: any) {
        return next(Error(e));
      }

      res.json(await api.user_verify_kyc(auth_header, req.body));
    } catch (e) {
      next(e);
    }
  });
}
