import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { UserFavCubit } from "./user_fav_cubit";
import { FavHeader } from "./fav_header";
import { FavSearchBar } from "./fav_search_bar";
import { FavAssetsList } from "./fav_assets_list";

export function FavSection() {
  const { fav_real_assets, loading, submitting, errors, filter } = useStore(UserFavCubit.state);

  useEffect(() => {
    UserFavCubit.init();
  }, []);

  const filtered_assets = UserFavCubit.get_filtered_fav_assets();

  const handle_filter_change = (new_filter: typeof filter) => {
    UserFavCubit.set_filter(new_filter);
  };

  const handle_clear_filter = () => {
    UserFavCubit.clear_filter();
  };

  const handle_remove_favorite = async (asset_uuid: string) => {
    await UserFavCubit.remove_fav_asset(asset_uuid);
  };

  const get_empty_state_message = () => {
    if (filter.search_text) {
      return `No favorites found matching "${filter.search_text}"`;
    }
    return "No favorite assets found";
  };

  return (
    <div className="space-y-6 p-6 h-full">
      <FavHeader fav_count={fav_real_assets.length} />

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 grow">
          <div className="flex items-start gap-3">
            <i className="bx bx-error-circle text-red-500 text-lg mt-0.5"></i>
            <div className="flex-1">
              <h4 className="text-red-800 font-medium mb-1">Error</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => UserFavCubit.clear_errors()}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <i className="bx bx-x text-lg"></i>
            </button>
          </div>
        </div>
      )}

      {fav_real_assets.length > 0 && (
        <FavSearchBar
          filter={filter}
          on_filter_change={handle_filter_change}
          on_clear_filter={handle_clear_filter}
        />
      )}

      <FavAssetsList
        assets={filtered_assets}
        loading={loading}
        submitting={submitting}
        on_remove_favorite={handle_remove_favorite}
        empty_state_message={get_empty_state_message()}
      />
    </div>
  );
}
