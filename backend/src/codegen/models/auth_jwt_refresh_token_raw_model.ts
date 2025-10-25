// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const AuthJwtRefreshTokenRawSchemaObj = {
  uuid: { type: String, required: true },
  user_uuid: { type: String, required: true },
  token: { type: String, required: true },
};

export const AuthJwtRefreshTokenRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const AuthJwtRefreshTokenRawSchema = new mongoose.Schema(
  AuthJwtRefreshTokenRawSchemaObj,
  AuthJwtRefreshTokenRawSchemaOptions,
);

//=========================== MODEL ===========================

export type AuthJwtRefreshTokenRawDoc = mongoose.Document<unknown, any, T.AuthJwtRefreshTokenRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const AuthJwtRefreshTokenRawModel = mongoose.model<T.AuthJwtRefreshTokenRaw>(
  "auth_jwt_refresh_token_raw",
  AuthJwtRefreshTokenRawSchema,
);
