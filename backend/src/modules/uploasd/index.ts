import * as T from "@/codegen";
import { S3UploadGear } from "./s3_upload_gear";

const s3_upload_gear = new S3UploadGear({});

export async function upload(auth_claims: T.AuthClaims, body: T.UploadRequest): Promise<T.UploadResponse> {
  try {
    const file_buffer = Buffer.from(body.file_bytes_b64, "base64");

    let file = await s3_upload_gear.start_buffer(
      {
        buffer: file_buffer,
        filename: body.file_name,
        mimetype: body.file_mime_type,
      },
      {
        owner_uuid: auth_claims.user_uuid,
        folder_name: auth_claims.user_uuid,
      },
    );
    return { file_url: file.url };
  } catch (error) {
    throw new Error(`Upload failed: ${error}`);
  }
}
