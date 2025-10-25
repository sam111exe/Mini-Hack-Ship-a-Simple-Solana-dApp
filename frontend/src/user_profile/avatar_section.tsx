import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/custom/image_uploader";
import { cn } from "@/lib/utils";

type AvatarSectionProps = {
  avatar_url?: string;
  name?: string;
  on_avatar_change: (url: string) => void;
  className?: string;
};

export function AvatarSection({ 
  avatar_url, 
  name, 
  on_avatar_change, 
  className 
}: AvatarSectionProps) {
  const [is_editing, set_is_editing] = useState(false);

  const get_initials = () => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handle_avatar_change = (url: string) => {
    on_avatar_change(url);
    if (url) {
      set_is_editing(false);
    }
  };

  const handle_edit_click = () => {
    set_is_editing(true);
  };

  const handle_cancel_edit = () => {
    set_is_editing(false);
  };

  if (is_editing) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
        
        <ImageUploader
          value={avatar_url}
          onChange={handle_avatar_change}
          className="max-w-sm"
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handle_cancel_edit}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={`${name || "User"}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {get_initials()}
            </div>
          )}
          
          {/* Online indicator - social network style */}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">
            {avatar_url ? "Your profile picture" : "No profile picture set"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handle_edit_click}
          >
            <i className="bx bx-camera mr-2"></i>
            {avatar_url ? "Change Picture" : "Upload Picture"}
          </Button>
        </div>
      </div>
    </div>
  );
}
