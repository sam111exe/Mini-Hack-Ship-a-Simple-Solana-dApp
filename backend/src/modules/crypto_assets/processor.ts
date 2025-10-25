import { SolReadOnlyAccount } from "@/blockchain/@soltools";
import * as T from "@/codegen";
import { CryptoAssetRawModel, RealAssetRawModel } from "@/codegen/models";


export const start_processor = async () => {
  console.log("Starting tokenization status checker...");
  while (true) {
    console.log("Checking tokenization status...");
    // sleep 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const in_progress_list = await RealAssetRawModel.find({
      status: { $in: [T.RealAssetStatus.TokenizationInProgress, T.RealAssetStatus.BlockchainError] },
    });

    const assets_list = await CryptoAssetRawModel.find({
      real_asset_uuid: { $in: in_progress_list.map((x) => x.uuid) },
      created_at: { $lt: new Date(Date.now() - 60000) }, // created more than 1 minute ago
    });

    for (const asset of assets_list) {
      const real_asset = in_progress_list.find((x) => x.uuid === asset.real_asset_uuid);
      if (!real_asset) continue;
      const cryptoasset_account = new SolReadOnlyAccount(asset.mint_address);
      if ((await cryptoasset_account.is_exists()) === true) {
        console.log(`✅ Asset ${asset.uuid} is tokenized on blockchain as ${asset.mint_address}`);
        real_asset.status = T.RealAssetStatus.Active;
        await real_asset.save();
      } else {
        real_asset.status = T.RealAssetStatus.BlockchainError;
        await real_asset.save();
      }
    }
  }
};
