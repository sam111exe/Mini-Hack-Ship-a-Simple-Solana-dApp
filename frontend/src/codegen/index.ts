// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// =============================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Client API File
// =============================================================================================
import * as T from "./types";
export * from "./types";
import type { AxiosInstance } from "axios";

export class API {
  axios_client: AxiosInstance;
  sub_path: string;

  constructor(axios_client: AxiosInstance, sub_path = "") {
    this.sub_path = sub_path;
    this.axios_client = axios_client;
  }

  async admin_approve_kyc_request(user_uuid: string): Promise<T.UserKycRequestResolved> {
    let resp = await this.axios_client.post<T.UserKycRequestResolved>(
      `${this.sub_path}/admin/user/profile/approve-kyc-request/${user_uuid}`,
    );
    return resp.data;
  }
  async admin_get_all_real_asset_list(): Promise<T.RealAssetResolved[]> {
    let resp = await this.axios_client.post<T.RealAssetResolved[]>(
      `${this.sub_path}/admin/asset/get-all-real-asset-list`,
    );
    return resp.data;
  }
  async admin_get_kyc_requests(): Promise<T.UserKycRequestResolved[]> {
    let resp = await this.axios_client.post<T.UserKycRequestResolved[]>(
      `${this.sub_path}/admin/user/profile/get-kyc-requests`,
    );
    return resp.data;
  }
  async admin_reject_kyc_request(user_uuid: string): Promise<T.UserKycRequestResolved> {
    let resp = await this.axios_client.post<T.UserKycRequestResolved>(
      `${this.sub_path}/admin/user/profile/reject-kyc-request/${user_uuid}`,
    );
    return resp.data;
  }
  async auth_check(): Promise<T.AuthClaims> {
    let resp = await this.axios_client.get<T.AuthClaims>(`${this.sub_path}/auth/check`);
    return resp.data;
  }
  async auth_google_sign_in(body: T.AuthGoogleSignInReq): Promise<T.AuthJwtBundle> {
    let resp = await this.axios_client.post<T.AuthJwtBundle>(`${this.sub_path}/auth/google/sign-in`, body);
    return resp.data;
  }
  async auth_google_sign_up(body: T.AuthGoogleSignUpReq): Promise<void> {
    let resp = await this.axios_client.post<void>(`${this.sub_path}/auth/google/google-sign-up`, body);
    return resp.data;
  }
  async auth_google_sign_up_sert(body: T.AuthGoogleSignUpSertReq): Promise<T.AuthJwtBundle> {
    let resp = await this.axios_client.post<T.AuthJwtBundle>(
      `${this.sub_path}/auth/google/google-sign-up-sert`,
      body,
    );
    return resp.data;
  }
  async auth_jwt_refresh(body: T.AuthJwtRefreshReq): Promise<T.AuthJwtBundle> {
    let resp = await this.axios_client.post<T.AuthJwtBundle>(`${this.sub_path}/auth/jwt-refresh`, body);
    return resp.data;
  }
  async auth_sign_out(): Promise<void> {
    let resp = await this.axios_client.post<void>(`${this.sub_path}/auth/sign-out`);
    return resp.data;
  }
  async dev_sign_in(username: string): Promise<T.AuthJwtBundle> {
    let resp = await this.axios_client.post<T.AuthJwtBundle>(`${this.sub_path}/dev/auth/sign-in/${username}`);
    return resp.data;
  }
  async gov_approve_real_asset_by_uuid(
    real_asset_uuid: string,
    body: T.RealAssetApprovalPublic,
  ): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/gov/asset/approve-real-asset/${real_asset_uuid}`,
      body,
    );
    return resp.data;
  }
  async gov_get_real_asset_approval_list(): Promise<T.RealAssetResolved[]> {
    let resp = await this.axios_client.post<T.RealAssetResolved[]>(
      `${this.sub_path}/gov/asset/get-real-asset-approval-list`,
    );
    return resp.data;
  }
  async gov_reject_real_asset_by_uuid(
    real_asset_uuid: string,
    body: T.RealAssetApprovalPublic,
  ): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/gov/asset/reject-real-asset/${real_asset_uuid}`,
      body,
    );
    return resp.data;
  }
  async upload(body: T.UploadRequest): Promise<T.UploadResponse> {
    let resp = await this.axios_client.post<T.UploadResponse>(`${this.sub_path}/upload`, body);
    return resp.data;
  }
  async user_add_fav_item(real_asset_uuid: string): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/user/fav/add-fav-item/${real_asset_uuid}`,
    );
    return resp.data;
  }
  async user_archive_real_asset_by_uuid(real_asset_uuid: string): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/user/asset/archive-real-asset/${real_asset_uuid}`,
    );
    return resp.data;
  }
  async user_create_real_asset(body: T.RealAssetPublic): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/user/asset/create-real-asset`,
      body,
    );
    return resp.data;
  }
  async user_explore_real_asset_list(body: T.ExploreFilter): Promise<T.RealAssetResolved[]> {
    let resp = await this.axios_client.post<T.RealAssetResolved[]>(
      `${this.sub_path}/explore-assets/real-asset-list`,
      body,
    );
    return resp.data;
  }
  async user_get_crypto_asset_list(): Promise<T.CryptoAssetResolved[]> {
    let resp = await this.axios_client.post<T.CryptoAssetResolved[]>(
      `${this.sub_path}/user/asset/get-crypto-asset-list`,
    );
    return resp.data;
  }
  async user_get_fav_real_asset_list(): Promise<T.RealAssetResolved[]> {
    let resp = await this.axios_client.post<T.RealAssetResolved[]>(`${this.sub_path}/user/fav/fav-real-asset-list`);
    return resp.data;
  }
  async user_get_frontend_bundle(): Promise<T.UserFrontendBundle> {
    let resp = await this.axios_client.get<T.UserFrontendBundle>(`${this.sub_path}/user/frontend-bundle/get`);
    return resp.data;
  }
  async user_get_profile(): Promise<T.UserProfileResolved> {
    let resp = await this.axios_client.get<T.UserProfileResolved>(`${this.sub_path}/user/profile/get-user-profile`);
    return resp.data;
  }
  async user_get_real_asset_list(): Promise<T.RealAssetResolved[]> {
    let resp = await this.axios_client.post<T.RealAssetResolved[]>(
      `${this.sub_path}/user/asset/get-real-asset-list`,
    );
    return resp.data;
  }
  async user_remove_fav_item(real_asset_uuid: string): Promise<void> {
    let resp = await this.axios_client.post<void>(`${this.sub_path}/user/fav/remove-fav-item/${real_asset_uuid}`);
    return resp.data;
  }
  async user_submit_real_asset_for_approval(real_asset_uuid: string): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/user/asset/submit-real-asset-for-approval/${real_asset_uuid}`,
    );
    return resp.data;
  }
  async user_tokenize_real_asset(
    real_asset_uuid: string,
    body: T.RealAssetTokenizationPayload,
  ): Promise<T.RealAssetTokenizationResponse> {
    let resp = await this.axios_client.post<T.RealAssetTokenizationResponse>(
      `${this.sub_path}/user/asset/tokenize-real-asset/${real_asset_uuid}`,
      body,
    );
    return resp.data;
  }
  async user_tokenize_real_asset_confirm(
    real_asset_uuid: string,
    body: T.SignedTransactionPayload,
  ): Promise<T.TokenizationResult> {
    let resp = await this.axios_client.post<T.TokenizationResult>(
      `${this.sub_path}/user/asset/tokenize-real-asset-confirm/${real_asset_uuid}`,
      body,
    );
    return resp.data;
  }
  async user_update_profile(body: T.UserProfilePublic): Promise<T.UserProfileResolved> {
    let resp = await this.axios_client.post<T.UserProfileResolved>(
      `${this.sub_path}/user/profile/update-user-profile`,
      body,
    );
    return resp.data;
  }
  async user_update_real_asset_by_uuid(
    real_asset_uuid: string,
    body: T.RealAssetPublic,
  ): Promise<T.RealAssetResolved> {
    let resp = await this.axios_client.post<T.RealAssetResolved>(
      `${this.sub_path}/user/asset/update-real-asset/${real_asset_uuid}`,
      body,
    );
    return resp.data;
  }
  async user_verify_kyc(body: T.UserKycRequestPublic): Promise<T.UserProfileResolved> {
    let resp = await this.axios_client.post<T.UserProfileResolved>(`${this.sub_path}/user/profile/verify-kyc`, body);
    return resp.data;
  }
}
