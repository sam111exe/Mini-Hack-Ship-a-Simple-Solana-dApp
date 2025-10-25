import * as nanostores from "nanostores";
import { API } from "@/codegen";
import type { 
  UserProfileResolved,
  UserProfilePublic,
  UserKycRequestPublic,
  UserKycRequestResolved 
} from "@/codegen";
import { api } from "@/api";

export type UserProfileState = {
  profile: UserProfileResolved | null;
  kyc_request: UserKycRequestResolved | null;
  loading: boolean;
  submitting: boolean;
  kyc_submitting: boolean;
  errors: string[];
  kyc_errors: string[];
  profile_updated: boolean;
  kyc_submitted: boolean;
};

const state = nanostores.map<UserProfileState>({
  profile: null,
  kyc_request: null,
  loading: false,
  submitting: false,
  kyc_submitting: false,
  errors: [],
  kyc_errors: [],
  profile_updated: false,
  kyc_submitted: false,
});

export class UserProfileCubit {
  static state = state;
  static api: API = api;

  // Initialize and load user profile
  static async init() {
    await this.load_profile();
  }

  // READ - Load user profile
  static async load_profile() {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const profile = await this.api.user_get_profile();
      state.setKey("profile", profile);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load profile");
    } finally {
      state.setKey("loading", false);
    }
  }

  // UPDATE - Update user profile
  static async update_profile(profile_data: UserProfilePublic): Promise<UserProfileResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();
      state.setKey("profile_updated", false);

      const updated_profile = await this.api.user_update_profile(profile_data);
      state.setKey("profile", updated_profile);
      state.setKey("profile_updated", true);

      return updated_profile;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to update profile");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // CREATE - Submit KYC request
  static async submit_kyc_request(kyc_data: UserKycRequestPublic): Promise<UserProfileResolved | null> {
    try {
      state.setKey("kyc_submitting", true);
      this.clear_kyc_errors();
      state.setKey("kyc_submitted", false);

      const updated_profile = await this.api.user_verify_kyc(kyc_data);
      
      // Update profile with potentially updated KYC status
      state.setKey("profile", updated_profile);
      state.setKey("kyc_submitted", true);

      return updated_profile;
    } catch (error: any) {
      this.add_kyc_error(error.response?.data?.message || "Failed to submit KYC request");
      return null;
    } finally {
      state.setKey("kyc_submitting", false);
    }
  }

  // Helper methods for profile form validation
  static validate_profile_data(profile_data: UserProfilePublic): string[] {
    const validation_errors: string[] = [];

    if (profile_data.name && profile_data.name.trim().length < 2) {
      validation_errors.push("Name must be at least 2 characters long");
    }

    if (profile_data.surname && profile_data.surname.trim().length < 2) {
      validation_errors.push("Surname must be at least 2 characters long");
    }

    if (profile_data.iin && profile_data.iin.length !== 12) {
      validation_errors.push("IIN must be exactly 12 digits");
    }

    if (profile_data.bio && profile_data.bio.length > 500) {
      validation_errors.push("Bio must not exceed 500 characters");
    }

    return validation_errors;
  }

  // Helper methods for KYC validation
  static validate_kyc_data(kyc_data: UserKycRequestPublic): string[] {
    const validation_errors: string[] = [];

    if (!kyc_data.name || kyc_data.name.trim().length < 2) {
      validation_errors.push("Name is required and must be at least 2 characters");
    }

    if (!kyc_data.surname || kyc_data.surname.trim().length < 2) {
      validation_errors.push("Surname is required and must be at least 2 characters");
    }

    if (!kyc_data.iin || kyc_data.iin.length !== 12) {
      validation_errors.push("IIN is required and must be exactly 12 digits");
    }

    if (!kyc_data.document_front_url) {
      validation_errors.push("Front side of document is required");
    }

    if (!kyc_data.selfie_url) {
      validation_errors.push("Selfie with document is required");
    }

    return validation_errors;
  }

  // Getters for component convenience
  static is_kyc_verified(): boolean {
    const profile = state.get().profile;
    return profile?.kyc_verified ?? false;
  }

  static get_profile_completion_percentage(): number {
    const profile = state.get().profile;
    if (!profile) return 0;

    const fields = [
      profile.name,
      profile.surname,
      profile.iin,
      profile.bio,
      profile.avatar_url,
    ];

    const completed_fields = fields.filter(field => field && field.trim().length > 0).length;
    return Math.round((completed_fields / fields.length) * 100);
  }

  static has_required_kyc_info(): boolean {
    const profile = state.get().profile;
    if (!profile) return false;

    return !!(profile.name && profile.surname && profile.iin);
  }

  static is_kyc_submitted(): boolean {
    const profile = state.get().profile;
    return profile?.kyc_submitted ?? false;
  }

  // Error management
  static add_error(error: string) {
    state.setKey("errors", [...state.get().errors, error]);
  }

  static clear_errors() {
    state.setKey("errors", []);
  }

  static add_kyc_error(error: string) {
    state.setKey("kyc_errors", [...state.get().kyc_errors, error]);
  }

  static clear_kyc_errors() {
    state.setKey("kyc_errors", []);
  }

  // State management
  static clear_success_flags() {
    state.setKey("profile_updated", false);
    state.setKey("kyc_submitted", false);
  }

  static reset() {
    state.set({
      profile: null,
      kyc_request: null,
      loading: false,
      submitting: false,
      kyc_submitting: false,
      errors: [],
      kyc_errors: [],
      profile_updated: false,
      kyc_submitted: false,
    });
  }
}