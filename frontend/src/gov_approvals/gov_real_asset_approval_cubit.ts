import * as nanostores from "nanostores";
import { API } from "@/codegen";
import type { RealAssetResolved, RealAssetApprovalPublic } from "@/codegen";
import { RealAssetStatus } from "@/codegen";
import { api } from "@/api";

export type GovRealAssetApprovalState = {
  real_assets: RealAssetResolved[];
  loading: boolean;
  approving_uuid: string | null;
  rejecting_uuid: string | null;
  errors: string[];
  success_message: string | null;
};

const state = nanostores.map<GovRealAssetApprovalState>({
  real_assets: [],
  loading: false,
  approving_uuid: null,
  rejecting_uuid: null,
  errors: [],
  success_message: null,
});

export class GovRealAssetApprovalCubit {
  static state = state;
  static api: API = api;

  // Initialize and load pending real asset approvals
  static async init() {
    await this.load_real_asset_approval_list();
  }

  // READ - Load all real assets pending approval
  static async load_real_asset_approval_list() {
    try {
      state.setKey("loading", true);
      this.clear_messages();

      const real_assets = await this.api.gov_get_real_asset_approval_list();
      state.setKey("real_assets", real_assets);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load real asset approval list");
    } finally {
      state.setKey("loading", false);
    }
  }

  // UPDATE - Approve a real asset
  static async approve_real_asset(real_asset_uuid: string, approval_data: RealAssetApprovalPublic): Promise<boolean> {
    try {
      state.setKey("approving_uuid", real_asset_uuid);
      this.clear_messages();

      const approved_asset = await this.api.gov_approve_real_asset_by_uuid(real_asset_uuid, approval_data);
      
      // Update the asset in the local state
      const current_assets = state.get().real_assets;
      const updated_assets = current_assets.map(asset => 
        asset.uuid === real_asset_uuid ? approved_asset : asset
      );
      
      state.setKey("real_assets", updated_assets);
      this.set_success_message("Real asset approved successfully");
      
      return true;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to approve real asset");
      return false;
    } finally {
      state.setKey("approving_uuid", null);
    }
  }

  // UPDATE - Reject a real asset
  static async reject_real_asset(real_asset_uuid: string, rejection_data: RealAssetApprovalPublic): Promise<boolean> {
    try {
      state.setKey("rejecting_uuid", real_asset_uuid);
      this.clear_messages();

      const rejected_asset = await this.api.gov_reject_real_asset_by_uuid(real_asset_uuid, rejection_data);
      
      // Update the asset in the local state
      const current_assets = state.get().real_assets;
      const updated_assets = current_assets.map(asset => 
        asset.uuid === real_asset_uuid ? rejected_asset : asset
      );
      
      state.setKey("real_assets", updated_assets);
      this.set_success_message("Real asset rejected successfully");
      
      return true;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to reject real asset");
      return false;
    } finally {
      state.setKey("rejecting_uuid", null);
    }
  }

  // Helper methods for filtering and data access
  static get_pending_assets(): RealAssetResolved[] {
    const assets = state.get().real_assets;
    return assets.filter(asset => 
      asset.status === RealAssetStatus.PendingApprovalByGov
    );
  }

  static get_approved_assets(): RealAssetResolved[] {
    const assets = state.get().real_assets;
    return assets.filter(asset => asset.status === RealAssetStatus.ApprovedByGov);
  }

  static get_rejected_assets(): RealAssetResolved[] {
    const assets = state.get().real_assets;
    return assets.filter(asset => asset.status === RealAssetStatus.RejectedByGov);
  }

  static get_asset_by_uuid(asset_uuid: string): RealAssetResolved | null {
    const assets = state.get().real_assets;
    return assets.find(asset => asset.uuid === asset_uuid) || null;
  }

  static get_pending_count(): number {
    return this.get_pending_assets().length;
  }

  static is_processing_asset(asset_uuid: string): boolean {
    const { approving_uuid, rejecting_uuid } = state.get();
    return approving_uuid === asset_uuid || rejecting_uuid === asset_uuid;
  }

  // Validation helpers
  static validate_real_asset(asset: RealAssetResolved): string[] {
    const validation_issues: string[] = [];

    if (!asset.name || asset.name.trim().length < 3) {
      validation_issues.push("Name is too short (minimum 3 characters)");
    }

    if (!asset.description || asset.description.trim().length < 10) {
      validation_issues.push("Description is too short (minimum 10 characters)");
    }

    // Price validation would need to be implemented based on parameters
    // as RealAssetResolved doesn't have a direct price field

    if (!asset.location || !asset.location.lat || !asset.location.lng) {
      validation_issues.push("Valid location coordinates are required");
    }

    if (!asset.asset_type) {
      validation_issues.push("Asset type is required");
    }

    if (!asset.photo_list || asset.photo_list.length === 0) {
      validation_issues.push("At least one photo is required");
    }

    return validation_issues;
  }

  static has_validation_issues(asset: RealAssetResolved): boolean {
    return this.validate_real_asset(asset).length > 0;
  }

  // Search and filter helpers
  static search_assets(search_term: string): RealAssetResolved[] {
    if (!search_term.trim()) {
      return state.get().real_assets;
    }

    const assets = state.get().real_assets;
    const term = search_term.toLowerCase();
    
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(term) ||
      (asset.description && asset.description.toLowerCase().includes(term)) ||
      asset.owner_uuid.toLowerCase().includes(term)
    );
  }

  static filter_by_type(asset_type: string): RealAssetResolved[] {
    const assets = state.get().real_assets;
    return assets.filter(asset => asset.asset_type === asset_type);
  }

  static filter_by_price_range(min_price: number, max_price: number): RealAssetResolved[] {
    const assets = state.get().real_assets;
    return assets.filter(asset => 
      asset.price >= min_price && asset.price <= max_price
    );
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
      real_assets: [],
      loading: false,
      approving_uuid: null,
      rejecting_uuid: null,
      errors: [],
      success_message: null,
    });
  }

  // Refresh data
  static async refresh() {
    await this.load_real_asset_approval_list();
  }
}