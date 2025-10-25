// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const RealAssetRawSchemaObj = {
  uuid: { type: String, required: true },
  owner_uuid: { type: String, required: true },
  photo_list: { type: [String], required: true },
  is_tokenized: { type: Boolean, required: true, default: false },
  is_approved_by_gov: { type: Boolean, required: true, default: false },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true },
  status: M.RealAssetStatusSchemaObj,
  name: { type: String, required: true },
  description: { type: String, required: false },
  asset_type: M.RealAssetTypeSchemaObj,
  parameters: { type: [mongoose.Schema.Types.Mixed], required: true },
  location: M.GeopointSchemaObj,
  gov_comment: { type: String, required: false },
};

export const RealAssetRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const RealAssetRawSchema = new mongoose.Schema(RealAssetRawSchemaObj, RealAssetRawSchemaOptions);

//=========================== MODEL ===========================

export type RealAssetRawDoc = mongoose.Document<unknown, any, T.RealAssetRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const RealAssetRawModel = mongoose.model<T.RealAssetRaw>("real_asset_raw", RealAssetRawSchema);
