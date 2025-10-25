import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { GovRealAssetApprovalCubit } from "./gov_real_asset_approval_cubit";
import { SectionHeader } from "@/components/section_header";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { RealAssetResolved, RealAssetApprovalPublic } from "@/codegen";
import { RealAssetStatus } from "@/codegen";
import { AssetDetailsDialog } from "@/sections/my_real_assets/asset_details_dialog";

const get_status_badge = (asset: RealAssetResolved) => {
  switch (asset.status) {
    case RealAssetStatus.ApprovedByGov:
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Approved
        </Badge>
      );
    case RealAssetStatus.RejectedByGov:
      return <Badge variant="destructive">Rejected</Badge>;
    case RealAssetStatus.PendingApprovalByGov:
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{asset.status}</Badge>;
  }
};

const get_asset_type_icon = (asset_type: string) => {
  switch (asset_type) {
    case "APARTMENT":
      return "bx-building-house";
    case "HOUSE":
      return "bx-home";
    case "COMMERCIAL":
      return "bx-store";
    case "LAND":
      return "bx-map";
    default:
      return "bx-building";
  }
};

const RealAssetCard = ({
  asset,
  on_approve,
  on_reject,
  is_processing,
  on_view_details,
}: {
  asset: RealAssetResolved;
  on_approve: (asset_uuid: string) => void;
  on_reject: (asset_uuid: string) => void;
  is_processing: boolean;
  on_view_details: (asset_uuid: string) => void;
}) => {
  const validation_issues = GovRealAssetApprovalCubit.validate_real_asset(asset);
  const has_issues = validation_issues.length > 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className={`bx ${get_asset_type_icon(asset.asset_type)} text-xl text-primary`}></i>
            <div>
              <CardTitle className="text-lg">{asset.name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {asset.owner_uuid} • Location: {asset.location.lat}, {asset.location.lng}
              </div>
            </div>
          </div>
          {get_status_badge(asset)}
        </div>
      </CardHeader>

      <CardContent>
        {has_issues && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center mb-2">
              <i className="bx bx-warning text-yellow-600 mr-2"></i>
              <span className="text-sm font-medium text-yellow-800">Validation Issues:</span>
            </div>
            <ul className="text-sm text-yellow-700 list-disc list-inside">
              {validation_issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Asset Details</div>
            <div className="space-y-1 text-sm">
              <div>
                <strong>Name:</strong> {asset.name}
              </div>
              <div>
                <strong>Type:</strong> {asset.asset_type}
              </div>
              <div>
                <strong>Owner:</strong> {asset.owner_uuid}
              </div>
              <div>
                <strong>Location:</strong> {asset.location.lat}, {asset.location.lng}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Description</div>
            <div className="text-sm text-gray-700 max-h-20 overflow-y-auto">
              {asset.description || "No description provided"}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => on_view_details(asset.uuid)} className="">
            <i className="bx bx-info-circle mr-2"></i>
            View Details
          </Button>
          <div className="grow"></div>
          {asset.status === RealAssetStatus.PendingApprovalByGov && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => on_approve(asset.uuid)}
                disabled={is_processing}
                className="bg-green-600 hover:bg-green-700"
              >
                {is_processing ? (
                  <LoadingSpinner isLoading={true} />
                ) : (
                  <>
                    <i className="bx bx-check mr-2"></i>
                    Approve
                  </>
                )}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => on_reject(asset.uuid)} disabled={is_processing}>
                {is_processing ? (
                  <LoadingSpinner isLoading={true} />
                ) : (
                  <>
                    <i className="bx bx-x mr-2"></i>
                    Reject
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ApprovalDialog = ({
  open,
  on_open_change,
  title,
  asset,
  on_submit,
  is_processing,
}: {
  open: boolean;
  on_open_change: (open: boolean) => void;
  title: string;
  asset: RealAssetResolved | null;
  on_submit: (approval_data: RealAssetApprovalPublic) => void;
  is_processing: boolean;
}) => {
  const [comments, set_comments] = useState("");

  const handle_submit = () => {
    const approval_data: RealAssetApprovalPublic = {
      comment: comments.trim() || undefined,
    };
    on_submit(approval_data);
  };

  return (
    <Dialog open={open} onOpenChange={on_open_change}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {asset && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="font-medium">{asset.name}</div>
              <div className="text-sm text-muted-foreground">Owner: {asset.owner_uuid}</div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments about this decision..."
              value={comments}
              onChange={(e) => set_comments(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => on_open_change(false)} disabled={is_processing}>
              Cancel
            </Button>
            <Button onClick={handle_submit} disabled={is_processing}>
              {is_processing ? <LoadingSpinner isLoading={true} /> : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const GovApprovalsSection = () => {
  const state = useStore(GovRealAssetApprovalCubit.state);
  const [active_tab, set_active_tab] = useState<"pending" | "approved" | "rejected">("pending");
  const [details_dialog_open, set_details_dialog_open] = useState(false);
  const [selected_asset_for_details, set_selected_asset_for_details] = useState<string | null>(null);
  const [approval_dialog, set_approval_dialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    asset: RealAssetResolved | null;
  }>({
    open: false,
    type: "approve",
    asset: null,
  });

  useEffect(() => {
    GovRealAssetApprovalCubit.init();
  }, []);

  const handle_approve = (asset_uuid: string) => {
    const asset = GovRealAssetApprovalCubit.get_asset_by_uuid(asset_uuid);
    if (asset) {
      set_approval_dialog({
        open: true,
        type: "approve",
        asset,
      });
    }
  };

  const handle_reject = (asset_uuid: string) => {
    const asset = GovRealAssetApprovalCubit.get_asset_by_uuid(asset_uuid);
    if (asset) {
      set_approval_dialog({
        open: true,
        type: "reject",
        asset,
      });
    }
  };

  const handle_view_details = (asset_uuid: string) => {
    set_selected_asset_for_details(asset_uuid);
    set_details_dialog_open(true);
  };

  const handle_approval_submit = async (approval_data: RealAssetApprovalPublic) => {
    if (!approval_dialog.asset) return;

    const success =
      approval_dialog.type === "approve"
        ? await GovRealAssetApprovalCubit.approve_real_asset(approval_dialog.asset.uuid, approval_data)
        : await GovRealAssetApprovalCubit.reject_real_asset(approval_dialog.asset.uuid, approval_data);

    if (success) {
      toast.success(`Real asset ${approval_dialog.type === "approve" ? "approved" : "rejected"} successfully`);
      set_approval_dialog({ open: false, type: "approve", asset: null });
    }
  };

  const get_filtered_assets = () => {
    switch (active_tab) {
      case "pending":
        return GovRealAssetApprovalCubit.get_pending_assets();
      case "approved":
        return GovRealAssetApprovalCubit.get_approved_assets();
      case "rejected":
        return GovRealAssetApprovalCubit.get_rejected_assets();
      default:
        return [];
    }
  };

  const filtered_assets = get_filtered_assets();
  const pending_count = GovRealAssetApprovalCubit.get_pending_count();

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner isLoading={true} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <SectionHeader
        title="Government Approvals"
        subtitle="Review and manage real asset approval requests"
        icon="bx-shield-check"
        icon_class="text-blue-600"
        badge={
          pending_count > 0 ? (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {pending_count} pending
            </Badge>
          ) : undefined
        }
      />

      {state.errors.length > 0 && (
        <div className="mb-4">
          {state.errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}

      {state.success_message && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm">
          {state.success_message}
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active_tab === "pending" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => set_active_tab("pending")}
          >
            Pending ({GovRealAssetApprovalCubit.get_pending_assets().length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active_tab === "approved" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => set_active_tab("approved")}
          >
            Approved ({GovRealAssetApprovalCubit.get_approved_assets().length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active_tab === "rejected" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => set_active_tab("rejected")}
          >
            Rejected ({GovRealAssetApprovalCubit.get_rejected_assets().length})
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{active_tab} Assets</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => GovRealAssetApprovalCubit.refresh()}
          disabled={state.loading}
        >
          <i className="bx bx-refresh mr-2"></i>
          Refresh
        </Button>
      </div>

      {filtered_assets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="bx bx-shield-check text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {active_tab} assets</h3>
            <p className="text-gray-500 text-center">
              {active_tab === "pending"
                ? "All real asset requests have been processed."
                : `No ${active_tab} real assets found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered_assets.map((asset) => (
            <RealAssetCard
              key={asset.uuid}
              asset={asset}
              on_approve={handle_approve}
              on_reject={handle_reject}
              is_processing={GovRealAssetApprovalCubit.is_processing_asset(asset.uuid)}
              on_view_details={handle_view_details}
            />
          ))}
        </div>
      )}

      {/* Approval/Rejection Dialog */}
      <ApprovalDialog
        open={approval_dialog.open}
        on_open_change={(open) => set_approval_dialog((prev) => ({ ...prev, open }))}
        title={`${approval_dialog.type === "approve" ? "Approve" : "Reject"} Real Asset`}
        asset={approval_dialog.asset}
        on_submit={handle_approval_submit}
        is_processing={state.approving_uuid !== null || state.rejecting_uuid !== null}
      />

      {/* Asset Details Dialog */}
      <AssetDetailsDialog
        asset={
          selected_asset_for_details ? GovRealAssetApprovalCubit.get_asset_by_uuid(selected_asset_for_details) : null
        }
        open={details_dialog_open}
        onOpenChange={(open) => {
          set_details_dialog_open(open);
          if (!open) set_selected_asset_for_details(null);
        }}
      />
    </div>
  );
};
