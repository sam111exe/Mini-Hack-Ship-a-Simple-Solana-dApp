import express from "express";
import { router } from "@/inits/web_server";
import { CONFIG } from "@/config";
import { CryptoAssetRawModel, RealAssetRawModel } from "@/codegen/models";

export const metadata_router = express.Router();
metadata_router.get("/collection.json", (_, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  res.json({
    name: "RealX NFT Collection",
    symbol: "REALX",
    description:
      "RealX is revolutionizing real estate investment by offering fractional ownership of premium properties through blockchain technology. Our NFTs represent shares in a diversified portfolio of high-quality real estate assets, providing investors with liquidity, transparency, and accessibility. Join us in transforming the way people invest in real estate.",
    seller_fee_basis_points: 0,
    external_url: CONFIG.HOST,
    edition: "",
    background_color: "00FF00",
    image: `${CONFIG.HOST}/assets/collection.png`,
  });
});

metadata_router.get("/:no/metadata.json", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  const no = parseInt(req.params.no, 10);
  const crypto_asset = await CryptoAssetRawModel.findOne({ no });
  if (!crypto_asset) {
    return res.status(404).json({ error: "NFT not found" });
  }

  const real_asset = await RealAssetRawModel.findOne({ uuid: crypto_asset.real_asset_uuid });
  if (!real_asset) {
    return res.status(404).json({ error: "Associated real asset not found" });
  }

  res.json({
    name: `RealX NFT ${req.params.no}`,
    symbol: "REALX",
    description: `RealX is revolutionizing real estate investment by offering fractional ownership of premium properties through blockchain technology. Our NFTs represent shares in a diversified portfolio of high-quality real estate assets, providing investors with liquidity, transparency, and accessibility. Join us in transforming the way people invest in real estate.`,
    seller_fee_basis_points: 0,
    external_url: CONFIG.HOST,
    edition: "",
    background_color: "000000",
    image: real_asset.photo_list[0] || `${CONFIG.HOST}/assets/collection.png`,
    attributes: real_asset.parameters.map((param) => ({
      trait_type: param.name,
      value: param.value,
    })),
  });
});

router.use("/meta", metadata_router);
