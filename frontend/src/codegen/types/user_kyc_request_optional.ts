// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2025 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import * as T from ".";
// ===============================================================
export type UserKycRequestOptional = {
  uuid?: string; // Unique identifier for the profile
  user_uuid?: string; // Unique identifier for the user associated with the profile
  name?: string; // Name of the profile
  surname?: string; // Surname of the profile
  patronym?: string; // Patronymic of the profile
  iin?: string; // Patronymic of the profile
  document_front_url?: string; // URL of the front side of the identity document
  document_back_url?: string; // URL of the back side of the identity document
  selfie_url?: string; // URL of the selfie with the identity document
  approved_by_admin?: boolean; // KYC approval status by admin
  rejected_by_admin?: boolean; // KYC approval status by admin
};
