// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ============================================================
// TypeScript Mongoose Model

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const UserRolesSchemaObj = {
  type: mongoose.Schema.Types.Mixed,
  required: true,
  default: { type: "ADMIN" },
  enum: ["ADMIN", "GOV", "ORACLE"],
};
