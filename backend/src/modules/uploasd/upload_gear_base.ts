import { v4 } from "uuid";
import computeSha256 from "sha256";
import path from "path";
import _merge from "lodash/merge";
import { type UploadedFile } from "express-fileupload";

export type BufferUploadData = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size?: number;
};
import { UploadErrorCodes as EC } from "./error_codes";
import { imageSize } from "image-size";
import FileTypes from "./file_types";
import type { ISize } from "image-size/types/interface";
import type { UploadResolved } from "@/codegen";
import { UploadRawModel } from "@/codegen/models";
export const mime_types = FileTypes.reduce((ns: Record<string, string>, v) => ({ ...ns, [v.mime]: v.ext }), {});

export type UploadStartConfig = { folder_name: string; owner_uuid: string };

const dev_log = (msg: any, tag = "DEV_LOG") => console.log(`[${tag}]`, msg);

export const default_upload_start_config = {
  folder_name: "shared",
  owner_uuid: "000000000000000000000000",
};

export type UploadGearBaseConfig = {
  url: string;
  sub_folder: string; // Uploads to => url + sub_folder + folder_name + file_name
};

export const default_upload_gear_base_config = {
  url: "https://sergazin.kz/uploads",
  sub_folder: "",
};

export default class UploadGearBase {
  config: UploadGearBaseConfig;
  constructor(config?: Partial<UploadGearBaseConfig>) {
    this.config = _merge({}, default_upload_gear_base_config, config);
  }

  async process_file(file: UploadedFile, relative_file_path: string): Promise<void> {
    dev_log({ relative_file_path, file }, "UPLOAD_PROCESSING_FILE");
  }

  async process_buffer(buffer: Buffer, relative_file_path: string): Promise<void> {
    dev_log({ relative_file_path, buffer_size: buffer.length }, "UPLOAD_PROCESSING_BUFFER");
  }

  async start(file: UploadedFile, _cfg: Partial<UploadStartConfig> = {}): Promise<UploadResolved> {
    // Start Upload
    let { config } = this;
    const cfg = _merge({}, default_upload_start_config, _cfg);

    dev_log(file.mimetype, "UPLOAD");

    let { ext, meta, uuid, real_name, hash, size, uploaded_file_name } = this.get_file_params(file);
    const relative_file_path = `${this.config.sub_folder ? this.config.sub_folder + "/" : ""}${
      cfg.folder_name
    }/${uploaded_file_name}`;

    await this.process_file(file, relative_file_path);

    let uploaded_file = await UploadRawModel.findOne({
      hash,
      owner_uuid: cfg.owner_uuid,
    });

    if (!uploaded_file) {
      uploaded_file = await UploadRawModel.create({
        name: real_name,
        uuid,
        size,
        hash,
        ext,
        meta,
        owner_uuid: cfg.owner_uuid,
        path: relative_file_path,
        url: `${config.url}/${relative_file_path}`,
      });
    }
    return {
      ...uploaded_file.toObject(),
      url: `${config.url}/${uploaded_file.path}`,
    };
  }

  async start_buffer(upload_data: BufferUploadData, _cfg: Partial<UploadStartConfig> = {}): Promise<UploadResolved> {
    // Start Buffer Upload
    let { config } = this;
    const cfg = _merge({}, default_upload_start_config, _cfg);

    dev_log(upload_data.mimetype, "BUFFER_UPLOAD");

    let { ext, meta, uuid, real_name, hash, size, uploaded_file_name } = this.get_buffer_params(upload_data);
    const relative_file_path = `${this.config.sub_folder ? this.config.sub_folder + "/" : ""}${
      cfg.folder_name
    }/${uploaded_file_name}`;

    await this.process_buffer(upload_data.buffer, relative_file_path);

    let uploaded_file = await UploadRawModel.findOne({
      hash,
      owner_uuid: cfg.owner_uuid,
    });

    if (!uploaded_file) {
      uploaded_file = await UploadRawModel.create({
        name: real_name,
        uuid,
        date: new Date(),
        size,
        hash,
        ext,
        meta,
        owner_uuid: cfg.owner_uuid,
        path: relative_file_path,
        url: `${config.url}/${relative_file_path}`,
      });
    }

    return {
      ...uploaded_file.toObject(),
      url: `${config.url}/${uploaded_file.path}`,
    };
  }

  get_file_params(file: UploadedFile) {
    let ext = path.extname(file.name).replace(".", "").toLowerCase();
    if (!ext) {
      if (!mime_types[file.mimetype]) {
        throw new Error(EC.MIMETYPE_NOT_SUPPORTED);
      }
      ext = mime_types[file.mimetype];
    }

    let meta: { size?: ISize; sha256?: string } = {};
    if (["jpg", "jpeg", "png", "gif", "tiff", "bmp"].indexOf(ext) != -1) {
      try {
        meta.size = imageSize(file.data);
      } catch (error) {
        ext = "imgbrk";
      }
    }

    const uuid = v4();
    const uploaded_file_name = uuid + "." + ext;

    const hash = computeSha256(file.data);
    return {
      ext, // file extentin
      meta,
      uuid,
      uploaded_file_name,
      real_name: file.name,
      size: file.size,
      hash,
    };
  }

  get_buffer_params(upload_data: BufferUploadData) {
    let ext = path.extname(upload_data.filename).replace(".", "").toLowerCase();
    if (!ext) {
      if (!mime_types[upload_data.mimetype]) {
        throw new Error(EC.MIMETYPE_NOT_SUPPORTED);
      }
      ext = mime_types[upload_data.mimetype];
    }

    let meta: { size?: ISize; sha256?: string } = {};
    if (["jpg", "jpeg", "png", "gif", "tiff", "bmp"].indexOf(ext) != -1) {
      try {
        meta.size = imageSize(upload_data.buffer);
      } catch (error) {
        ext = "imgbrk";
      }
    }

    const uuid = v4();
    const uploaded_file_name = uuid + "." + ext;

    const hash = computeSha256(upload_data.buffer);
    const size = upload_data.size || upload_data.buffer.length;

    return {
      ext, // file extension
      meta,
      uuid,
      uploaded_file_name,
      real_name: upload_data.filename,
      size,
      hash,
    };
  }
}
