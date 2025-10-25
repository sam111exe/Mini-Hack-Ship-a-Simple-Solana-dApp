import type { UploadedFile } from "express-fileupload";
import Merge from "lodash/merge";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import UploadGearBase, { type UploadGearBaseConfig, default_upload_gear_base_config } from "./upload_gear_base";

const dev_log = (msg: any, tag = "DEV_LOG") => console.log(`[${tag}]`, msg);

export type S3UploadGearConfig = {
  endpoint: string;
  region: string;
  access_key_id: string;
  bucket: string;
  secret_access_key: string;
} & UploadGearBaseConfig;

const default_s3_upload_gear_config: S3UploadGearConfig = {
  ...default_upload_gear_base_config,
  url: process.env.S3_EDGE_ENDPOINT! || "https://sergazin.kz/uploads",
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
  access_key_id: process.env.S3_ACCESS_KEY_ID!, // Access key pair. You can create access key pairs using the control panel or API.
  secret_access_key: process.env.S3_SECRET_ACCESS_KEY!, // Secret access key defined through an environment variable.
};

export class S3UploadGear extends UploadGearBase {
  declare config: S3UploadGearConfig & UploadGearBaseConfig;
  s3_client: S3Client;

  constructor(cfg: Partial<S3UploadGearConfig>) {
    super(Merge({}, default_s3_upload_gear_config, cfg));
    const { config } = this;
    this.s3_client = new S3Client({
      endpoint: config.endpoint,
      forcePathStyle: false,
      region: config.region,
      credentials: {
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
      },
    });

    dev_log(
      [` - endpoint: ${this.config.endpoint}`, ` - region: ${this.config.region}`].join("\n"),
      "S3_UPLOAD_GEAR_INITIALIZATION",
    );
  }

  async process_file(file: UploadedFile, abs_path: string) {
    await this.s3_client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: abs_path,
        Body: file.data,
        ACL: "public-read",
        //ACL: "public",
      }),
    );
  }

  async process_buffer(buffer: Buffer, abs_path: string) {
    await this.s3_client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: abs_path,
        Body: buffer,
        ACL: "public-read",
        //ACL: "public",
      }),
    );
  }
}
