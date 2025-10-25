import * as nanostores from "nanostores";
import { API } from "@/codegen";
import {
  type CryptoAssetResolved,
  type CryptoAssetPublic,
} from "@/codegen";
import { api } from "@/api";

export type UserCryptoAssetsState = {
  assets: CryptoAssetResolved[];
  selected_asset: CryptoAssetResolved | null;
  loading: boolean;
  submitting: boolean;
  errors: string[];
  filter: {
    search_text?: string;
    real_asset_uuid?: string;
    owner_address?: string;
  };
};

const state = nanostores.map<UserCryptoAssetsState>({
  assets: [],
  selected_asset: null,
  loading: false,
  submitting: false,
  errors: [],
  filter: {},
});

export class UserCryptoAssetsCubit {
  static state = state;
  static api: API = api;

  static async init() {
    await this.load_assets();
  }

  static async load_assets() {
    try {
      state.setKey("loading", true);
      this.clear_errors();

      const assets = await this.api.user_get_crypto_asset_list();
      state.setKey("assets", assets);
    } catch (error: any) {
      this.add_error(error.response?.data?.message || "Failed to load crypto assets");
    } finally {
      state.setKey("loading", false);
    }
  }

  static select_asset(asset: CryptoAssetResolved | null) {
    state.setKey("selected_asset", asset);
  }

  static get_asset_by_id(asset_uuid: string): CryptoAssetResolved | undefined {
    return state.get().assets.find((asset) => asset.uuid === asset_uuid);
  }

  static get_asset_by_mint_address(mint_address: string): CryptoAssetResolved | undefined {
    return state.get().assets.find((asset) => asset.mint_address === mint_address);
  }

  static get_assets_by_real_asset(real_asset_uuid: string): CryptoAssetResolved[] {
    return state.get().assets.filter((asset) => asset.real_asset_uuid === real_asset_uuid);
  }

  static set_filter(filter: UserCryptoAssetsState["filter"]) {
    state.setKey("filter", filter);
  }

  static get_filtered_assets(): CryptoAssetResolved[] {
    const { assets, filter } = state.get();

    return assets.filter((asset) => {
      if (filter.real_asset_uuid && asset.real_asset_uuid !== filter.real_asset_uuid) return false;
      if (filter.owner_address && asset.owner_address !== filter.owner_address) return false;
      if (filter.search_text) {
        const search_lower = filter.search_text.toLowerCase();
        return (
          asset.name.toLowerCase().includes(search_lower) || 
          asset.symbol.toLowerCase().includes(search_lower) ||
          asset.mint_address.toLowerCase().includes(search_lower)
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

  static get_total_assets_count(): number {
    return state.get().assets.length;
  }

  static get_assets_grouped_by_real_asset(): Map<string, CryptoAssetResolved[]> {
    const grouped = new Map<string, CryptoAssetResolved[]>();
    
    state.get().assets.forEach((asset) => {
      const existing = grouped.get(asset.real_asset_uuid) || [];
      grouped.set(asset.real_asset_uuid, [...existing, asset]);
    });
    
    return grouped;
  }

  static get_unique_real_asset_uuids(): string[] {
    return Array.from(new Set(state.get().assets.map((asset) => asset.real_asset_uuid)));
  }
}