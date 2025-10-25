// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const RealAssetStatusSchemaObj = {
  type: mongoose.Schema.Types.Mixed,
  required: true,
  default: { type: "DRAFT" },
  enum: [
    "DRAFT",
    "PENDING_APPROVAL_BY_GOV",
    "APPROVED_BY_GOV",
    "TOKENIZATION_IN_PROGRESS",
    "BLOCKCHAIN_ERROR",
    "ACTIVE",
    "STAKED",
    "ARCHIVED",
    "REJECTED_BY_GOV",
    "SOLD",
  ],
};
