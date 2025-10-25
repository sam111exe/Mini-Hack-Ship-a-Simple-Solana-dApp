import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RealAssetStatus, RealAssetType, type RealAssetResolved } from "@/codegen";
import { AssetCard } from "@/sections/my_real_assets/asset_card";
import { AssetDetailsDialog } from "@/sections/my_real_assets/asset_details_dialog";
import { UserFavCubit } from "./user_fav_cubit";

interface FavAssetsListProps {
  assets: RealAssetResolved[];
  loading: boolean;
  submitting: boolean;
  on_remove_favorite: (asset_uuid: string) => Promise<void>;
  empty_state_message?: string;
}

export function FavAssetsList({
  assets,
  loading,
  submitting,
  on_remove_favorite,
  empty_state_message = "No favorite assets found",
}: FavAssetsListProps) {
  const [details_dialog_open, set_details_dialog_open] = useState(false);
  const [selected_asset_for_details, set_selected_asset_for_details] = useState<string | null>(null);
  const get_status_badge_variant = (status: RealAssetStatus) => {
    switch (status) {
      case RealAssetStatus.Draft:
        return "secondary" as const;
      case RealAssetStatus.PendingApprovalByGov:
        return "default" as const;
      case RealAssetStatus.ApprovedByGov:
        return "outline" as const;
      case RealAssetStatus.RejectedByGov:
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const get_asset_type_icon = (type: RealAssetType) => {
    switch (type) {
      case RealAssetType.Apartment:
        return "bx-building-house";
      case RealAssetType.House:
        return "bx-home";
      case RealAssetType.Commercial:
        return "bx-store";
      case RealAssetType.Land:
        return "bx-map";
      case RealAssetType.Business:
        return "bx-briefcase";
      default:
        return "bx-building";
    }
  };

  const handle_remove_favorite = async (asset_uuid: string) => {
    await on_remove_favorite(asset_uuid);
  };

  // No-op handlers for actions not relevant to favorites view
  const handle_submit_for_approval = async (asset_uuid: string) => {
    // Not applicable for favorites view
  };

  const handle_tokenize = (asset_uuid: string) => {
    // Not applicable for favorites view
  };

  const handle_edit = (asset_uuid: string) => {
    // Not applicable for favorites view - could navigate to edit if needed
  };

  const handle_view_details = (asset_uuid: string) => {
    set_selected_asset_for_details(asset_uuid);
    set_details_dialog_open(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-600">
          <i className="bx bx-loader-alt animate-spin text-xl"></i>
          <span>Loading favorites...</span>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i className="bx bx-heart text-3xl text-slate-400"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Favorites Yet</h3>
        <p className="text-slate-600 mb-6 max-w-md">
          {empty_state_message}. Start exploring assets and save the ones you like!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
        {assets.map((asset) => (
          <div key={asset.uuid} className="relative group">
            <AssetCard
              asset={asset}
              onSubmitForApproval={handle_submit_for_approval}
              onTokenize={handle_tokenize}
              onEdit={handle_edit}
              onArchive={handle_remove_favorite}
              onViewDetails={handle_view_details}
              submitting={submitting}
              getStatusBadgeVariant={get_status_badge_variant}
              getAssetTypeIcon={get_asset_type_icon}
              show_dropdown_menu={false}
            />
          </div>
        ))}
      </div>

      <AssetDetailsDialog
        asset={
          selected_asset_for_details ? assets.find((a) => a.uuid === selected_asset_for_details) || null : null
        }
        open={details_dialog_open}
        onOpenChange={(open) => {
          set_details_dialog_open(open);
          if (!open) set_selected_asset_for_details(null);
        }}
      />
    </>
  );
}
