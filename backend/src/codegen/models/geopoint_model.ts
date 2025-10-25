// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const GeopointSchemaObj = {
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
};

export const GeopointSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const GeopointSchema = new mongoose.Schema(GeopointSchemaObj, GeopointSchemaOptions);

//=========================== MODEL ===========================

export type GeopointDoc = mongoose.Document<unknown, any, T.Geopoint> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const GeopointModel = mongoose.model<T.Geopoint>("geopoint", GeopointSchema);
