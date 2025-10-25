// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const UploadRawSchemaObj = {
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  hash: { type: String, required: true },
  meta: { type: {}, required: true },
  date: { type: Number, required: true },
  owner_uuid: { type: String, required: true },
  url: { type: String, required: true },
  path: { type: String, required: true },
};

export const UploadRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const UploadRawSchema = new mongoose.Schema(UploadRawSchemaObj, UploadRawSchemaOptions);

//=========================== MODEL ===========================

export type UploadRawDoc = mongoose.Document<unknown, any, T.UploadRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const UploadRawModel = mongoose.model<T.UploadRaw>("upload_raw", UploadRawSchema);
