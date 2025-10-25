// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const AuthUserRawSchemaObj = {
  uuid: { type: String, required: true },
  roles: { type: [String], required: true },
  date_created: { type: Number, required: true },
  date_last_login: { type: Number, required: true },
};

export const AuthUserRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const AuthUserRawSchema = new mongoose.Schema(AuthUserRawSchemaObj, AuthUserRawSchemaOptions);

//=========================== MODEL ===========================

export type AuthUserRawDoc = mongoose.Document<unknown, any, T.AuthUserRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const AuthUserRawModel = mongoose.model<T.AuthUserRaw>("auth_user_raw", AuthUserRawSchema);
