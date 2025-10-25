import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Uploader } from "@/components/custom/uploader";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  value?: string;
  onChange: (image_url: string) => void;
  className?: string;
};

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [is_dialog_open, set_is_dialog_open] = useState(false);

  const handle_upload_success = (image_url: string) => {
    onChange(image_url);
    set_is_dialog_open(false);
  };

  const handle_delete = () => {
    onChange("");
  };

  const handle_reupload = () => {
    set_is_dialog_open(true);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img src={value} alt="Uploaded image" className="w-full h-64 object-cover" />
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handle_delete} className="flex-1">
              <i className="bx bx-trash mr-2"></i>
              Delete
            </Button>
            <Button variant="outline" onClick={handle_reupload} className="flex-1">
              <i className="bx bx-refresh mr-2"></i>
              Reupload
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => set_is_dialog_open(true)}
          variant="outline"
          className="  border-dashed h-12 text-center flex items-center leading-none py-0 justify-center gap-2 "
        >
          <i className="bx bx-cloud-upload text-3xl"></i>
          <div className="flex items-center justify-center leading-none">Upload Image</div>
        </Button>
      )}

      <Dialog open={is_dialog_open} onOpenChange={set_is_dialog_open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Uploader value="" onChange={handle_upload_success} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
