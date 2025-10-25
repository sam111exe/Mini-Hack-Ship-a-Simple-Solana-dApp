import { RealAssetStatus, RealAssetType, type Geopoint } from "@/codegen";

export const get_status_badge_variant = (
  status: RealAssetStatus,
): "secondary" | "default" | "outline" | "destructive" => {
  switch (status) {
    case RealAssetStatus.Draft:
      return "secondary";
    case RealAssetStatus.PendingApprovalByGov:
      return "default";
    case RealAssetStatus.ApprovedByGov:
      return "default";
    case RealAssetStatus.Active:
      return "outline";
    case RealAssetStatus.RejectedByGov:
      return "destructive";
    case RealAssetStatus.TokenizationInProgress:
      return "default";
    case RealAssetStatus.Sold:
      return "destructive";
    case RealAssetStatus.Staked:
      return "outline";
    case RealAssetStatus.Archived:
      return "secondary";
    case RealAssetStatus.BlockchainError:
      return "destructive";
    default:
      return "secondary";
  }
};

export const get_asset_type_icon = (type: RealAssetType): string => {
  switch (type) {
    case RealAssetType.Apartment:
      return "bx-building";
    case RealAssetType.House:
      return "bx-home";
    case RealAssetType.Garage:
      return "bx-car";
    case RealAssetType.Parking:
      return "bx-car";
    case RealAssetType.Land:
      return "bx-landscape";
    case RealAssetType.Commercial:
      return "bx-store";
    case RealAssetType.Business:
      return "bx-briefcase";
    case RealAssetType.Industrial:
      return "bx-factory";
    default:
      return "bx-cube";
  }
};

export function get_status_label_text(status: RealAssetStatus): string {
  switch (status) {
    case RealAssetStatus.Draft:
      return "Draft";
    case RealAssetStatus.PendingApprovalByGov:
      return "Pending Approval";
    case RealAssetStatus.ApprovedByGov:
      return "Approved by Gov";
    case RealAssetStatus.Active:
      return "Active";
    case RealAssetStatus.RejectedByGov:
      return "Rejected";
    case RealAssetStatus.TokenizationInProgress:
      return "Tokenization In Progress";
    case RealAssetStatus.Sold:
      return "Sold";
    case RealAssetStatus.Staked:
      return "Staked";
    case RealAssetStatus.Archived:
      return "Archived";
    default:
      return status;
  }
}

export function get_real_asset_type_label_text(type: RealAssetType): string {
  switch (type) {
    case RealAssetType.Apartment:
      return "Apartment";
    case RealAssetType.House:
      return "House";
    case RealAssetType.Garage:
      return "Garage";
    case RealAssetType.Parking:
      return "Parking";
    case RealAssetType.Land:
      return "Land";
    case RealAssetType.Commercial:
      return "Commercial";
    case RealAssetType.Business:
      return "Business";
    case RealAssetType.Industrial:
      return "Industrial";
    default:
      return "Unknown Type";
  }
}
export const almaty_center: Geopoint = { lat: 43.222, lng: 76.8512 };
