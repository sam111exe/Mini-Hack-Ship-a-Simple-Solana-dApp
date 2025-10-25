import * as nanostores from "nanostores";
import { API } from "@/codegen";
import type { UserKycRequestResolved } from "@/codegen";
import { api } from "@/api";

export type AdminKycState = {
  kyc_requests: UserKycRequestResolved[];
  loading: boolean;
  approving_uuid: string | null;
  rejecting_uuid: string | null;
  errors: string[];
  success_message: string | null;
};

const state = nanostores.map<AdminKycState>({
  kyc_requests: [],
  loading: false,
  approving_uuid: null,
  rejecting_uuid: null,
  errors: [],
  success_message: null,
});

export class AdminKycCubit {
  static state = state;
  static api: API = api;

  // Initialize and load pending KYC requests
  static async init() {
    await this.load_kyc_requests();
  }

  // READ - Load all pending KYC requests
  static async load_kyc_requests() {
    try {
      state.setKey("loading", true);
      this.clear_messages();

      const kyc_requests = await this.api.admin_get_kyc_requests();
      state.setKey("kyc_requests", kyc_requests);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load KYC requests");
    } finally {
      state.setKey("loading", false);
    }
  }

  // UPDATE - Approve a KYC request
  static async approve_kyc_request(user_uuid: string): Promise<boolean> {
    try {
      state.setKey("approving_uuid", user_uuid);
      this.clear_messages();

      const approved_request = await this.api.admin_approve_kyc_request(user_uuid);
      
      // Update the request in the local state
      const current_requests = state.get().kyc_requests;
      const updated_requests = current_requests.map(request => 
        request.user_uuid === user_uuid ? approved_request : request
      );
      
      state.setKey("kyc_requests", updated_requests);
      this.set_success_message("KYC request approved successfully");
      
      return true;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to approve KYC request");
      return false;
    } finally {
      state.setKey("approving_uuid", null);
    }
  }

  // UPDATE - Reject a KYC request
  static async reject_kyc_request(user_uuid: string): Promise<boolean> {
    try {
      state.setKey("rejecting_uuid", user_uuid);
      this.clear_messages();

      const rejected_request = await this.api.admin_reject_kyc_request(user_uuid);
      
      // Update the request in the local state
      const current_requests = state.get().kyc_requests;
      const updated_requests = current_requests.map(request => 
        request.user_uuid === user_uuid ? rejected_request : request
      );
      
      state.setKey("kyc_requests", updated_requests);
      this.set_success_message("KYC request rejected successfully");
      
      return true;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to reject KYC request");
      return false;
    } finally {
      state.setKey("rejecting_uuid", null);
    }
  }

  // Helper methods for filtering and data access
  static get_pending_requests(): UserKycRequestResolved[] {
    const requests = state.get().kyc_requests;
    return requests.filter(request => 
      !request.approved_by_admin && !request.rejected_by_admin
    );
  }

  static get_approved_requests(): UserKycRequestResolved[] {
    const requests = state.get().kyc_requests;
    return requests.filter(request => request.approved_by_admin);
  }

  static get_rejected_requests(): UserKycRequestResolved[] {
    const requests = state.get().kyc_requests;
    return requests.filter(request => request.rejected_by_admin);
  }

  static get_request_by_user_uuid(user_uuid: string): UserKycRequestResolved | null {
    const requests = state.get().kyc_requests;
    return requests.find(request => request.user_uuid === user_uuid) || null;
  }

  static get_pending_count(): number {
    return this.get_pending_requests().length;
  }

  static is_processing_request(user_uuid: string): boolean {
    const { approving_uuid, rejecting_uuid } = state.get();
    return approving_uuid === user_uuid || rejecting_uuid === user_uuid;
  }

  // Validation helpers
  static validate_kyc_request(request: UserKycRequestResolved): string[] {
    const validation_issues: string[] = [];

    if (!request.name || request.name.trim().length < 2) {
      validation_issues.push("Name is too short");
    }

    if (!request.surname || request.surname.trim().length < 2) {
      validation_issues.push("Surname is too short");
    }

    if (!request.iin || request.iin.length !== 12) {
      validation_issues.push("IIN must be 12 digits");
    }

    if (!request.document_front_url) {
      validation_issues.push("Front document image is missing");
    }

    if (!request.selfie_url) {
      validation_issues.push("Selfie image is missing");
    }

    return validation_issues;
  }

  static has_validation_issues(request: UserKycRequestResolved): boolean {
    return this.validate_kyc_request(request).length > 0;
  }

  // Message and error management
  static add_error(error: string) {
    state.setKey("errors", [...state.get().errors, error]);
  }

  static clear_errors() {
    state.setKey("errors", []);
  }

  static set_success_message(message: string) {
    state.setKey("success_message", message);
  }

  static clear_success_message() {
    state.setKey("success_message", null);
  }

  static clear_messages() {
    this.clear_errors();
    this.clear_success_message();
  }

  // State management
  static reset() {
    state.set({
      kyc_requests: [],
      loading: false,
      approving_uuid: null,
      rejecting_uuid: null,
      errors: [],
      success_message: null,
    });
  }

  // Refresh data
  static async refresh() {
    await this.load_kyc_requests();
  }
}