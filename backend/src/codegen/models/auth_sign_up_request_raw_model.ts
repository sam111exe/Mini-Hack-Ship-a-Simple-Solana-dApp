// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const AuthSignUpRequestRawSchemaObj = {
  uuid: { type: String, required: true },
  provider: { type: String, required: true },
  login: { type: String, required: true },
  code: { type: String, required: true },
  create_date: { type: Number, required: true },
  expire_date: { type: Number, required: true },
};

export const AuthSignUpRequestRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const AuthSignUpRequestRawSchema = new mongoose.Schema(
  AuthSignUpRequestRawSchemaObj,
  AuthSignUpRequestRawSchemaOptions,
);

//=========================== MODEL ===========================

export type AuthSignUpRequestRawDoc = mongoose.Document<unknown, any, T.AuthSignUpRequestRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const AuthSignUpRequestRawModel = mongoose.model<T.AuthSignUpRequestRaw>(
  "auth_sign_up_request_raw",
  AuthSignUpRequestRawSchema,
);
