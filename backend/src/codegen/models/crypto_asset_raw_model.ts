// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const CryptoAssetRawSchemaObj = {
  uuid: { type: String, required: true },
  no: { type: Number, required: true },
  owner_uuid: { type: String, required: true },
  real_asset_uuid: { type: String, required: true },
  owner_address: { type: String, required: true },
  mint_address: { type: String, required: true },
  update_authority_address: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  json_metadata_uri: { type: String, required: true },
  seller_fee_basis_points: { type: Number, required: true },
  creators_address_list: { type: [String], required: true },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true },
};

export const CryptoAssetRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const CryptoAssetRawSchema = new mongoose.Schema(CryptoAssetRawSchemaObj, CryptoAssetRawSchemaOptions);

//=========================== MODEL ===========================

export type CryptoAssetRawDoc = mongoose.Document<unknown, any, T.CryptoAssetRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const CryptoAssetRawModel = mongoose.model<T.CryptoAssetRaw>("crypto_asset_raw", CryptoAssetRawSchema);
