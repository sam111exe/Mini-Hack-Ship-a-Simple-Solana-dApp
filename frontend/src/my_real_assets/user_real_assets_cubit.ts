import * as nanostores from "nanostores";
import { API } from "@/codegen";
import {
  type RealAssetResolved,
  type RealAssetPublic,
  type RealAssetType,
  RealAssetStatus,
  type RealAssetTokenizationPayload,
  type RealAssetTokenizationResponse,
} from "@/codegen";
import { api } from "@/api";

export type UserRealAssetsState = {
  assets: RealAssetResolved[];
  selected_asset: RealAssetResolved | null;
  loading: boolean;
  submitting: boolean;
  errors: string[];
  filter: {
    status?: RealAssetStatus;
    asset_type?: RealAssetType;
    search_text?: string;
    show_archived?: boolean;
  };
};

const state = nanostores.map<UserRealAssetsState>({
  assets: [],
  selected_asset: null,
  loading: false,
  submitting: false,
  errors: [],
  filter: {},
});

export class UserRealAssetsCubit {
  static state = state;
  static api: API = api;

  // Initialize and load user's real assets
  static async init() {
    await this.load_assets();
  }

  // CREATE - Create a new real asset
  static async create_asset(asset_data: RealAssetPublic): Promise<RealAssetResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const new_asset = await this.api.user_create_real_asset(asset_data);

      // Add the new asset to the list
      state.setKey("assets", [new_asset, ...state.get().assets]);

      return new_asset;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to create asset");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // READ - Load all user's real assets
  static async load_assets() {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const assets = await this.api.user_get_real_asset_list();
      state.setKey("assets", assets);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load assets");
    } finally {
      state.setKey("loading", false);
    }
  }

  // UPDATE - Update an existing real asset
  static async update_asset(asset_uuid: string, asset_data: RealAssetPublic): Promise<RealAssetResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const updated_asset = await this.api.user_update_real_asset_by_uuid(asset_uuid, asset_data);

      // Update the asset in the list
      const assets = state.get().assets.map((asset) => (asset.uuid === asset_uuid ? updated_asset : asset));
      state.setKey("assets", assets);

      // Update selected asset if it's the same
      if (state.get().selected_asset?.uuid === asset_uuid) {
        state.setKey("selected_asset", updated_asset);
      }

      return updated_asset;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to update asset");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // ARCHIVE - Archive a real asset
  static async archive_asset(asset_uuid: string): Promise<RealAssetResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const archived_asset = await this.api.user_archive_real_asset_by_uuid(asset_uuid);

      // Update the asset in the list
      const assets = state.get().assets.map((asset) => (asset.uuid === asset_uuid ? archived_asset : asset));
      state.setKey("assets", assets);

      // Update selected asset if it's the same
      if (state.get().selected_asset?.uuid === asset_uuid) {
        state.setKey("selected_asset", archived_asset);
      }

      return archived_asset;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to archive asset");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // Submit asset for government approval
  static async submit_for_approval(asset_uuid: string): Promise<RealAssetResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const updated_asset = await this.api.user_submit_real_asset_for_approval(asset_uuid);

      // Update the asset in the list
      const assets = state.get().assets.map((asset) => (asset.uuid === asset_uuid ? updated_asset : asset));
      state.setKey("assets", assets);

      return updated_asset;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to submit for approval");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // Tokenize a real asset
  static async tokenize_asset(
    asset_uuid: string,
    tokenization_data: RealAssetTokenizationPayload,
  ): Promise<RealAssetTokenizationResponse | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const response = await this.api.user_tokenize_real_asset(asset_uuid, tokenization_data);

      // Reload assets to get updated status
      await this.load_assets();

      return response;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to tokenize asset");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // Helper methods
  static select_asset(asset: RealAssetResolved | null) {
    state.setKey("selected_asset", asset);
  }

  static get_asset_by_id(asset_uuid: string): RealAssetResolved | undefined {
    return state.get().assets.find((asset) => asset.uuid === asset_uuid);
  }

  static set_filter(filter: UserRealAssetsState["filter"]) {
    state.setKey("filter", filter);
  }

  static get_filtered_assets(): RealAssetResolved[] {
    const { assets, filter } = state.get();

    return assets.filter((asset) => {
      // Hide archived assets by default unless show_archived is true
      if (!filter.show_archived && asset.status === RealAssetStatus.Archived) return false;

      if (filter.status && asset.status !== filter.status) return false;
      if (filter.asset_type && asset.asset_type !== filter.asset_type) return false;
      if (filter.search_text) {
        const search_lower = filter.search_text.toLowerCase();
        return (
          asset.name.toLowerCase().includes(search_lower) || asset.description?.toLowerCase().includes(search_lower)
        );
      }
      return true;
    });
  }

  static clear_filter() {
    state.setKey("filter", {});
  }

  static add_error(error: string) {
    state.setKey("errors", [...state.get().errors, error]);
  }

  static clear_errors() {
    state.setKey("errors", []);
  }

  static reset() {
    state.set({
      assets: [],
      selected_asset: null,
      loading: false,
      submitting: false,
      errors: [],
      filter: {},
    });
  }

  // Get assets by status
  static get_assets_by_status(status: RealAssetStatus): RealAssetResolved[] {
    return state.get().assets.filter((asset) => asset.status === status);
  }

  // Get asset counts by status
  static get_asset_counts_by_status(): Record<RealAssetStatus, number> {
    const counts: Partial<Record<RealAssetStatus, number>> = {};

    state.get().assets.forEach((asset) => {
      counts[asset.status] = (counts[asset.status] || 0) + 1;
    });

    return counts as Record<RealAssetStatus, number>;
  }
}
