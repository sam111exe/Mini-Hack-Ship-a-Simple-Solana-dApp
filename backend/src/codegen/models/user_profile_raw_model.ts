// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const UserProfileRawSchemaObj = {
  uuid: { type: String, required: true },
  user_uuid: { type: String, required: true },
  name: { type: String, required: false },
  surname: { type: String, required: false },
  patronym: { type: String, required: false },
  iin: { type: String, required: false },
  bio: { type: String, required: false },
  avatar_url: { type: String, required: false },
  kyc_verified: { type: Boolean, required: true, default: false },
  kyc_submitted: { type: Boolean, required: true, default: false },
};

export const UserProfileRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const UserProfileRawSchema = new mongoose.Schema(UserProfileRawSchemaObj, UserProfileRawSchemaOptions);

//=========================== MODEL ===========================

export type UserProfileRawDoc = mongoose.Document<unknown, any, T.UserProfileRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const UserProfileRawModel = mongoose.model<T.UserProfileRaw>("user_profile_raw", UserProfileRawSchema);
