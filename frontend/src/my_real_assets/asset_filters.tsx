import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RealAssetStatus, RealAssetType } from "@/codegen";

interface AssetFiltersProps {
  searchText: string | undefined;
  status: RealAssetStatus | undefined;
  assetType: RealAssetType | undefined;
  showArchived: boolean | undefined;
  onSearchTextChange: (value: string) => void;
  onStatusChange: (value: RealAssetStatus | undefined) => void;
  onAssetTypeChange: (value: RealAssetType | undefined) => void;
  onShowArchivedChange: (value: boolean) => void;
}

export function AssetFilters({
  searchText,
  status,
  assetType,
  showArchived,
  onSearchTextChange,
  onStatusChange,
  onAssetTypeChange,
  onShowArchivedChange,
}: AssetFiltersProps) {
  return (
    <div className="flex-1 flex gap-4 items-center">
      <Input
        placeholder="Search assets..."
        value={searchText || ""}
        onChange={(e) => onSearchTextChange(e.target.value)}
        className="max-w-xs  bg-white"
      />
      <Select
        value={status || "all"}
        onValueChange={(value) => onStatusChange(value === "all" ? undefined : (value as RealAssetStatus))}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {Object.values(RealAssetStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={assetType || "all"}
        onValueChange={(value) => onAssetTypeChange(value === "all" ? undefined : (value as RealAssetType))}
      >
        <SelectTrigger className="w-[180px]  bg-white">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.values(RealAssetType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-archived"
          checked={showArchived || false}
          onCheckedChange={(checked) => onShowArchivedChange(checked === true)}
        />
        <label
          htmlFor="show-archived"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Archived
        </label>
      </div>
    </div>
  );
}
