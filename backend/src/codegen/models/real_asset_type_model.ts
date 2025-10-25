// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const RealAssetTypeSchemaObj = {
  type: mongoose.Schema.Types.Mixed,
  required: true,
  default: { type: "APARTMENT" },
  enum: ["APARTMENT", "HOUSE", "GARAGE", "PARKING", "LAND", "COMMERCIAL", "BUSINESS", "INDUSTRIAL"],
};
