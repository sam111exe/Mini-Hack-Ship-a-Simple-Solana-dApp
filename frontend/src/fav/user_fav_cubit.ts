import * as nanostores from "nanostores";
import { API } from "@/codegen";
import type { RealAssetResolved, UserFrontendBundle } from "@/codegen";
import { api } from "@/api";

export type UserFavState = {
  fav_real_assets: RealAssetResolved[];
  loading: boolean;
  submitting: boolean;
  errors: string[];
  filter: {
    search_text?: string;
  };
};

const state = nanostores.map<UserFavState>({
  fav_real_assets: [],
  loading: false,
  submitting: false,
  errors: [],
  filter: {},
});

export class UserFavCubit {
  static state = state;
  static api: API = api;

  // Initialize and load user's favorite real assets
  static async init() {
    await this.load_fav_assets();
  }

  // CREATE - Add a real asset to favorites
  static async add_fav_asset(real_asset_uuid: string): Promise<RealAssetResolved | null> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      const added_asset = await this.api.user_add_fav_item(real_asset_uuid);

      // Add the new favorite asset to the list if not already present
      const current_assets = state.get().fav_real_assets;
      const asset_exists = current_assets.some((asset) => asset.uuid === real_asset_uuid);

      if (!asset_exists) {
        state.setKey("fav_real_assets", [added_asset, ...current_assets]);
      }

      return added_asset;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to add asset to favorites");
      return null;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // READ - Load all favorite real assets
  static async load_fav_assets() {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const fav_assets = await this.api.user_get_fav_real_asset_list();
      state.setKey("fav_real_assets", fav_assets);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load favorite assets");
    } finally {
      state.setKey("loading", false);
    }
  }

  // READ - Load frontend bundle (includes favorites along with other data)
  static async load_frontend_bundle(): Promise<UserFrontendBundle | null> {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const bundle = await this.api.user_get_frontend_bundle();

      // Update favorites from bundle
      state.setKey("fav_real_assets", bundle.fav_item_list);

      return bundle;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load frontend bundle");
      return null;
    } finally {
      state.setKey("loading", false);
    }
  }

  // DELETE - Remove a real asset from favorites
  static async remove_fav_asset(real_asset_uuid: string): Promise<boolean> {
    try {
      state.setKey("submitting", true);
      this.clear_errors();

      await this.api.user_remove_fav_item(real_asset_uuid);

      // Remove the asset from the favorites list
      const updated_assets = state.get().fav_real_assets.filter((asset) => asset.uuid !== real_asset_uuid);
      state.setKey("fav_real_assets", updated_assets);

      return true;
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to remove asset from favorites");
      return false;
    } finally {
      state.setKey("submitting", false);
    }
  }

  // Helper methods
  static is_asset_favorite(real_asset_uuid: string): boolean {
    return state.get().fav_real_assets.some((asset) => asset.uuid === real_asset_uuid);
  }

  static get_fav_asset_by_id(real_asset_uuid: string): RealAssetResolved | undefined {
    return state.get().fav_real_assets.find((asset) => asset.uuid === real_asset_uuid);
  }

  static set_filter(filter: UserFavState["filter"]) {
    state.setKey("filter", filter);
  }

  static get_filtered_fav_assets(): RealAssetResolved[] {
    const { fav_real_assets, filter } = state.get();

    if (!filter.search_text) {
      return fav_real_assets;
    }

    const search_lower = filter.search_text.toLowerCase();
    return fav_real_assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(search_lower) || asset.description?.toLowerCase().includes(search_lower),
    );
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
      fav_real_assets: [],
      loading: false,
      submitting: false,
      errors: [],
      filter: {},
    });
  }

  // Get favorite assets count
  static get_fav_assets_count(): number {
    return state.get().fav_real_assets.length;
  }

  // Toggle favorite status (add if not favorite, remove if favorite)
  static async toggle_fav_asset(real_asset_uuid: string): Promise<boolean> {
    if (this.is_asset_favorite(real_asset_uuid)) {
      return await this.remove_fav_asset(real_asset_uuid);
    } else {
      const result = await this.add_fav_asset(real_asset_uuid);
      return result !== null;
    }
  }
}
