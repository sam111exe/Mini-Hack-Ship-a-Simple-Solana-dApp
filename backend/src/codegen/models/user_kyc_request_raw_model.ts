// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const UserKycRequestRawSchemaObj = {
  uuid: { type: String, required: true },
  user_uuid: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  patronym: { type: String, required: false },
  iin: { type: String, required: true },
  document_front_url: { type: String, required: true },
  document_back_url: { type: String, required: false },
  selfie_url: { type: String, required: true },
  approved_by_admin: { type: Boolean, required: true, default: false },
  rejected_by_admin: { type: Boolean, required: true, default: false },
};

export const UserKycRequestRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const UserKycRequestRawSchema = new mongoose.Schema(
  UserKycRequestRawSchemaObj,
  UserKycRequestRawSchemaOptions,
);

//=========================== MODEL ===========================

export type UserKycRequestRawDoc = mongoose.Document<unknown, any, T.UserKycRequestRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const UserKycRequestRawModel = mongoose.model<T.UserKycRequestRaw>(
  "user_kyc_request_raw",
  UserKycRequestRawSchema,
);
