import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { UserCryptoAssetsCubit } from "./user_crypto_assets_cubit";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { SectionHeader } from "@/components/section_header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CryptoAssetResolved } from "@/codegen";

export function MyCryptoAssets() {
  const state = useStore(UserCryptoAssetsCubit.state);

  useEffect(() => {
    UserCryptoAssetsCubit.init();
  }, []);

  const handle_search_change = (value: string) => {
    UserCryptoAssetsCubit.set_filter({ ...state.filter, search_text: value });
  };

  const handle_view_details = (asset: CryptoAssetResolved) => {
    const solscan_url = `https://solscan.io/token/${asset.mint_address}?cluster=devnet`;
    window.open(solscan_url, '_blank');
  };

  const filtered_assets = UserCryptoAssetsCubit.get_filtered_assets();

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
        title="My Crypto Assets"
        subtitle="View your tokenized real estate assets on the blockchain"
        icon="bx-coin-stack"
        icon_class="text-2xl text-primary"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name, symbol, or mint address..."
            value={state.filter.search_text || ""}
            onChange={(e) => handle_search_change(e.target.value)}
            className="w-full"
          />
        </div>

        <Button variant="outline" onClick={() => UserCryptoAssetsCubit.init()} disabled={state.loading}>
          <i className="bx bx-refresh mr-2"></i>
          Refresh
        </Button>
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
        <Card className="text-center py-12">
          <CardContent>
            <i className="bx bx-coin-stack text-6xl text-muted-foreground mb-4"></i>
            <p className="text-lg font-medium text-muted-foreground">No crypto assets found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your tokenized assets will appear here once created
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-12">
          {filtered_assets.map((asset) => (
            <Card 
              key={asset.uuid} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handle_view_details(asset)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {asset.name}
                    <i className="bx bx-external-link text-sm opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </CardTitle>
                  <Badge variant="secondary">{asset.symbol}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-wallet text-muted-foreground"></i>
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-mono text-xs truncate flex-1">
                      {asset.owner_address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-coin text-muted-foreground"></i>
                    <span className="text-muted-foreground">Mint:</span>
                    <span className="font-mono text-xs truncate flex-1">
                      {asset.mint_address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-hash text-muted-foreground"></i>
                    <span className="text-muted-foreground">Token #:</span>
                    <span>{asset.no}</span>
                  </div>
                </div>
                
                {asset.seller_fee_basis_points > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Royalty: {asset.seller_fee_basis_points / 100}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}