import React from "react";

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <i className="bx bx-folder-open text-6xl text-muted-foreground mb-4"></i>
        <p className="text-xl text-muted-foreground mb-2">No assets found</p>
        <p className="text-sm text-muted-foreground">Create your first real estate asset to get started</p>
      </div>
    </div>
  );
}