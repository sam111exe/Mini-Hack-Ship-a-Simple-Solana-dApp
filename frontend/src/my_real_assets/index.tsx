import { web3 } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { base64 } from "@metaplex-foundation/umi/serializers";
import { useStore } from "@nanostores/react";
import { UserRealAssetsCubit } from "./user_real_assets_cubit";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { RealAssetType, type RealAssetPublic, type RealAssetTokenizationPayload } from "@/codegen";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AssetDialog } from "./asset_dialog";
import { AssetDetailsDialog } from "./asset_details_dialog";
import { TokenizeAssetDialog } from "./tokenize_asset_dialog";
import { AssetCard } from "./asset_card";
import { AssetFilters } from "./asset_filters";
import { EmptyState } from "./empty_state";
import { get_status_badge_variant, get_asset_type_icon, almaty_center } from "./utils";
import Swal from "sweetalert2";
import { UserFavCubit } from "../fav/user_fav_cubit";
import { SectionHeader } from "@/components/section_header";
import { useWallet } from "@solana/wallet-adapter-react";
import { wallet_approval_wrapper } from "../blockchain/wallet_approver_wrapper";
import { api } from "@/api";

export function MyRealAssets() {
  const state = useStore(UserRealAssetsCubit.state);
  const { publicKey } = useWallet();
  const [create_dialog_open, set_create_dialog_open] = useState(false);
  const [edit_dialog_open, set_edit_dialog_open] = useState(false);
  const [tokenize_dialog_open, set_tokenize_dialog_open] = useState(false);
  const [details_dialog_open, set_details_dialog_open] = useState(false);
  const [selected_asset_for_edit, set_selected_asset_for_edit] = useState<string | null>(null);
  const [selected_asset_for_tokenization, set_selected_asset_for_tokenization] = useState<string | null>(null);
  const [selected_asset_for_details, set_selected_asset_for_details] = useState<string | null>(null);

  const [new_asset, set_new_asset] = useState<RealAssetPublic>({
    name: "",
    description: "",
    asset_type: RealAssetType.Apartment,
    photo_list: [],
    parameters: [],
    location: almaty_center,
  });

  const [edited_asset, set_edited_asset] = useState<RealAssetPublic>({
    name: "",
    description: "",
    asset_type: RealAssetType.Apartment,
    photo_list: [],
    parameters: [],
    location: almaty_center,
  });

  useEffect(() => {
    UserRealAssetsCubit.init();
  }, []);

  const handle_create_asset = async () => {
    const result = await UserRealAssetsCubit.create_asset(new_asset);
    if (result) {
      toast.success("Asset created successfully");
      set_create_dialog_open(false);
      set_new_asset({
        name: "",
        description: "",
        asset_type: RealAssetType.Apartment,
        photo_list: [],
        parameters: [],
        location: { lat: 0, lng: 0 },
      });
    }
  };

  const handle_edit_asset = (asset_uuid: string) => {
    const asset = state.assets.find((a) => a.uuid === asset_uuid);
    if (asset) {
      set_edited_asset({
        name: asset.name,
        description: asset.description || "",
        asset_type: asset.asset_type,
        photo_list: asset.photo_list || [],
        parameters: asset.parameters || [],
        location: asset.location || { lat: 0, lng: 0 },
      });
      set_selected_asset_for_edit(asset_uuid);
      set_edit_dialog_open(true);
    }
  };

  const handle_update_asset = async () => {
    if (!selected_asset_for_edit) return;

    const result = await UserRealAssetsCubit.update_asset(selected_asset_for_edit, edited_asset);
    if (result) {
      toast.success("Asset updated successfully");
      set_edit_dialog_open(false);
      set_selected_asset_for_edit(null);
      set_edited_asset({
        name: "",
        description: "",
        asset_type: RealAssetType.Apartment,
        photo_list: [],
        parameters: [],
        location: { lat: 0, lng: 0 },
      });
    }
  };

  const handle_submit_for_approval = async (asset_uuid: string) => {
    const asset = state.assets.find((a) => a.uuid === asset_uuid);
    const asset_name = asset?.name || "this asset";

    const result = await Swal.fire({
      title: "Submit for Government Approval?",
      html: `
        <p>Are you sure you want to submit "${asset_name}" for government approval?</p>
        <br>
        <div style="background: #fef3cd; border: 1px solid #faebcc; border-radius: 4px; padding: 12px; margin: 8px 0;">
          <strong>⚠️ Important:</strong> Government service will thoroughly check your asset and may reject it if:
          <ul style="text-align: left; margin: 8px 0; padding-left: 20px;">
            <li>Property documents are incomplete or invalid</li>
            <li>Asset information contains errors</li>
            <li>Photos don't match the property</li>
            <li>Legal requirements are not met</li>
          </ul>
          Please ensure all information and documents are correct before submitting.
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit for approval",
      cancelButtonText: "Cancel",
      width: 600,
    });

    if (result.isConfirmed) {
      const submit_result = await UserRealAssetsCubit.submit_for_approval(asset_uuid);
      if (submit_result) {
        toast.success("Asset submitted for approval");
      }
    }
  };

  const handle_archive_asset = async (asset_uuid: string) => {
    const asset = state.assets.find((a) => a.uuid === asset_uuid);
    const asset_name = asset?.name || "this asset";

    const result = await Swal.fire({
      title: "Archive Asset?",
      text: `Are you sure you want to archive "${asset_name}"? This will hide it from the main list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const archive_result = await UserRealAssetsCubit.archive_asset(asset_uuid);
      if (archive_result) {
        toast.success("Asset archived successfully");
      }
    }
  };

  const wallet = useWallet();
  const handle_tokenize = async () => {
    if (!wallet) throw new Error("Wallet not connected");
    if (!selected_asset_for_tokenization || !publicKey) return;

    const tokenization_data: RealAssetTokenizationPayload = {
      owner_address: publicKey.toString(),
    };

    const result = await api.user_tokenize_real_asset(selected_asset_for_tokenization, tokenization_data);
    if (result) {
      const tx_bytes = base64.serialize(result.b64_tx_to_sign);
      const tx = web3.Transaction.from(tx_bytes);
      if (wallet.wallet?.adapter.name === "Phantom") {
        console.log(tx.instructions)
        //tx.instructions.pop(); // Remove last instruction for Phantom wallet because phantom adds it automatically some instructions
      }
      const txx = wallet.signTransaction?.(tx);
      if (!txx) throw new Error("Transaction signing failed");
      let signed;

      Swal.fire({
        title: "Processing transaction...",
        html: "Please wait while the transaction is being processed.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        signed = await wallet_approval_wrapper(txx);
        if (!signed.signature) throw new Error("No signature returned");
        if (!signed.recentBlockhash) {
          Swal.fire({
            title: "Transaction failed",
            text: "No recent blockhash found in the signed transaction.",
            icon: "error",
          });
        }

        const { tx_hash } = await api.user_tokenize_real_asset_confirm(selected_asset_for_tokenization, {
          signature: signed.signature.toString("base64"),
          recent_blockhash: signed.recentBlockhash!,
          owner_public_key: publicKey.toString(),
        });

        Swal.fire({
          title: "Transaction submitted",
          html: `Transaction has been submitted. <br> <a href="https://explorer.solana.com/tx/${tx_hash}?cluster=devnet" target="_blank" class="underline">View on Solana Explorer</a>`,
          icon: "success",
        });
      } catch (e) {
        Swal.close();
        throw e;
        /* handle error */
      }

      /*
      const resp_confirm = await axios.post<{ tx_hash: string }>("/buy-pixel-confirm", {
        ...data,
        signature: signed.signature.toString("base64"),
        recent_blockhash: signed.recentBlockhash,
      });

      const tx_hash = resp_confirm.data.tx_hash;
      await tx_status_handler(SolTx.from_tx_hash(tx_hash));


      toast.success("Asset tokenized successfully");
      * **/
      /*
      set_tokenize_dialog_open(false);
      set_selected_asset_for_tokenization(null);
      * **/
    }
  };

  const handle_view_details = (asset_uuid: string) => {
    set_selected_asset_for_details(asset_uuid);
    set_details_dialog_open(true);
  };

  const filtered_assets = UserRealAssetsCubit.get_filtered_assets();

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner isLoading={true} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <SectionHeader
        title="My Real Assets"
        subtitle="Manage your real estate assets and tokenization"
        icon="bx-building-house"
        icon_class="text-2xl text-primary"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <AssetFilters
          searchText={state.filter.search_text}
          status={state.filter.status}
          assetType={state.filter.asset_type}
          showArchived={state.filter.show_archived}
          onSearchTextChange={(value) => UserRealAssetsCubit.set_filter({ ...state.filter, search_text: value })}
          onStatusChange={(value) => UserRealAssetsCubit.set_filter({ ...state.filter, status: value })}
          onAssetTypeChange={(value) => UserRealAssetsCubit.set_filter({ ...state.filter, asset_type: value })}
          onShowArchivedChange={(value) => UserRealAssetsCubit.set_filter({ ...state.filter, show_archived: value })}
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => UserRealAssetsCubit.init()} disabled={state.loading}>
            <i className="bx bx-refresh mr-2"></i>
            Refresh
          </Button>

          <AssetDialog
            mode="create"
            open={create_dialog_open}
            onOpenChange={set_create_dialog_open}
            asset={null}
            assetData={new_asset}
            onAssetDataChange={set_new_asset}
            onSubmit={handle_create_asset}
            submitting={state.submitting}
            trigger={
              <Button>
                <i className="bx bx-plus mr-2"></i>
                Create Asset
              </Button>
            }
          />
        </div>
      </div>

      {state.errors.length > 0 && (
        <div className="mb-4">
          {state.errors.map((error, index) => (
            <div key={index} className="text-red-500 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}

      {filtered_assets.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2   pb-12">
          {filtered_assets.map((asset) => (
            <AssetCard
              key={asset.uuid}
              asset={asset}
              onSubmitForApproval={handle_submit_for_approval}
              onTokenize={(asset_uuid) => {
                set_selected_asset_for_tokenization(asset_uuid);
                set_tokenize_dialog_open(true);
              }}
              onToggleFavorite={async () => {
                if (UserFavCubit.is_asset_favorite(asset.uuid)) {
                  await UserFavCubit.remove_fav_asset(asset.uuid);
                } else {
                  await UserFavCubit.add_fav_asset(asset.uuid);
                }
              }}
              onEdit={handle_edit_asset}
              onArchive={handle_archive_asset}
              onViewDetails={handle_view_details}
              submitting={state.submitting}
              getStatusBadgeVariant={get_status_badge_variant}
              getAssetTypeIcon={get_asset_type_icon}
              show_like_button={false}
            />
          ))}
        </div>
      )}

      <AssetDialog
        mode="edit"
        open={edit_dialog_open}
        onOpenChange={set_edit_dialog_open}
        asset={selected_asset_for_edit ? state.assets.find((a) => a.uuid === selected_asset_for_edit) || null : null}
        assetData={edited_asset}
        onAssetDataChange={set_edited_asset}
        onSubmit={handle_update_asset}
        submitting={state.submitting}
      />

      <TokenizeAssetDialog
        open={tokenize_dialog_open}
        onOpenChange={set_tokenize_dialog_open}
        onTokenize={handle_tokenize}
        submitting={state.submitting}
      />

      <AssetDetailsDialog
        asset={
          selected_asset_for_details ? state.assets.find((a) => a.uuid === selected_asset_for_details) || null : null
        }
        open={details_dialog_open}
        onOpenChange={(open) => {
          set_details_dialog_open(open);
          if (!open) set_selected_asset_for_details(null);
        }}
      />
    </div>
  );
}
