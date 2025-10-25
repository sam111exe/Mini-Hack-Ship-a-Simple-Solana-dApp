export const CONFIG = {
  HOST: "https://realx.neodev.kz",
  DEV_MODE: true,
  SOLANA_APP_ACCOUNT_PRIVATE_KEY: process.env.SOLANA_APP_ACCOUNT_PRIVATE_KEY as string,
};

if (!CONFIG.HOST) {
  throw new Error("HOST is not set");
}
if (!CONFIG.SOLANA_APP_ACCOUNT_PRIVATE_KEY) {
  throw new Error("SOLANA_APP_ACCOUNT_PRIVATE_KEY is not set");
}

if (CONFIG.DEV_MODE === undefined) {
  throw new Error("DEV_MODE is not set");
}
console.log("CONFIG", CONFIG);
