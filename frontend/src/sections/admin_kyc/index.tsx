import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { AdminKycCubit } from "./admin_kyc_cubit";
import { SectionHeader } from "@/components/section_header";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { UserKycRequestResolved } from "@/codegen";
import Swal from "sweetalert2";

const get_status_badge = (request: UserKycRequestResolved) => {
  if (request.approved_by_admin) {
    return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
  }
  if (request.rejected_by_admin) {
    return <Badge variant="destructive">Rejected</Badge>;
  }
  return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
};

const KycRequestCard = ({ 
  request, 
  on_approve, 
  on_reject, 
  is_processing,
  on_view_image
}: { 
  request: UserKycRequestResolved;
  on_approve: (user_uuid: string) => void;
  on_reject: (user_uuid: string) => void;
  is_processing: boolean;
  on_view_image: (url: string, title: string) => void;
}) => {
  const validation_issues = AdminKycCubit.validate_kyc_request(request);
  const has_issues = validation_issues.length > 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {request.name} {request.surname}
            {request.patronym && ` ${request.patronym}`}
          </CardTitle>
          {get_status_badge(request)}
        </div>
        <div className="text-sm text-muted-foreground">
          IIN: {request.iin} • User ID: {request.user_uuid}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Documents</div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => on_view_image(request.document_front_url, 'Front Document')}
              >
                <i className="bx bx-image mr-2"></i>
                View Front Document
              </Button>
              {request.document_back_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => on_view_image(request.document_back_url!, 'Back Document')}
                >
                  <i className="bx bx-image mr-2"></i>
                  View Back Document
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => on_view_image(request.selfie_url, 'Selfie')}
              >
                <i className="bx bx-user mr-2"></i>
                View Selfie
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Personal Info</div>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {request.name}</div>
              <div><strong>Surname:</strong> {request.surname}</div>
              {request.patronym && <div><strong>Patronym:</strong> {request.patronym}</div>}
              <div><strong>IIN:</strong> {request.iin}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="space-y-1 text-sm">
              <div><strong>Current Status:</strong> {get_status_badge(request)}</div>
              <div><strong>Request ID:</strong> {request.uuid}</div>
            </div>
          </div>
        </div>

        {!request.approved_by_admin && !request.rejected_by_admin && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="default"
              size="sm"
              onClick={() => on_approve(request.user_uuid)}
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
            <Button
              variant="destructive"
              size="sm"
              onClick={() => on_reject(request.user_uuid)}
              disabled={is_processing}
            >
              {is_processing ? (
                <LoadingSpinner isLoading={true} />
              ) : (
                <>
                  <i className="bx bx-x mr-2"></i>
                  Reject
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AdminKycSection = () => {
  const state = useStore(AdminKycCubit.state);
  const [active_tab, set_active_tab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [image_preview, set_image_preview] = useState<{url: string; title: string} | null>(null);

  useEffect(() => {
    AdminKycCubit.init();
  }, []);

  const handle_view_image = (url: string, title: string) => {
    set_image_preview({ url, title });
  };

  const close_image_preview = () => {
    set_image_preview(null);
  };

  const handle_approve = async (user_uuid: string) => {
    const request = AdminKycCubit.get_request_by_user_uuid(user_uuid);
    if (!request) return;

    const result = await Swal.fire({
      title: "Approve KYC Request?",
      html: `
        <p>Are you sure you want to approve the KYC request for:</p>
        <br>
        <strong>${request.name} ${request.surname}</strong><br>
        <small>IIN: ${request.iin}</small>
        <br><br>
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 12px;">
          <strong>✅ This will:</strong>
          <ul style="text-align: left; margin: 8px 0; padding-left: 20px;">
            <li>Mark the user as KYC verified</li>
            <li>Allow them to access premium features</li>
            <li>Enable asset tokenization capabilities</li>
          </ul>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      width: 500,
    });

    if (result.isConfirmed) {
      const success = await AdminKycCubit.approve_kyc_request(user_uuid);
      if (success) {
        toast.success("KYC request approved successfully");
      }
    }
  };

  const handle_reject = async (user_uuid: string) => {
    const request = AdminKycCubit.get_request_by_user_uuid(user_uuid);
    if (!request) return;

    const result = await Swal.fire({
      title: "Reject KYC Request?",
      html: `
        <p>Are you sure you want to reject the KYC request for:</p>
        <br>
        <strong>${request.name} ${request.surname}</strong><br>
        <small>IIN: ${request.iin}</small>
        <br><br>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 12px;">
          <strong>❌ This will:</strong>
          <ul style="text-align: left; margin: 8px 0; padding-left: 20px;">
            <li>Mark the request as rejected</li>
            <li>User will need to submit a new request</li>
            <li>User cannot access premium features</li>
          </ul>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      width: 500,
    });

    if (result.isConfirmed) {
      const success = await AdminKycCubit.reject_kyc_request(user_uuid);
      if (success) {
        toast.success("KYC request rejected");
      }
    }
  };

  const get_filtered_requests = () => {
    switch (active_tab) {
      case 'pending':
        return AdminKycCubit.get_pending_requests();
      case 'approved':
        return AdminKycCubit.get_approved_requests();
      case 'rejected':
        return AdminKycCubit.get_rejected_requests();
      default:
        return [];
    }
  };

  const filtered_requests = get_filtered_requests();
  const pending_count = AdminKycCubit.get_pending_count();

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
        title="KYC Management"
        subtitle="Review and manage KYC verification requests"
        icon="bx-shield-check"
        icon_class="text-orange-600"
        badge={
          pending_count > 0 ? (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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
              active_tab === 'pending' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => set_active_tab('pending')}
          >
            Pending ({AdminKycCubit.get_pending_requests().length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active_tab === 'approved' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => set_active_tab('approved')}
          >
            Approved ({AdminKycCubit.get_approved_requests().length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active_tab === 'rejected' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => set_active_tab('rejected')}
          >
            Rejected ({AdminKycCubit.get_rejected_requests().length})
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{active_tab} Requests</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => AdminKycCubit.refresh()}
          disabled={state.loading}
        >
          <i className="bx bx-refresh mr-2"></i>
          Refresh
        </Button>
      </div>

      {filtered_requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="bx bx-shield-check text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {active_tab} requests
            </h3>
            <p className="text-gray-500 text-center">
              {active_tab === 'pending' 
                ? "All KYC requests have been processed."
                : `No ${active_tab} KYC requests found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered_requests.map((request) => (
            <KycRequestCard
              key={request.uuid}
              request={request}
              on_approve={handle_approve}
              on_reject={handle_reject}
              is_processing={AdminKycCubit.is_processing_request(request.user_uuid)}
              on_view_image={handle_view_image}
            />
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!image_preview} onOpenChange={close_image_preview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{image_preview?.title}</DialogTitle>
          </DialogHeader>
          {image_preview && (
            <div className="flex justify-center">
              <img
                src={image_preview.url}
                alt={image_preview.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.png";
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};