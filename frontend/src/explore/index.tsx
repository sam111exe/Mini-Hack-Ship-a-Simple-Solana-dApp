import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { SectionHeader } from "@/components/section_header";
import { AssetCard } from "../my_real_assets/asset_card";
import { ExploreFilters } from "./explore_filters";
import { UserExploreCubit } from "./user_explore_cubit";
import { get_status_badge_variant, get_asset_type_icon } from "../my_real_assets/utils";
import type { ExploreFilter } from "@/codegen";

export const ExploreSection: React.FC = () => {
  const { explore_assets, loading, errors, filter } = useStore(UserExploreCubit.state);

  useEffect(() => {
    UserExploreCubit.init();
  }, []);

  const handle_view_details = (asset_uuid: string) => {
    // For explore section, just show a simple message for now
    console.log("View details for asset:", asset_uuid);
  };

  const handle_filter_change = (new_filter: ExploreFilter) => {
    UserExploreCubit.set_filter(new_filter);
  };

  const handle_apply_filters = async () => {
    await UserExploreCubit.apply_current_filter();
  };

  const handle_clear_filters = async () => {
    await UserExploreCubit.clear_filter();
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 h-full">
        <SectionHeader
          title="Explore Real Assets"
          subtitle="Discover investment opportunities in tokenized real estate"
          icon="bx-search-alt"
          icon_class="text-2xl text-primary"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <i className="bx bx-loader-alt bx-spin text-4xl text-primary mb-4"></i>
            <p className="text-muted-foreground">Loading explore assets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="space-y-6 p-6 h-full">
        <SectionHeader
          title="Explore Real Assets"
          subtitle="Discover investment opportunities in tokenized real estate"
          icon="bx-search-alt"
          icon_class="text-2xl text-primary"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="bx bx-error-circle text-red-500"></i>
            <span className="font-semibold text-red-700">Error loading assets</span>
          </div>
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 text-sm">
              {error}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 h-full">
      <SectionHeader
        title="Explore Real Assets"
        subtitle="Discover investment opportunities in tokenized real estate"
        icon="bx-search-alt"
        icon_class="text-2xl text-primary"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assets Grid */}
        <div className="lg:col-span-3 min-h-screen">
          {explore_assets.length === 0 && !loading ? (
            <div className="text-center py-12">
              <i className="bx bx-search-alt text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                {UserExploreCubit.is_filter_empty() ? "No assets found" : "No assets match your filters"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {UserExploreCubit.is_filter_empty()
                  ? "There are no assets available for exploration at the moment."
                  : "Try adjusting your filters to see more results."}
              </p>
              {!UserExploreCubit.is_filter_empty() && (
                <button onClick={handle_clear_filters} className="text-primary hover:underline text-sm">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {explore_assets.length} asset{explore_assets.length !== 1 ? "s" : ""} found
                  {UserExploreCubit.get_active_filters_count() > 0 &&
                    ` with ${UserExploreCubit.get_active_filters_count()} filter${UserExploreCubit.get_active_filters_count() !== 1 ? "s" : ""} applied`}
                </span>
              </div>

              {/* Asset Cards */}
              {explore_assets.map((asset) => (
                <AssetCard
                  key={asset.uuid}
                  asset={asset}
                  onSubmitForApproval={async () => {}}
                  onTokenize={() => {}}
                  onEdit={() => {}}
                  onArchive={async () => {}}
                  onViewDetails={handle_view_details}
                  submitting={false}
                  getStatusBadgeVariant={get_status_badge_variant}
                  getAssetTypeIcon={get_asset_type_icon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filters Sidebar */}
        <div className="lg:col-span-1 min-w-3xl">
          <ExploreFilters
            filter={filter}
            onFilterChange={handle_filter_change}
            onApplyFilters={handle_apply_filters}
            onClearFilters={handle_clear_filters}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
