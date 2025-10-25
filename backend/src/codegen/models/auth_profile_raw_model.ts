// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const AuthProfileRawSchemaObj = {
  uuid: { type: String, required: true },
  provider: { type: String, required: true },
  user_uuid: { type: String, required: true },
  login: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed, required: true },
  date_created: { type: Number, required: true },
  date_last_login: { type: Number, required: false, default: null },
};

export const AuthProfileRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const AuthProfileRawSchema = new mongoose.Schema(AuthProfileRawSchemaObj, AuthProfileRawSchemaOptions);

//=========================== MODEL ===========================

export type AuthProfileRawDoc = mongoose.Document<unknown, any, T.AuthProfileRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const AuthProfileRawModel = mongoose.model<T.AuthProfileRaw>("auth_profile_raw", AuthProfileRawSchema);
