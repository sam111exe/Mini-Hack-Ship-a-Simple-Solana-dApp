import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RealAssetType, type ExploreFilter } from "@/codegen";
import { get_real_asset_type_label_text, get_asset_type_icon } from "../my_real_assets/utils";
import { AreaMapPicker } from "@/components/custom/area_map_picker";

interface ExploreFiltersProps {
  filter: ExploreFilter;
  onFilterChange: (filter: ExploreFilter) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const ExploreFilters: React.FC<ExploreFiltersProps> = ({
  filter,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
}) => {
  const [local_filter, set_local_filter] = useState<ExploreFilter>(filter);
  const [auto_apply, set_auto_apply] = useState<boolean>(false);

  // Debounced auto-apply functionality
  const debounced_apply = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (auto_apply) {
            onApplyFilters();
          }
        }, 800); // 800ms delay
      };
    })(),
    [auto_apply, onApplyFilters],
  );

  const update_local_filter = (updates: Partial<ExploreFilter>) => {
    const new_filter = { ...local_filter, ...updates };
    set_local_filter(new_filter);
    onFilterChange(new_filter);

    if (auto_apply) {
      debounced_apply();
    }
  };

  // Update local filter when prop changes
  useEffect(() => {
    set_local_filter(filter);
  }, [filter]);

  const toggle_asset_type = (asset_type: RealAssetType) => {
    const current_types = local_filter.asset_type_list || [];
    const is_selected = current_types.includes(asset_type);

    let new_types: RealAssetType[];
    if (is_selected) {
      new_types = current_types.filter((type) => type !== asset_type);
    } else {
      new_types = [...current_types, asset_type];
    }

    update_local_filter({
      asset_type_list: new_types.length > 0 ? new_types : undefined,
    });
  };

  const handle_price_change = (field: "min_price" | "max_price", value: string) => {
    const price = value ? parseFloat(value) : undefined;
    if (!value || !isNaN(price!)) {
      update_local_filter({ [field]: price });
    }
  };

  const handle_location_area_change = (location_area: import("@/codegen").Geopoint[]) => {
    update_local_filter({
      location_area: location_area.length > 0 ? location_area : undefined,
    });
  };

  const get_active_filters_count = () => {
    let count = 0;
    if (local_filter.asset_type_list && local_filter.asset_type_list.length > 0) count++;
    if (local_filter.min_price !== undefined) count++;
    if (local_filter.max_price !== undefined) count++;
    if (local_filter.location_area && local_filter.location_area.length > 0) count++;
    return count;
  };

  const is_filter_empty = () => {
    return (
      !local_filter.asset_type_list?.length &&
      !local_filter.min_price &&
      !local_filter.max_price &&
      !local_filter.location_area?.length
    );
  };

  return (
    <Card className="p-6 space-y-6 sticky top-6 min-w-[340px] fixed right-2 max-w-[340px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="bx bx-filter text-xl text-primary"></i>
          <h3 className="text-lg font-semibold">Filters</h3>
          {get_active_filters_count() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {get_active_filters_count()} active
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClearFilters} disabled={loading || is_filter_empty()}>
            <i className="bx bx-x mr-1"></i>
            Clear
          </Button>
          {!auto_apply && (
            <Button size="sm" onClick={onApplyFilters} disabled={loading}>
              {loading ? <i className="bx bx-loader-alt bx-spin mr-1"></i> : <i className="bx bx-search mr-1"></i>}
              {loading ? "Searching..." : "Apply"}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Auto-apply toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium flex items-center gap-2">
            <i className="bx bx-zap text-primary"></i>
            Auto-apply filters
          </Label>
          <p className="text-xs text-muted-foreground">Automatically search when filters change</p>
        </div>
        <Switch checked={auto_apply} onCheckedChange={set_auto_apply} disabled={loading} />
      </div>

      <Separator />

      {/* Asset Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <i className="bx bx-category text-primary"></i>
          Asset Types
        </Label>
        <div className="flex flex-wrap gap-2">
          {Object.values(RealAssetType).map((type) => {
            const is_selected = local_filter.asset_type_list?.includes(type) || false;
            return (
              <Button
                key={type}
                variant={is_selected ? "default" : "outline"}
                size="sm"
                onClick={() => toggle_asset_type(type)}
                className="h-8 px-3 text-xs"
              >
                <i className={`bx ${get_asset_type_icon(type)} mr-1`}></i>
                {get_real_asset_type_label_text(type)}
              </Button>
            );
          })}
        </div>
        {local_filter.asset_type_list && local_filter.asset_type_list.length > 0 && (
          <p className="text-xs text-muted-foreground">{local_filter.asset_type_list.length} type(s) selected</p>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <i className="bx bx-dollar text-primary"></i>
          Price Range (USD)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              Minimum
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={local_filter.min_price || ""}
              onChange={(e) => handle_price_change("min_price", e.target.value)}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              Maximum
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="No limit"
              value={local_filter.max_price || ""}
              onChange={(e) => handle_price_change("max_price", e.target.value)}
              className="h-8"
            />
          </div>
        </div>
        {(local_filter.min_price || local_filter.max_price) && (
          <p className="text-xs text-muted-foreground">
            {local_filter.min_price ? `From $${local_filter.min_price.toLocaleString()}` : "No minimum"}
            {" - "}
            {local_filter.max_price ? `to $${local_filter.max_price.toLocaleString()}` : "no maximum"}
          </p>
        )}
      </div>

      <Separator />

      {/* Location Area */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <i className="bx bx-map text-primary"></i>
          Location Area
        </Label>
        <AreaMapPicker value={local_filter.location_area || []} onChange={handle_location_area_change} />
        {local_filter.location_area && local_filter.location_area.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Geographic area filter active with {local_filter.location_area.length} boundary points
          </p>
        )}
      </div>
    </Card>
  );
};
