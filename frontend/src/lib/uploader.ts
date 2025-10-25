// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================

import { api } from "@/api";

export const mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// MIME types for image uploads
const image_mime_types = {
  png: "image/png",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

function upload_start(files: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const file_b64 = new FileReader();
    file_b64.onload = async () => {
      const file_data = (file_b64.result as string).split(",")[1] as string;
      if (!file_data) return reject("File data is empty");
      try {
        const { file_url } = await api.upload({
          file_bytes_b64: file_data,
          file_name: files.name,
          file_mime_type: files.type,
        });
        resolve(file_url);
      } catch (e) {
        reject(e);
      }
    };
    file_b64.readAsDataURL(files);
  });
}

export type ChooseFilesConfig = {
  multiple?: boolean;
  accept?: string[]; // MIME TYPES
};

const defaultConfig: Required<ChooseFilesConfig> = {
  multiple: false,
  accept: [mime_type],
};

function choose_files(_cfg: Partial<ChooseFilesConfig> & { multiple: true }): Promise<File[]>;
function choose_files(_cfg: Partial<ChooseFilesConfig> & { multiple: false | undefined }): Promise<File>;
function choose_files(_cfg?: ChooseFilesConfig): Promise<File>;
function choose_files(_cfg: ChooseFilesConfig = {}): Promise<File[] | File> {
  return new Promise((resolve, reject) => {
    const cfg = { ...defaultConfig, ..._cfg };
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.multiple = cfg.multiple;
    if (cfg.accept.length > 0) input.accept = cfg.accept.join(", ");
    input.addEventListener("change", async () => {
      if (input.files === null || input.files.length === 0) return reject(null);
      const files: FileList = input.files;
      const filesToUpload: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (cfg.accept.length === 0 || cfg.accept.indexOf(files[i].type) !== -1) filesToUpload.push(files[i]);
      }

      if (filesToUpload.length) {
        resolve(cfg.multiple ? filesToUpload : filesToUpload[0]);
      } else reject(null);
      input.remove();
    });

    function initCheck() {
      document.body.onfocus = () => {
        setTimeout(() => {
          if (input.files === null || input.files.length === 0) reject(null);
        }, 400);
        document.body.onfocus = null;
      };
    }

    input.addEventListener("click", initCheck);
    input.click();
  });
}

export { choose_files, upload_start, image_mime_types };
