import { createServer } from "http";
import express from "express";
import compression from "compression";
import { error_middleware } from "../errors";

export const app = express();
export const router = express.Router();

// https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);
app.use(
  compression({
    filter: function (req, res) {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  }),
);

// Request body handlers
app.use(express.text());
app.use(express.json({ limit: process.env.REQUEST_JSON_BODY_LIMIT || "50mb" }));
app.use(express.urlencoded({ extended: true }));

router.get("/ping", (_, res) => res.json({ pong: true }));

// add router
app.use("/api", router);
// Error handling
app.use(error_middleware);

export const http_server = createServer(app);

export async function start_server() {
  const port = process.env.PORT || 3028;
  console.log("Starting server at port...", port);
  http_server.listen(port, () => console.log(`STARTING_AT_PORT_${port}`)); }
