import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletWidget } from "../blockchain/wallet_widget";

interface TokenizeAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTokenize: () => Promise<void>;
  submitting: boolean;
}

export function TokenizeAssetDialog({ open, onOpenChange, onTokenize, submitting }: TokenizeAssetDialogProps) {
  const { connected } = useWallet();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tokenize Asset</DialogTitle>
          <DialogDescription>Mint NFT for your real asset</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <i className="bx bx-info-circle"></i>
              What will happen:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                We will mint an NFT for your real asset
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Fee will be paid by you
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                After completion, the NFT will be available in your wallet
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <i className="bx bx-wallet"></i>
              Wallet Connection:
            </h3>
            <div className="border rounded-lg p-3">
              <WalletWidget />
            </div>
            {!connected && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                <i className="bx bx-warning mr-1"></i>
                Please connect your wallet to proceed with tokenization
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onTokenize} disabled={submitting || !connected}>
            {submitting ? "Processing..." : "Tokenize Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
