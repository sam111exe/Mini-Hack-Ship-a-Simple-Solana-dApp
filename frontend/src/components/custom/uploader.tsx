import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { upload_start, image_mime_types } from "@/lib/uploader";
import { cn } from "@/lib/utils";

type UploaderProps = {
  value?: string;
  onChange: (image_url: string) => void;
  className?: string;
};

export function Uploader({ value, onChange, className }: UploaderProps) {
  const [is_uploading, set_is_uploading] = useState(false);
  const [is_dragging, set_is_dragging] = useState(false);
  const input_ref = useRef<HTMLInputElement>(null);

  const handle_upload = useCallback(async (file: File) => {
    if (!Object.values(image_mime_types).includes(file.type)) {
      alert("Please select a valid image file (PNG, JPG, JPEG, SVG, WebP)");
      return;
    }

    set_is_uploading(true);
    try {
      const file_url = await upload_start(file);
      onChange(file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      set_is_uploading(false);
    }
  }, [onChange]);

  const handle_file_select = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handle_upload(file);
    }
  }, [handle_upload]);

  const handle_drag_over = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    set_is_dragging(true);
  }, []);

  const handle_drag_leave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    set_is_dragging(false);
  }, []);

  const handle_drop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    set_is_dragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handle_upload(file);
    }
  }, [handle_upload]);

  const handle_click = useCallback(() => {
    input_ref.current?.click();
  }, []);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={input_ref}
        type="file"
        accept={Object.values(image_mime_types).join(",")}
        onChange={handle_file_select}
        className="hidden"
      />
      
      <div
        onClick={handle_click}
        onDragOver={handle_drag_over}
        onDragLeave={handle_drag_leave}
        onDrop={handle_drop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          is_dragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400",
          is_uploading && "pointer-events-none opacity-50"
        )}
      >
        {value ? (
          <div className="space-y-2">
            <img
              src={value}
              alt="Uploaded"
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <p className="text-sm text-gray-600">Click or drag to replace image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <i className="bx bx-cloud-upload text-4xl text-gray-400"></i>
            <div>
              <p className="text-lg font-medium">Drop your image here</p>
              <p className="text-sm text-gray-600">or click to browse</p>
            </div>
          </div>
        )}
        
        {is_uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <LoadingSpinner isLoading={true} size="lg" />
          </div>
        )}
      </div>
    </div>
  );
}