import * as nanostores from "nanostores";
import { API } from "@/codegen";
import type { RealAssetResolved, ExploreFilter } from "@/codegen";
import { api } from "@/api";

export type UserExploreState = {
  explore_assets: RealAssetResolved[];
  loading: boolean;
  submitting: boolean;
  errors: string[];
  filter: ExploreFilter;
};

const state = nanostores.map<UserExploreState>({
  explore_assets: [],
  loading: false,
  submitting: false,
  errors: [],
  filter: {},
});

export class UserExploreCubit {
  static state = state;
  static api: API = api;

  // Initialize and load explore assets
  static async init() {
    await this.load_explore_assets();
  }

  // Load explore real assets with filter
  static async load_explore_assets(filter?: ExploreFilter) {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const current_filter = filter || state.get().filter;
      const explore_assets = await this.api.user_explore_real_asset_list(current_filter);
      
      state.setKey("explore_assets", explore_assets);
      if (filter) {
        state.setKey("filter", filter);
      }
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load explore assets");
    } finally {
      state.setKey("loading", false);
    }
  }

  // Update filter and reload assets
  static async update_filter(filter: ExploreFilter) {
    state.setKey("filter", filter);
    await this.load_explore_assets(filter);
  }

  // Update filter without reloading (for real-time updates)
  static set_filter(filter: ExploreFilter) {
    state.setKey("filter", filter);
  }

  // Get current filter
  static get_filter(): ExploreFilter {
    return state.get().filter;
  }

  // Clear filter and reload
  static async clear_filter() {
    const empty_filter: ExploreFilter = {};
    state.setKey("filter", empty_filter);
    await this.load_explore_assets(empty_filter);
  }

  // Apply current filter (reload with current filter)
  static async apply_current_filter() {
    await this.load_explore_assets(state.get().filter);
  }

  // Check if filter is empty
  static is_filter_empty(): boolean {
    const filter = state.get().filter;
    return !filter.asset_type_list?.length && 
           !filter.min_price && 
           !filter.max_price && 
           !filter.location_area?.length;
  }

  // Get active filters count
  static get_active_filters_count(): number {
    const filter = state.get().filter;
    let count = 0;
    if (filter.asset_type_list && filter.asset_type_list.length > 0) count++;
    if (filter.min_price !== undefined) count++;
    if (filter.max_price !== undefined) count++;
    if (filter.location_area && filter.location_area.length > 0) count++;
    return count;
  }

  // Get explore assets count
  static get_explore_assets_count(): number {
    return state.get().explore_assets.length;
  }

  // Get asset by ID
  static get_asset_by_id(asset_uuid: string): RealAssetResolved | undefined {
    return state.get().explore_assets.find((asset) => asset.uuid === asset_uuid);
  }

  // Helper methods for error handling
  static add_error(error: string) {
    state.setKey("errors", [...state.get().errors, error]);
  }

  static clear_errors() {
    state.setKey("errors", []);
  }

  static reset() {
    state.set({
      explore_assets: [],
      loading: false,
      submitting: false,
      errors: [],
      filter: {},
    });
  }
}