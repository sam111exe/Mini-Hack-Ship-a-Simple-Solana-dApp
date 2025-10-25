import "dotenv/config";
// Ensure models are loaded before use, otherwise relations might not be set up correctly
import "./codegen/models/real_asset_status_model";
import "./codegen/models/real_asset_type_model";
import "./blockchain";

import { apply_routes } from "./codegen";
import { Controller } from "@/controller";
import init_db from "./inits/db";
import { router, start_server } from "./inits/web_server";
import "./modules";
import "./metadata";
import { start_prefill } from "./prefill";
import { start_processor } from "./modules/crypto_assets/processor";

async function main() {
  console.log("STARTING APP");
  //console.log("NODE_ENV", process.env);
  //parse_all_data_and_save_to_db();
  const x = await init_db();
  await start_prefill();

  x.on("connected", () => {
    console.log("DB connected");
  });
  apply_routes(router, new Controller());
  console.log("ROUTES", "\n   " + router.stack.map((r) => r.route?.path).join("\n   "));
  start_processor();
  await start_server();
}
main();
