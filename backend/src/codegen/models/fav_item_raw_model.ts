// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const FavItemRawSchemaObj = {
  uuid: { type: String, required: true },
  user_uuid: { type: String, required: true },
  real_asset_uuid: { type: String, required: true },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true },
};

export const FavItemRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const FavItemRawSchema = new mongoose.Schema(FavItemRawSchemaObj, FavItemRawSchemaOptions);

//=========================== MODEL ===========================

export type FavItemRawDoc = mongoose.Document<unknown, any, T.FavItemRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const FavItemRawModel = mongoose.model<T.FavItemRaw>("fav_item_raw", FavItemRawSchema);
