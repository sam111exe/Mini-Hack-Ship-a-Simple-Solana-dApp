import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RealAssetStatus, RealAssetType, type RealAssetResolved } from "@/codegen";
import { get_status_label_text } from "./utils";
import { UserFavCubit } from "../fav/user_fav_cubit";
import { UserProfileCubit } from "../user_profile/user_profile_cubit";
import { useStore } from "@nanostores/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

interface AssetCardProps {
  asset: RealAssetResolved;
  onSubmitForApproval: (assetUuid: string) => Promise<void>;
  onTokenize: (assetUuid: string) => void;
  onEdit: (assetUuid: string) => void;
  onArchive: (assetUuid: string) => Promise<void>;
  onViewDetails: (assetUuid: string) => void;
  submitting: boolean;
  getStatusBadgeVariant: (status: RealAssetStatus) => "secondary" | "default" | "outline" | "destructive";
  getAssetTypeIcon: (type: RealAssetType) => string;
  show_like_button?: boolean;
  show_dropdown_menu?: boolean;
}

export function AssetCard({
  asset,
  onSubmitForApproval,
  onTokenize,
  onEdit,
  onArchive,
  onViewDetails,
  submitting,
  getStatusBadgeVariant,
  getAssetTypeIcon,
  show_like_button = true,
  show_dropdown_menu = true,
}: AssetCardProps) {
  useStore(UserFavCubit.state);
  useStore(UserProfileCubit.state);
  const onToggleFavorite = async () => {
    if (UserFavCubit.is_asset_favorite(asset.uuid)) {
      await UserFavCubit.remove_fav_asset(asset.uuid);
    } else {
      await UserFavCubit.add_fav_asset(asset.uuid);
    }
  };
  const is_favorite = UserFavCubit.is_asset_favorite(asset.uuid);
  const navigate = useNavigate();

  const handle_submit_for_approval = async (asset_uuid: string) => {
    if (!UserProfileCubit.is_kyc_verified()) {
      await Swal.fire({
        title: "KYC Verification Required",
        text: "You need to complete KYC verification before submitting assets for approval. Please verify your identity first.",
        icon: "warning",
        confirmButtonText: "Go to KYC Verification",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/settings/kyc");
        }
      });
      return;
    }

    await onSubmitForApproval(asset_uuid);
  };
  const format_date = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const get_parameter_value = (key: string) => {
    const param = asset.parameters?.find((p) => p.name === key);
    return param?.value;
  };

  const get_verification_badges = () => {
    const badges = [];
    if (asset.is_approved_by_gov) {
      badges.push(
        <div
          key="verified"
          className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"
        >
          <i className="bx bx-shield-check"></i>
          <span>Verified</span>
        </div>,
      );
    }
    if (asset.is_tokenized) {
      badges.push(
        <div
          key="tokenized"
          className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium"
        >
          <i className="bx bx-coin-stack"></i>
          <span>Tokenized</span>
        </div>,
      );
    }
    return badges;
  };

  const get_2gis_link = () => {
    if (asset.location && typeof asset.location === "object") {
      //return `https://2gis.kz/search?q=${asset.location.lng},${asset.location.lat}&m=${asset.location.lng},${asset.location.lat}`;
      return `https://2gis.kz/geo/9430150454182001/${asset.location.lng}%2C${asset.location.lat}?m=${asset.location.lng}%2C${asset.location.lat}%2F13`;
    }
    return null;
  };

  const get_action_buttons = () => {
    const buttons = [];

    if (asset.status === RealAssetStatus.Draft || asset.status === RealAssetStatus.RejectedByGov) {
      buttons.push(
        <DropdownMenuItem
          key="edit"
          className="cursor-pointer"
          onSelect={(e) => {
            e.stopPropagation();
            onEdit(asset.uuid);
          }}
        >
          <i className="bx bx-edit mr-2"></i>
          Edit Asset
        </DropdownMenuItem>,
      );
    }

    if (asset.status === RealAssetStatus.Draft) {
      buttons.push(
        <DropdownMenuItem
          key="submit"
          className="cursor-pointer"
          onSelect={(e) => {
            e.stopPropagation();
            handle_submit_for_approval(asset.uuid);
          }}
          disabled={submitting}
        >
          <i className="bx bx-send mr-2"></i>
          {submitting ? "Submitting..." : "Submit for Approval"}
        </DropdownMenuItem>,
      );
    }

    if (
      (asset.status === RealAssetStatus.ApprovedByGov || asset.status === RealAssetStatus.BlockchainError) &&
      !asset.is_tokenized
    ) {
      buttons.push(
        <DropdownMenuItem
          key="tokenize"
          className="cursor-pointer"
          onSelect={(e) => {
            e.stopPropagation();
            onTokenize(asset.uuid);
          }}
          disabled={submitting}
        >
          <i className="bx bx-coin mr-2"></i>
          {submitting ? "Processing..." : "Tokenize Asset"}
        </DropdownMenuItem>,
      );
    }

    buttons.push(
      <DropdownMenuItem
        key="archive"
        className="cursor-pointer text-red-600 focus:text-red-600"
        onSelect={(e) => {
          e.stopPropagation();
          onArchive(asset.uuid);
        }}
        disabled={submitting}
      >
        <i className="bx bx-archive mr-2"></i>
        {submitting ? "Archiving..." : "Archive Asset"}
      </DropdownMenuItem>,
    );

    return buttons;
  };

  const handle_card_click = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, a, [role="button"], [data-radix-popper-content-wrapper], [data-radix-dropdown-menu-content], .dropdown-trigger',
    );

    if (!isInteractiveElement) {
      onViewDetails(asset.uuid);
    }
  };

  return (
    <Card
      className="group hover:border-primary/20 transition-all duration-300 border border-gray-200 overflow-hidden bg-white cursor-pointer hover:shadow-lg"
      onClick={handle_card_click}
    >
      <div className="relative flex h-48">
        <div className="w-80 relative overflow-hidden">
          {asset.photo_list && asset.photo_list.length > 0 ? (
            <div className="relative h-full">
              <img
                src={asset.photo_list[0]}
                alt={asset.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center">
                <i className="bx bx-image text-5xl text-slate-400 mb-2"></i>
                <p className="text-slate-500 text-sm">No Image</p>
              </div>
            </div>
          )}

          <Badge
            variant={getStatusBadgeVariant(asset.status)}
            className={
              "absolute top-2 left-2 text-xs font-medium backdrop-blur-sm " +
              (asset.status === RealAssetStatus.ApprovedByGov ? "bg-green-700" : "")
            }
          >
            {get_status_label_text(asset.status)}
          </Badge>

          {asset.photo_list && asset.photo_list.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-medium">
              <i className="bx bx-image mr-1"></i>
              {asset.photo_list.length}
            </div>
          )}

          {onToggleFavorite && show_like_button && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              disabled={submitting}
              className="absolute top-2 right-2 h-7 w-7 p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
              title={is_favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <i
                className={`bx ${is_favorite ? "bxs-heart text-red-500" : "bx-heart text-slate-600 hover:text-red-500"} text-lg`}
              ></i>
            </Button>
          )}
        </div>

        <div className="flex-1 p-3 flex flex-col justify-between relative">
          {show_dropdown_menu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="dropdown-trigger absolute top-3 right-3 h-7 w-7 p-0 hover:bg-gray-100"
                >
                  <i className="bx bx-dots-vertical-rounded text-lg"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white" onClick={(e) => e.stopPropagation()}>
                {get_action_buttons()}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className={`space-y-2 h-full ${show_dropdown_menu ? "pr-10" : ""}`}>
            <div className="flex justify-between items-start grow">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="text-primary">
                    <i className={`bx ${getAssetTypeIcon(asset.asset_type)} text-sm`}></i>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {asset.asset_type.replace(/_/g, " ")}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                  {asset.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-1">
                  {get_parameter_value("rooms") && (
                    <div className="flex items-center gap-1">
                      <i className="bx bx-door-open text-primary"></i>
                      <span>{get_parameter_value("rooms")} rooms</span>
                    </div>
                  )}
                  {get_parameter_value("area") && (
                    <div className="flex items-center gap-1">
                      <i className="bx bx-expand text-primary"></i>
                      <span>{get_parameter_value("area")} m²</span>
                    </div>
                  )}
                  {get_parameter_value("floor") && (
                    <div className="flex items-center gap-1">
                      <i className="bx bx-building text-primary"></i>
                      <span>Floor {get_parameter_value("floor")}</span>
                    </div>
                  )}
                </div>

                {asset.location && (
                  <div className="flex items-center gap-1 mb-1">
                    {typeof asset.location === "string" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bx bx-map mr-1"></i>
                        {asset.location}
                      </Button>
                    ) : get_2gis_link() ? (
                      <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                        <a
                          href={get_2gis_link() || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bx bx-map mr-1"></i>
                          Location
                          <i className="bx bx-link-external ml-1"></i>
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bx bx-map mr-1"></i>
                        {asset.location.lat}, {asset.location.lng}
                      </Button>
                    )}
                  </div>
                )}

                {get_parameter_value("price") && (
                  <div className="mt-2">
                    <div className="text-lg font-bold text-slate-900">
                      ${Number(get_parameter_value("price")).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      $
                      {Math.round(
                        Number(get_parameter_value("price")) / (Number(get_parameter_value("area")) || 1),
                      ).toLocaleString()}
                      /m²
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-600 max-w-2xl h-4 overflow-hidden">{asset.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <i className="bx bx-calendar"></i>
                <span>Added {format_date(asset.created_at)}</span>
              </div>
              {asset.photo_list && asset.photo_list.length > 0 && (
                <div className="flex items-center gap-1">
                  <i className="bx bx-image"></i>
                  <span>{asset.photo_list.length} photos</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {asset.gov_comment && asset.status === RealAssetStatus.RejectedByGov && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <i className="bx bx-error-circle text-red-500 mt-0.5"></i>
                  <div>
                    <p className="text-xs text-red-600 font-semibold mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-700 leading-relaxed">{asset.gov_comment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
