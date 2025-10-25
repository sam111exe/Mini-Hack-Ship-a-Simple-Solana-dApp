// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const RealAssetApprovalRawSchemaObj = {
  uuid: { type: String, required: true },
  real_asset_uuid: { type: String, required: true },
  approver_uuid: { type: String, required: true },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true },
  comment: { type: String, required: false },
};

export const RealAssetApprovalRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const RealAssetApprovalRawSchema = new mongoose.Schema(
  RealAssetApprovalRawSchemaObj,
  RealAssetApprovalRawSchemaOptions,
);

//=========================== MODEL ===========================

export type RealAssetApprovalRawDoc = mongoose.Document<unknown, any, T.RealAssetApprovalRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const RealAssetApprovalRawModel = mongoose.model<T.RealAssetApprovalRaw>(
  "real_asset_approval_raw",
  RealAssetApprovalRawSchema,
);
