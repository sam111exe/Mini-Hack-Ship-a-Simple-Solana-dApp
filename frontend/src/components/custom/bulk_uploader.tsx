import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { upload_start, image_mime_types } from "@/lib/uploader";
import { cn } from "@/lib/utils";

type BulkUploaderProps = {
  value: string[];
  onChange: (image_urls: string[]) => void;
  className?: string;
};

export function BulkUploader({ value, onChange, className }: BulkUploaderProps) {
  const [is_uploading, set_is_uploading] = useState(false);
  const [is_dragging, set_is_dragging] = useState(false);
  const [drag_index, set_drag_index] = useState<number | null>(null);
  const input_ref = useRef<HTMLInputElement>(null);

  const handle_upload = useCallback(async (files: FileList) => {
    const valid_files = Array.from(files).filter(file => 
      Object.values(image_mime_types).includes(file.type)
    );

    if (valid_files.length === 0) {
      alert("Please select valid image files (PNG, JPG, JPEG, SVG, WebP)");
      return;
    }

    set_is_uploading(true);
    try {
      const upload_promises = valid_files.map(file => upload_start(file));
      const uploaded_urls = await Promise.all(upload_promises);
      onChange([...value, ...uploaded_urls]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      set_is_uploading(false);
    }
  }, [value, onChange]);

  const handle_file_select = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handle_upload(files);
    }
    e.target.value = '';
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
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handle_upload(files);
    }
  }, [handle_upload]);

  const handle_click = useCallback(() => {
    input_ref.current?.click();
  }, []);

  const handle_remove = useCallback((index: number) => {
    const new_urls = value.filter((_, i) => i !== index);
    onChange(new_urls);
  }, [value, onChange]);

  const handle_drag_start = useCallback((e: React.DragEvent, index: number) => {
    set_drag_index(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handle_drag_over_item = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handle_drop_item = useCallback((e: React.DragEvent, drop_index: number) => {
    e.preventDefault();
    
    if (drag_index === null || drag_index === drop_index) {
      set_drag_index(null);
      return;
    }

    const new_urls = [...value];
    const dragged_item = new_urls[drag_index];
    new_urls.splice(drag_index, 1);
    new_urls.splice(drop_index, 0, dragged_item);
    
    onChange(new_urls);
    set_drag_index(null);
  }, [value, onChange, drag_index]);

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={input_ref}
        type="file"
        multiple
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
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative",
          is_dragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400",
          is_uploading && "pointer-events-none opacity-50"
        )}
      >
        <div className="space-y-2">
          <i className="bx bx-cloud-upload text-4xl text-gray-400"></i>
          <div>
            <p className="text-lg font-medium">Drop your images here</p>
            <p className="text-sm text-gray-600">or click to browse (multiple files supported)</p>
          </div>
        </div>
        
        {is_uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <LoadingSpinner isLoading={true} size="lg" />
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Images ({value.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={(e) => handle_drag_start(e, index)}
                onDragOver={(e) => handle_drag_over_item(e, index)}
                onDrop={(e) => handle_drop_item(e, index)}
                className={cn(
                  "relative group border rounded-lg overflow-hidden cursor-move transition-all",
                  drag_index === index && "opacity-50 scale-95"
                )}
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handle_remove(index);
                    }}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="bx bx-x text-xs"></i>
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Drag images to reorder them
          </p>
        </div>
      )}
    </div>
  );
}